package syra.etl.app.model;


//import javax.persistence.CascadeType;
import javax.persistence.Entity;
//import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * The Connection JPA entity
 *
 */
@Entity
@Table(name = "CONNECTIONS")
public class Connection  {

    @ManyToOne
    private User user;
    
    @ManyToOne
    private Folder folder;
    
    @Id
    @GeneratedValue
    private Long connection_id;
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
	

	public Connection(){
	}
	
	public Connection(User user, Folder folder ,String connectionName, String connectionType, String hiveThriftServer,
			String hdfsConnectionString, String hdfsPath, String hdfsAccessUser, String hdfsFieldDelim, 
			String redshiftDbUrl, String redshiftUser, String redshiftPassword, String s3AccessKey, String s3SecreteKey, 
			String hdfsTempDir, String s3FileUrl) {
		super();
		this.user = user;
		this.folder = folder;
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
	}
	
	@ManyToOne
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	
	@ManyToOne
	public Folder getFolder() {
		return folder;
	}

	public void setFolder(Folder folder) {
		this.folder = folder;
	}

	
	public Long getId() {
        return connection_id;
    }
 
    public void setId(Long connection_id) {
        this.connection_id = connection_id;
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
