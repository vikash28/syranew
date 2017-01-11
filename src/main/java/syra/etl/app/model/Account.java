package syra.etl.app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
*
* The Account JPA entity.
*
*/
@Entity
@Table(name = "ACCOUNT")

public class Account {
	
	@Id
    @GeneratedValue
    private Long account_id;
    private String account_name;
    private String account_email;
    private int account_user_limit;
    private int account_status;
    
    public Account()
    {
    	
    }
	  
    
    public Account( String account_name ,String account_email ,int account_user_limit,int account_status)
    {
        this.account_name = account_name;
        this.account_email = account_email;
        this.account_user_limit = account_user_limit;
        this.account_status = account_status;
    }
	 
    public long  getAccountid() {
        return  account_id;
    }

    public String getAccountName() {
        return account_name;
    }

    public void setAccountName(String account_name) {
        this.account_name = account_name;
    }
    
    public String getAccountEmail() {
        return account_email;
    }

    public void setAccountEmail(String account_email) {
        this.account_email = account_email;
    }
    
    public int getAccountUserLimit() {
        return account_user_limit;
    }

    public void setAccountUserLimit(int account_user_limit) {
        this.account_user_limit = account_user_limit;
    }
    
    public int getAccountStatus() {
        return account_status;
    }

    public void setAccountStatus(int account_status) {
        this.account_status = account_status;
    }
    
    @Override
    public String toString() {
        return "Account{" +
                "account_id" + account_id + '\'' +
                ", account_name='" + account_name + '\'' +
                '}';
    }
}
