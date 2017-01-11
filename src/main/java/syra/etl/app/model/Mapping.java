package syra.etl.app.model;


import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * The Mapping JPA entity
 *
 */
@Entity
@Table(name = "MAPPINGS")
public class Mapping extends AbstractEntity {

    @ManyToOne
    private User user;
	
	private Long folderId;
	private String mappingName;
	private Integer sourceConnId;
	private Integer targetConnId;
	private String mappings;
	private String s3FieldDelim;

	public Mapping(){
	}
	
	public Mapping(User user, Long folderId, String mappingName, Integer sourceConnId, Integer targetConnId, 
						String mappings, String s3FieldDelim) {
		super();
		this.user = user;
		this.folderId = folderId;		
		this.mappingName = mappingName;
		this.sourceConnId = sourceConnId;
		this.targetConnId = targetConnId;
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

	public void setSourceConnId(Integer sourceConnId) {
		this.sourceConnId = sourceConnId;
	}

	public Integer getSourceConnId() {
		return sourceConnId;
	}

	public void setTargetConnId(Integer targetConnId) {
		this.targetConnId = targetConnId;
	}

	public Integer getTargetConnId() {
		return targetConnId;
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
