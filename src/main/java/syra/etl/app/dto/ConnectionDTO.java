package syra.etl.app.dto;


import java.util.List;
import java.util.stream.Collectors;

//import org.hsqldb.rights.User;

import syra.etl.app.model.Connection;
//import syra.etl.app.model.User;
//import syra.etl.app.model.Folder;
import syra.etl.app.model.Folder;

/**
 *
 * JSON serializable DTO containing Connection data
 *
 */
public class ConnectionDTO {

    private Long id;

	private String connectionName;
	private String connectionType;
	private String hiveThriftServer;
	private String hdfsConnectionString;
	private String hdfsPath;
	private String hdfsAccessUser;
	private String hdfsFieldDelim;
	private String redshiftDbUrl;
	private String redshiftUser;
	private String redshiftPassword;
	private String s3AccessKey;
	private String s3SecreteKey;
	private String hdfsTempDir;
	private String s3FileUrl;
	private String user;
	private String folder;
	private long folderId;
	
    public ConnectionDTO() {
    }
	
	public ConnectionDTO(Long id) {
		this.id = id;
	}

/*	public ConnectionDTO(Long id, User user,Folder folder, String connectionName, String connectionType, String hiveThriftServer,
			String hdfsConnectionString, String hdfsPath, String hdfsAccessUser, String hdfsFieldDelim, String redshiftDbUrl,
			String redshiftUser, String redshiftPassword, String s3AccessKey, String s3SecreteKey, String hdfsTempDir, String s3FileUrl) {
		this.id = id;
		this.user = (user.getUsername()+ "," +user.getId()) .toString();
		this.folder = (folder.getFolderName()+ "," +folder.getId()) .toString();
		this.connectionName = connectionName;
		this.connectionType = connectionType;
		this.hiveThriftServer = hiveThriftServer;
		this.hdfsConnectionString = hdfsConnectionString;
		this.hdfsPath = hdfsPath;
		this.hdfsAccessUser = hdfsAccessUser;
		this.hdfsFieldDelim = hdfsFieldDelim;
		this.redshiftDbUrl = redshiftDbUrl;
		this.redshiftUser = redshiftUser;
		this.redshiftPassword = redshiftPassword;
		this.s3AccessKey = s3AccessKey;
		this.s3SecreteKey = s3SecreteKey;
		this.hdfsTempDir = hdfsTempDir;
		this.s3FileUrl = s3FileUrl;
	}	*/
	

   /* public static ConnectionDTO mapFromConnectionEntity(Connection connection) {
        return new ConnectionDTO(connection.getId(),connection.getUser(),connection.getFolder(),connection.getConnectionName(), connection.getConnectionType(),
									connection.getHiveThriftServer(), connection.getHdfsConnectionString(), connection.getHdfsPath(),
									connection.getHdfsAccessUser(), connection.getHdfsFieldDelim(), 
									connection.getRedshiftDbUrl(), connection.getRedshiftUser(), connection.getRedshiftPassword(), 
									connection.getS3AccessKey(), connection.getS3SecreteKey(),
									connection.getHdfsTempDir(), connection.getS3FileUrl());
    }
*/
	public ConnectionDTO(Long id, String connectionName, String connectionType, String hiveThriftServer,
			String hdfsConnectionString, String hdfsPath, String hdfsAccessUser, String hdfsFieldDelim, String redshiftDbUrl,
			String redshiftUser, String redshiftPassword, String s3AccessKey, String s3SecreteKey, String hdfsTempDir, String s3FileUrl,Folder folder) {
		this.id = id;
		this.connectionName = connectionName;
		this.connectionType = connectionType;
		this.hiveThriftServer = hiveThriftServer;
		this.hdfsConnectionString = hdfsConnectionString;
		this.hdfsPath = hdfsPath;
		this.hdfsAccessUser = hdfsAccessUser;
		this.hdfsFieldDelim = hdfsFieldDelim;
		this.redshiftDbUrl = redshiftDbUrl;
		this.redshiftUser = redshiftUser;
		this.redshiftPassword = redshiftPassword;
		this.s3AccessKey = s3AccessKey;
		this.s3SecreteKey = s3SecreteKey;
		this.hdfsTempDir = hdfsTempDir;
		this.s3FileUrl = s3FileUrl;
		this.folderId = folder.getId();
	}	
	
	public static ConnectionDTO mapFromConnectionEntity(Connection connection) {
        return new ConnectionDTO(connection.getId(),connection.getConnectionName(), connection.getConnectionType(),
									connection.getHiveThriftServer(), connection.getHdfsConnectionString(), connection.getHdfsPath(),
									connection.getHdfsAccessUser(), connection.getHdfsFieldDelim(), 
									connection.getRedshiftDbUrl(), connection.getRedshiftUser(), connection.getRedshiftPassword(), 
									connection.getS3AccessKey(), connection.getS3SecreteKey(),
									connection.getHdfsTempDir(), connection.getS3FileUrl(),connection.getFolder());
    }
	
	public static List<ConnectionDTO> mapFromConnectionsEntities(List<Connection> connections) {
       return connections.stream().map( (connection) -> mapFromConnectionEntity(connection)).collect(Collectors.toList() );
        //return connections.stream().map( (connection) -> connection.getUser().getId() ).collect(Collectors.toList() );

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}
	
	
	public String getFolder() {
		return folder;
	}

	public void setFolder(String folder) {
		this.folder = folder;
	}
	
	public long getFolderId() {
		return folderId;
	}

	public void setFolderId(long folderId) {
		this.folderId = folderId;
	}
	
	public String getConnectionName() {
		return connectionName;
	}

	public void setConnectionName(String connectionName) {
		this.connectionName = connectionName;
	}

	public String getConnectionType() {
		return connectionType;
	}

	public void setConnectionType(String connectionType) {
		this.connectionType = connectionType;
	}

	public String getHiveThriftServer() {
		return hiveThriftServer;
	}

	public void setHiveThriftServer(String hiveThriftServer) {
		this.hiveThriftServer = hiveThriftServer;
	}

	public String getHdfsConnectionString() {
		return hdfsConnectionString;
	}

	public void setHdfsConnectionString(String hdfsConnectionString) {
		this.hdfsConnectionString = hdfsConnectionString;
	}

	public String getHdfsPath() {
		return hdfsPath;
	}

	public void setHdfsPath(String hdfsPath) {
		this.hdfsPath = hdfsPath;
	}

	public String getHdfsAccessUser() {
		return hdfsAccessUser;
	}

	public void setHdfsAccessUser(String hdfsAccessUser) {
		this.hdfsAccessUser = hdfsAccessUser;
	}

	public String getHdfsFieldDelim() {
		return hdfsFieldDelim;
	}

	public void setHdfsFieldDelim(String hdfsFieldDelim) {
		this.hdfsFieldDelim = hdfsFieldDelim;
	}

	public String getRedshiftDbUrl() {
		return redshiftDbUrl;
	}

	public void setRedshiftDbUrl(String redshiftDbUrl) {
		this.redshiftDbUrl = redshiftDbUrl;
	}

	public String getRedshiftUser() {
		return redshiftUser;
	}

	public void setRedshiftUser(String redshiftUser) {
		this.redshiftUser = redshiftUser;
	}

	public String getRedshiftPassword() {
		return redshiftPassword;
	}

	public void setRedshiftPassword(String redshiftPassword) {
		this.redshiftPassword = redshiftPassword;
	}

	public String getS3AccessKey() {
		return s3AccessKey;
	}

	public void setS3AccessKey(String s3AccessKey) {
		this.s3AccessKey = s3AccessKey;
	}

	public String getS3SecreteKey() {
		return s3SecreteKey;
	}

	public void setS3SecreteKey(String s3SecreteKey) {
		this.s3SecreteKey = s3SecreteKey;
	}

	public String getHdfsTempDir() {
		return hdfsTempDir;
	}

	public void setHdfsTempDir(String hdfsTempDir) {
		this.hdfsTempDir = hdfsTempDir;
	}

	public String getS3FileUrl() {
		return s3FileUrl;
	}

	public void setS3FileUrl(String s3FileUrl) {
		this.s3FileUrl = s3FileUrl;
	}
	

}
