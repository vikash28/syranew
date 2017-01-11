package syra.etl.app.dto;


import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.MappingsView;

/**
 *
 * JSON serializable DTO containing MappingsView data
 *
 */
public class MappingsViewDTO {

    private Long id;
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
	
    public MappingsViewDTO() {
    }
	
	public MappingsViewDTO(Long id) {
		this.id = id;
	}

	public MappingsViewDTO(Long id, Long folderId, String mappingName, String folderName,
							Integer sourceConnId, String sourceConnectionName, String sourceConnectionType,
							Integer targetConnId,  String targetConnectionName, String targetConnectionType,
							String mappings, String s3FieldDelim) {
		this.id = id;
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

    public static MappingsViewDTO mapFromMappingsViewEntity(MappingsView mappingsview) {
        return new MappingsViewDTO(mappingsview.getId(), mappingsview.getFolderId(), mappingsview.getMappingName(), 
							mappingsview.getFolderName(), mappingsview.getSourceConnId(), mappingsview.getSourceConnectionName(), 
							mappingsview.getSourceConnectionType(), mappingsview.getTargetConnId(), mappingsview.getTargetConnectionName(), 
							mappingsview.getTargetConnectionType(), mappingsview.getMappings(), mappingsview.getS3FieldDelim());
    }

    public static List<MappingsViewDTO> mapFromMappingsViewsEntities(List<MappingsView> mappingsviews) {
        return mappingsviews.stream().map((mappingsview) -> mapFromMappingsViewEntity(mappingsview)).collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
