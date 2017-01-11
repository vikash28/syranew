package syra.etl.app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
//import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
//import javax.persistence.NamedQueries;
//import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
*
* The User Role JPA entity.
*
*/
@Entity
@Table(name = "USERLOG")

 
public class UserLog {
	
	//public static final String FIND_BY_USERID = "userLog.findByUserId";

	
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    
    private String session_id;
    private String ip_address;
    private String user_agent;
    private String log_time;
    private String user_data;
    
    
    
    public UserLog()
    {
    	
    }
	  
    
    public UserLog(User user, String session_id,String ip_address,String user_agent,String log_time,String user_data)
    {
    	super();
		this.user = user;
		this.session_id = session_id;
		this.ip_address = ip_address;
		this.user_agent = user_agent;
		this.log_time = log_time;
		this.user_data = user_data;
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
	
	
	public String getSessionID() {
        return session_id;
    }

    public void setSessionID(String session_id) {
        this.session_id = session_id;
    }
    
    public String getIpAddress() {
        return ip_address;
    }

    public void setIpAddress(String ip_address) {
        this.ip_address = ip_address;
    }
    public String getUserAgent() {
        return user_agent;
    }

    public void setUserAgent(String user_agent) {
        this.user_agent = user_agent;
    }
    
    
    public String getLogTime() {
        return log_time;
    }

    public void setLogTime(String log_time) {
        this.log_time = log_time;
    }
    
    public String getUserDate() {
        return user_data;
    }

    public void setUserDate(String user_data) {
        this.user_data = user_data;
    }
}
