package syra.etl.app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

@Entity
@Table(name = "JOB")
@NamedQueries({
	   @NamedQuery(
	           name =  Job.FIND_BY_USERID,
	           query = "select j from Job j where user_id = :user_id"
	   )
	 
	})

public class Job {

	public static final String FIND_BY_USERID = "Job.findByUserId";

    
    @ManyToOne
    private User user;
    
    
    @ManyToOne        
    private ServerCredentials server;
    
    @ManyToOne          
    private S3Credentials s3; 
    
	@Id
    @GeneratedValue
    private Long id;
	
	private String JobbucketName;
	private String JobfolderName;
	private String JobfilesJson;
	
	public Job() {
		// TODO Auto-generated constructor stub
	}



	public Job(User user ,ServerCredentials server ,S3Credentials s3 ,String bucketname, String foldername,String filesJson) {
		super();
		this.user = user; 
		this.server = server; 
		this.s3 = s3;
		this.JobbucketName = bucketname;
		this.JobfolderName = foldername;
		this.JobfilesJson = filesJson;
	}
      		
      		 
      		
  		@ManyToOne
  		public User getUser() {
  			return user;
  		}
  
  		public void setUser(User user) {
  			this.user = user;
  		}
  		
  		@ManyToOne
  		public ServerCredentials getServerCredentials() {
  			return server;
  		}
  
  		public void setServerCredentials(ServerCredentials server) {
  			this.server = server;
  		}
  		
  		@ManyToOne
  		public S3Credentials getS3Credentials() {
  			return s3;
  		}
  
  		public void setS3Credentials(S3Credentials s3) {
  			this.s3 = s3;
  		}
  		
      		 
  		public void setId(Long id) {
  			this.id = id;
  		}
  		
  		public Long getId() {
  	        return id;
  	    }
      	
		public String getBucketName() {
			return JobbucketName;
		}

		public void setBucketName(String bucketname) {
			this.JobbucketName = bucketname;
		}
 
		public String getFolderName() {
			return JobfolderName;
		}

		public void setFolderName(String foldername) {
			this.JobfolderName = foldername;
		}
 
		public String getFilesJson() {
			return JobfilesJson;
		}

		public void setFilesJson(String filesJson) {
			this.JobfilesJson = filesJson;
		}
  		
}