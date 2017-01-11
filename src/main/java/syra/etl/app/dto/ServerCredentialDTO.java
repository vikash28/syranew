package syra.etl.app.dto;

import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.ServerCredentials;
import syra.etl.app.model.User;

public class ServerCredentialDTO {
	
	private Long id;
	private String serverName;
	private Long  port;
	private String username;
	private String password;
	private String ipaddress;
	private Long parentId;
	
	public ServerCredentialDTO() {  
	}
	
	public ServerCredentialDTO( Long id,String ServerName,Long port,String username,String password,String ipaddress,User user) {
 		this.id = id;
		this.serverName  = ServerName;
		this.port  = port;
		this.username = username;
		this.password = password;
		this.ipaddress = ipaddress;
		this.parentId = user.getId();
	}
    
 	public static ServerCredentialDTO mapFromServercredentialEntity(ServerCredentials servercredential) {
         return new ServerCredentialDTO(servercredential.getId(), servercredential.getServerName(), servercredential.getport(), servercredential.getusername(),servercredential.getpassword(),servercredential.getipaddress(),servercredential.getUser());
    }
    
    public static List<ServerCredentialDTO> mapFromServercredentialEntities(List<ServerCredentials> servercredentials) {
        return servercredentials.stream().map((servercredential) -> mapFromServercredentialEntity(servercredential)).collect(Collectors.toList());
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
		
	public String getServerName() {
		return serverName;
	}

	public void setServerName(String ServerName) {
		this.serverName = ServerName;
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
