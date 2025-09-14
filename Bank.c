#include <stdio.h>
#include <string.h>

#define MAX_ACCOUNT 100

struct Account
{
    int accountID;
    char name[50];
    float balance;
};

struct Account Accounts[MAX_ACCOUNT];
int accountCount = 0;


int Create_Account(){

    printf("=== Create Account ===\n");

    struct Account NewAccount;
    NewAccount.accountID = accountCount + 1;

    printf("Enter Name: ");
    scanf("%s",&NewAccount.name);

    printf("Enter Initial Balance: ");
    scanf("%f",&NewAccount.balance);

    Accounts[accountCount ++] = NewAccount;

    printf("\n Account create with | ID: %d | Name: %s |\n",NewAccount.accountID,NewAccount.name);


    return 0;
}

int List_Account(){
    
    printf("=== List Account Option ===\n");

    for (int i = 0; i < accountCount; i++)
    {
        printf("\n| ID: %d | Name: %s |Balance %.2f MAD|\n",
            Accounts[i].accountID,
            Accounts[i].name,
            Accounts[i].balance);
    }

    return 0;

}

int Remove_Account(){
    
    printf("=== Remove Account Option ===\n");

    int id,found = 0;
    printf("Enter Account ID to remove: ");
    scanf("%d",&id);

    for (int i = 0; i < accountCount; i++)
    {
        if (Accounts[i].accountID == id)
        {
            found = 1;
            for (int j = i; j < accountCount - 1;j++)
            {
                Accounts[j] = Accounts[j + 1];

            }
            accountCount--;
            printf("Account ID | %d | removed successfully\n",id);
            break;
            
        }
        
    }
    if (!found)
    {
        printf("Account ID | %d |not existe \n",id);
    }
    
    return 0;
}


int Deposit_Account(){

    int id,found = 0;
    float amount;

    printf("=== Deposit Account Option ===\n");

    printf("Enter Account ID: ");
    scanf("%d",&id);

    for (int i = 0; i < accountCount; i++)
    {
        if (Accounts[i].accountID == id)
        {
            found = 1;
            printf("Deposit money: ");
            scanf("%f",&amount);

            if (amount > 0)
            {
                Accounts[i].balance += amount;
                printf("Successfully deposited %.2f MAD to Account ID: %d \n",amount,id);
            }
            else
            {
                printf("Invalid amount!\n");
            }
            break;
            
        }
        
    }
    if (!found)
    {
        printf("Account ID | %d |not existe \n",id);
    }

    return 0;   
}


int Withdraw_Account(){

    int id,found = 0;
    float amount;

    printf("=== Withdraw Account Option ===\n");

    printf("Enter Account ID: ");
    scanf("%d",&id);

    for (int i = 0; i < accountCount; i++)
    {
        if (Accounts[i].accountID == id)
        {
            found = 1;
            printf("Withdraw money: ");
            scanf("%f",&amount);

            if (amount > 0 && amount <= Accounts[i].balance)
            {
                Accounts[i].balance -= amount;
                printf("Successfully withdrawn %.2f MAD to Account ID: %d \n",amount,id);
            }
            else
            {
                printf("Unsuccessfully Balance of Invalide amount!\n");
            }
            break;
            
        }
        
    }
    if (!found)
    {
        printf("Account ID | %d |not existe \n",id);
    }
    
    return 0;  
}


int Transfer_Account(){

    int fromID,toID,foundFrom = -1,foundTo = -1;
    float amount;
    
    printf("=== Transfer Account Option ===\n");

    
    printf("From Acount ID: ");
    scanf("%d",&fromID);
    printf("To Account ID: ");
    scanf("%d",&toID);
    printf("Amount to Transfer: ");
    scanf("%f",&amount);

    for (int i = 0; i < accountCount; i++)
    {
        if (Accounts[i].accountID == fromID) { 
            foundFrom = i;
        }
        if (Accounts[i].accountID == toID) { 
            foundTo = i;
        }

        if (foundFrom == -1 || foundTo == -1)
        {
            printf("Account ID not Existe!\n");
            return 0;
        }
        else if (amount > 0 && amount <= Accounts[foundFrom].balance)
        {
            Accounts[foundFrom].balance -=amount;
            Accounts[foundTo].balance +=amount;
            printf("Transferred %.2f MAD From Account ID %d to Account ID %d \n",amount,fromID,toID);
        }
        else
        {
            printf("Insufficient balance or invalid amount!\n");
        } 
        
    }
    

    return 0;    
}

int Check_Balance(){
    
    int id,found = 0;

    printf("=== Check Balance Option ===\n");
    
    printf("Enter Account ID: ");
    scanf("%d",&id);

    for (int i = 0; i < accountCount; i++)
    {
        if (Accounts[i].accountID == id){
            found = 1;
            printf("\n| ID: %d | Name: %s |Balance %.2f MAD|\n",
            Accounts[i].accountID,
            Accounts[i].name,
            Accounts[i].balance);
            break;
        }

    }
    if (!found)
    {
        printf("Account ID | %d |not existe \n",id);
    }    
    return 0;
}




int main(){
    int choice;
    int correct_password = 1213;
    int password,attempts = 0;

    do
    {
        printf("Password: ");
        scanf("%d",&password);

        if (password == correct_password)
        {
            printf("Successfully Login.");
            break;
        }
        else
        {
            printf("Unsuccessfully Login! Try again\n");
            attempts++;
        }
        if (attempts == 3)
        {
            printf("too many attempts ! Access Denied ");
            return 0;
        }
        
        
    } while (password != correct_password);


   do{
        printf("\n--- BANK MANAGEMENT ---\n");
        printf(" 1. Create Account \n");
        printf(" 2. List Accounts \n");
        printf(" 3. Remove Account \n");
        printf(" 4. Deposit \n");
        printf(" 5. Withdraw \n");
        printf(" 6. Transfer \n");
        printf(" 7. Check Balance \n");
        printf(" 8. Exit \n");
        printf("Enter a Choice: ");
        scanf("%d",&choice);
    switch (choice)
    {
    case 1:Create_Account();break;
    case 2:List_Account();break;
    case 3:Remove_Account();break;
    case 4:Deposit_Account();break;
    case 5:Withdraw_Account();break;
    case 6:Transfer_Account();break;
    case 7:Check_Balance();break;
    case 8:printf("Exiting... ");;break;
    
    default:printf("Invalide Choice! Try again.\n");;break;
    }

   } while (choice != 8);
   
}