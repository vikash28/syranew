package syra.etl.app.model;


import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 *
 * The MappingsView JPA entity
 *
 */

import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.Subselect;
import org.hibernate.annotations.Synchronize;


@Entity
@Immutable
@Subselect("SELECT * FROM MappingsView")
@Synchronize("MappingsView")
public class MappingsView extends AbstractEntity {

    @ManyToOne
    private User user;

	private Long folderId;
	private String mappingName;
	private String folderName;	
	private Integer sourceConnId;
	private String sourceConnectionName;
	private String sourceConnectionType;
	private Integer targetConnId;
	private String targetConnectionName;
	private String targetConnectionType;	
	private String mappings;
	private String s3FieldDelim;

	public MappingsView(){
	}
	
	public MappingsView(User user, Long folderId, String mappingName, String folderName,
							Integer sourceConnId, String sourceConnectionName, String sourceConnectionType,
							Integer targetConnId,  String targetConnectionName, String targetConnectionType,
							String mappings, String s3FieldDelim) {
		super();
		this.user = user;
		this.folderId = folderId;
		this.mappingName = mappingName;
		this.folderName = folderName;
		this.sourceConnId = sourceConnId;
		this.sourceConnectionName = sourceConnectionName;
		this.sourceConnectionType = sourceConnectionType;
		this.targetConnId = targetConnId;
		this.targetConnectionName = targetConnectionName;
		this.targetConnectionType = targetConnectionType;
		this.mappings = mappings;
		this.s3FieldDelim = s3FieldDelim;
	}
	
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }	

	public void setMappingName(String mappingName) {
		this.mappingName = mappingName;
	}

	public String getMappingName() {
		return mappingName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}

	public String getFolderName() {
		return folderName;
	}

	public void setSourceConnId(Integer sourceConnId) {
		this.sourceConnId = sourceConnId;
	}

	public Integer getSourceConnId() {
		return sourceConnId;
	}

	public void setSourceConnectionName(String sourceConnectionName) {
		this.sourceConnectionName = sourceConnectionName;
	}

	public String getSourceConnectionName() {
		return sourceConnectionName;
	}

	public void setSourceConnectionType(String sourceConnectionType) {
		this.sourceConnectionType = sourceConnectionType;
	}

	public String getSourceConnectionType() {
		return sourceConnectionType;
	}

	public void setTargetConnId(Integer targetConnId) {
		this.targetConnId = targetConnId;
	}

	public Integer getTargetConnId() {
		return targetConnId;
	}

	public void setTargetConnectionName(String targetConnectionName) {
		this.targetConnectionName = targetConnectionName;
	}

	public String getTargetConnectionName() {
		return targetConnectionName;
	}

	public void setTargetConnectionType(String targetConnectionType) {
		this.targetConnectionType = targetConnectionType;
	}

	public String getTargetConnectionType() {
		return targetConnectionType;
	}

	public void setMappings(String mappings) {
		this.mappings = mappings;
	}

	public String getMappings() {
		return mappings;
	}

	public void setS3FieldDelim(String s3FieldDelim) {
		this.s3FieldDelim = s3FieldDelim;
	}

	public String getS3FieldDelim() {
		return s3FieldDelim;
	}

}
