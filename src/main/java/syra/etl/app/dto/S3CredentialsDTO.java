package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a S3Credentials search request.
 *
 */

public class S3CredentialsDTO {

	List<S3CredentialDTO> s3credential;
	
	public S3CredentialsDTO(List<S3CredentialDTO> s3credential) {
		 this.s3credential = s3credential;
	}
	
	public List<S3CredentialDTO> getS3Credential() {
	       return s3credential;
	 }

	public void setS3Credential(List<S3CredentialDTO> s3credential) {
	        this.s3credential = s3credential;
	  }
}