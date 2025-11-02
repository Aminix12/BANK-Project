'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret, customerEmail, customerName }: { clientSecret: string; customerEmail: string; customerName: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart, getCartTotal } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map(item => ({
              productId: item.productId,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            total: getCartTotal(),
            customerEmail,
            customerName,
            paymentIntentId: paymentIntent.id,
          }),
        });

        if (orderResponse.ok) {
          clearCart();
          router.push('/checkout/success');
        } else {
          setError('Order creation failed. Please contact support.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay $${getCartTotal().toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCreatePaymentIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerEmail || !customerName) {
      return;
    }

    setIsCreatingIntent(true);

    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getCartTotal(),
          customerEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error('Failed to create payment intent:', error);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.title} x {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {!clientSecret ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h2>
              <form onSubmit={handleCreatePaymentIntent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="john@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreatingIntent}
                  className="w-full py-3 px-6 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isCreatingIntent ? 'Loading...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  customerEmail={customerEmail}
                  customerName={customerName}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
