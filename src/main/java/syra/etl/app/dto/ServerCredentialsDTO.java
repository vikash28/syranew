package syra.etl.app.dto;

import java.util.List;

/**
*
* JSON serializable DTO containing data concerning a ServerCredentials search request.
*
*/

public class ServerCredentialsDTO {

	List<ServerCredentialDTO> servercredential;
	
	public ServerCredentialsDTO(List<ServerCredentialDTO> servercredential) {
		this.servercredential=servercredential;
	}
	
	public List<ServerCredentialDTO> getServerCredential() {
	       return servercredential;
	 }

	public void setServerCredential(List<ServerCredentialDTO> servercredential) {
	        this.servercredential = servercredential;
	  }
  

 
}