package syra.etl.app.dto;

import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;

public class JobDTO {
	
    private Long id;
    private Long serverId;
    private Long s3Id;
    private Long parentId;
    
	private String jobbucketName;
	private String jobfolderName;
	private String jobfilesJson;
 
	
	public JobDTO() {  
	}
	
	public JobDTO(Long id) {
		this.id = id;
	}
	public JobDTO(Long id,String JobbucketName ,String JobfolderName ,String JobfilesJson ,User user,ServerCredentials server ,S3Credentials s3) {
		this.id = id;
		this.jobbucketName = JobbucketName;
		this.jobfolderName = JobfolderName;
		this.jobfilesJson = JobfilesJson;
		this.parentId = user.getId();
		this.serverId = server.getId();
		this.s3Id = s3.getId();
		
	}	
	
	public Long getId() {
	        return id;
	    }
	
    public void setId(Long id) {
        this.id = id;
    }

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}
	
	public Long getServerId() {
		return serverId;
	}

	public void setServerId(Long serverId) {
		this.serverId = serverId;
	}
	
	public Long getS3Id() {
		return s3Id;
	}

	public void setS3Id(Long s3Id) {
		this.s3Id = s3Id;
	}
	
	public String getJobbucketName() {
		return jobbucketName;
	}

	public void setJobbucketName(String JobbucketName) {
		this.jobbucketName = JobbucketName;
	}

	public String getJobfolderName() {
		return jobfolderName;
	}

	public void setJobfolderName(String JobfolderName) {
		this.jobfolderName = JobfolderName;
	}

	public String getJobfilesJson() {
		return jobfilesJson;
	}

	public void setJobfilesJson(String JobfilesJson) {
		this.jobfilesJson = JobfilesJson;
	}
	
	@Override
    public String toString() {
        return "Account{" +
                "account_id" + jobfolderName + '\'' +
                ", account_name='" + jobfilesJson + '\'' +
                '}';
    }
}
