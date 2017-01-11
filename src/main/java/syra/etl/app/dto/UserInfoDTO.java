package syra.etl.app.dto;

import syra.etl.app.model.Account;

/**
 *
 * JSON-serializable DTO containing user data
 *
 */
public class UserInfoDTO {

    private String userName;
    private long accountId;
    private long userId;
    private String userRole;

    public UserInfoDTO(String userName ,Account account,long userId,String userRole) {
        this.userName = userName;
        this.accountId=account.getAccountid();
        this.userId=userId;
        this.userRole=userRole;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public long getaccountId() {
        return accountId;
    }

    public void setaccountId(long accountId) {
        this.accountId = accountId;
    }
    
    public long getuserId() {
        return userId;
    }

    public void setuserId(long userId) {
        this.userId = userId;
    }
    
    public String getRole() {
        return userRole;
    }
    
    public void setRole(String userRole) {
        this.userRole = userRole;
    }
}
