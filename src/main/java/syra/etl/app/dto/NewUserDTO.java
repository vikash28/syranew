package syra.etl.app.dto;

import syra.etl.app.model.Account;

/**
 *
 * DTO used only for posting new users for creation
 *
 */
public class NewUserDTO {

    private String username;
    private String email;
    private String plainTextPassword;
    private Account account_id;

    public NewUserDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Account getaccount_id() {
        return account_id;
    }

    public void setaccount_id(Account account_id) {
        this.account_id = account_id;
    }

    public String getPlainTextPassword() {
        return plainTextPassword;
    }

    public void setPlainTextPassword(String plainTextPassword) {
        this.plainTextPassword = plainTextPassword;
    }
}
