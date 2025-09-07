#include<stdio.h>

float Balance = 0.0;

int Deposit_Money(){
    float amount;

    printf("\n---- DEPOSTI OPTION ----\n");
    printf("Enter amount you want to deposit: ");
    scanf("%f",&amount);
    if (amount > 0)
    {
        Balance += amount;
        printf("Successfully deposited %.2f MAD\n", amount);
    }
    else
    {
        printf("Invalid amount! Try again.\n");
    }
    
    

}

int Withdraw_Money(){

    float amount;

    printf("\n---- WITHDRAW OPTION ----\n");
    printf("Enter amount you want to withdraw: ");
    scanf("%f",&amount);
    if (amount > 0 && amount <= Balance)
    {
        Balance -= amount;
        printf("Successfully deposited %.2f MAD\n", amount);
    }
    else if (amount > Balance)
    {
        printf("nsufficient balance!\n");
    }
    else
    {
        printf("Invalid amount! Try again.\n");
    }
    
}


int Check_Balance_Money(){
    printf("\n---- CHECK BALANCE OPTION ----\n");
    printf("Your balance is: %.2f MAD\n", Balance);
    if (Balance == 0)
    {
        printf("No money on your account! \n");
    }
    

}


int main(){

    int choice;
    int pass_word,attempts = 0;
    const correct_pass_word = 1234;

    do
    {
        printf("Enter the password : ");
        scanf("%d",&pass_word);

    if (pass_word == correct_pass_word)
    {
        printf("Login successful, welcome! ✅ \n");
    }
    else
    {
        printf("Incorrect password ❌, try again .\n");
        attempts++;
    }
    if (attempts == 4)
    {
        printf("too many attempts ! Access Denied .\n");
        return 0;
    }
    
    
    } while (pass_word != correct_pass_word);
    
    

    do
    {
        printf("\n --- CENTRAL BANK --- \n");
        printf("----   Deposit ----\n");
        printf("----   Withdraw -----\n");
        printf("----   Chack Balance ----\n");
        printf("----   Exit          ----\n");
        printf("Enter your Choice sir : ");
        scanf("%d",&choice);

        switch (choice)
        {
        case 1: Deposit_Money();break;
        case 2: Withdraw_Money();break;
        case 3: Check_Balance_Money();break;
        case 4: printf("\nThank your for visiting us sir ! Goodbay\n");break;
        default:printf("Invalide Choice ! , Tray again.");break;
        }
    } while (choice != 4);
    
}