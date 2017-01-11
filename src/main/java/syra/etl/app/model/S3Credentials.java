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
* The S3CREDENTIALS JPA entity
*
*/
@Entity
@Table(name = "S3CREDENTIALS")

@NamedQueries({
   @NamedQuery(
           name =  S3Credentials.FIND_BY_USERID,
           query = "select s3 from S3Credentials s3 where user_id = :user_id"
   ),
   @NamedQuery(
           name =  S3Credentials.FIND_BY_S3CREDENTIALSID,
           query = "select s3 from S3Credentials s3 where id = :id"
   )
 
})

public class S3Credentials {

	 		
		public static final String FIND_BY_USERID = "S3Credentials.findByUserId";
		public static final String FIND_BY_S3CREDENTIALSID = "S3Credentials.findById";
		
		@Id
	    @GeneratedValue
	    private Long id;
	    
	    @ManyToOne
	    private User user;

 
		private String s3credentialsName;
		private String secretKey;
		private String accessKey;

		public S3Credentials(){
		}
		
		public S3Credentials(User user ,String s3credentialsName, String secretKey,String accessKey) {
			super();
			this.user = user;
			this.s3credentialsName = s3credentialsName;
			this.secretKey = secretKey;
			this.accessKey = accessKey;
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
		
		 
		public String gets3credentialsName() {
			return s3credentialsName;
		}

		public void sets3credentialsName(String s3credentialsName) {
			this.s3credentialsName = s3credentialsName;
		}
 
		public String getsecretKey() {
			return secretKey;
		}

		public void setsecretKey(String secretKey) {
			this.secretKey = secretKey;
		}
 
		public String getaccessKey() {
			return accessKey;
		}

		public void setaccessKey(String accessKey) {
			this.accessKey = accessKey;
		}
}
