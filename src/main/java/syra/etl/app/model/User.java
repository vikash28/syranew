package syra.etl.app.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.JoinColumn;

/**
 *
 * The User JPA entity.
 *
 */
@Entity
@Table(name = "USERS")
 
@NamedQueries({
        @NamedQuery(
                name = User.FIND_BY_USERNAME,
                query = "select u from User u where username = :username"
        ),
        @NamedQuery(
                name = User.FIND_BY_USERID,
                query = "select u from User u where id = :id"
        )
})


public class User  {

    public static final String FIND_BY_USERNAME = "user.findByUserName";
    public static final String FIND_BY_USERID = "user.findByUserId";

    @Id
    @GeneratedValue
    private Long id;
    private String username;
    private String passwordDigest;
    private String email;
    private String role;
    
    
    @ManyToOne
    @JoinColumn(name="account_id")
    private Account account_id;

    public User() {

    }

    public User(String username, String passwordDigest, String email,String role,Account account_id) {
        this.username = username;
        this.passwordDigest = passwordDigest;
        this.email = email;
        this.role=role;
        this.account_id=account_id;
    }

    public Long getId() {
        return id;
    }
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordDigest() {
        return passwordDigest;
    }

    public void setPasswordDigest(String passwordDigest) {
        this.passwordDigest = passwordDigest;
    }

    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    @ManyToOne
    public Account getaccount_id() {
        return account_id;
    }

    public void setaccount_id(Account account_id) {
        this.account_id = account_id;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", account_id='" + account_id + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
