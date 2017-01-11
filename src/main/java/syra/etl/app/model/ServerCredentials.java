package syra.etl.app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
*
* The SERVERCREDENTIALS JPA entity
*
*/
@Entity
@Table(name = "SERVERCREDENTIALS")

@NamedQueries({
   @NamedQuery(
           name =  ServerCredentials.FIND_BY_USERID,
           query = "select server from ServerCredentials server where user_id = :user_id"
   ),
   @NamedQuery(
           name =  ServerCredentials.FIND_BY_SERVERCREDENTIALSID,
           query = "select server from ServerCredentials server where id = :id"
   )
 
})

public class ServerCredentials {

	public static final String FIND_BY_USERID = "ServerCredentials.findByUserId";
	public static final String FIND_BY_SERVERCREDENTIALSID = "ServerCredentials.findById";

	@Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;

/*	ServerName: '',
 */
	 
	private String ServerName;
	private Long  port;
	private String username;
	private String password;
	private String ipaddress;

	public ServerCredentials() {
		
	}
	
	 
	public ServerCredentials(User user ,String ServerName,Long port,String username,String password,String ipaddress) {
		super();
		this.user = user;
		this.ServerName  = ServerName;
		this.port  = port;
		this.username = username;
		this.password = password;
		this.ipaddress = ipaddress;
	}
	
	@ManyToOne
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	 
	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getId() {
        return id;
    }
	
	 
	public String getServerName() {
		return ServerName;
	}

	public void setServerName(String ServerName) {
		this.ServerName = ServerName;
	}

	public Long getport() {
		return port;
	}

	public void setport(Long port) {
		this.port = port;
	}

	public String getusername() {
		return username;
	}

	public void setusername(String username) {
		this.username = username;
	}
	
	public String getpassword() {
		return password;
	}

	public void setpassword(String password) {
		this.password = password;
	}
	
	public String getipaddress() {
		return ipaddress;
	}

	public void setipaddress(String ipaddress) {
		this.ipaddress = ipaddress;
	}
	 
}
