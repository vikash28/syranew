package syra.etl.app.dto;

import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.User;

/**
*
* DTO used only for posting new S3 Credentials for creation
*
*/

public class S3CredentialDTO {

    private Long id;
	private String secretKey;
	private String accessKey;
	private String s3credentialsName;
	private Long parentId;

 
    public S3CredentialDTO() {
    }
    
	public S3CredentialDTO(Long id, String s3credentialsName, String secretKey ,String accessKey, User user) {
		this.id = id;
		this.s3credentialsName=s3credentialsName;
		this.secretKey = secretKey;
		this.accessKey = accessKey;
		this.parentId = user.getId();
	}	

    public static S3CredentialDTO mapFromS3credentialEntity(S3Credentials s3credential) {
         return new S3CredentialDTO(s3credential.getId(), s3credential.gets3credentialsName(), s3credential.getsecretKey(),s3credential.getaccessKey(), s3credential.getUser());
    }
    
    public static List<S3CredentialDTO> mapFromS3credentialEntities(List<S3Credentials> s3credentials) {
        return s3credentials.stream().map((s3credential) -> mapFromS3credentialEntity(s3credential)).collect(Collectors.toList());
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
		return this.accessKey;  
	}

	public void setaccessKey(String accessKey) {
		this.accessKey = accessKey;
	}
}
