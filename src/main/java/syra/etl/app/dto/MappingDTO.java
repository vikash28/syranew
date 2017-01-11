package syra.etl.app.dto;


import java.util.List;
import java.util.stream.Collectors;

import syra.etl.app.model.Mapping;

/**
 *
 * JSON serializable DTO containing Mapping data
 *
 */
public class MappingDTO {

    private Long id;
    private Long folderId;

	private String mappingName;
	private Integer sourceConnId;
	private Integer targetConnId;
	private String mappings;
	private String s3FieldDelim;
	
    public MappingDTO() {
    }
	
	public MappingDTO(Long id) {
		this.id = id;
	}

	public MappingDTO(Long id, Long folderId, String mappingName, Integer sourceConnId, 
						Integer targetConnId, String mappings, String s3FieldDelim) {
		this.id = id;
		this.folderId = folderId;
		this.mappingName = mappingName;
		this.sourceConnId = sourceConnId;
		this.targetConnId = targetConnId;
		this.mappings = mappings;
		this.s3FieldDelim = s3FieldDelim;
	}	

    public static MappingDTO mapFromMappingEntity(Mapping mapping) {
        return new MappingDTO(mapping.getId(), mapping.getFolderId(), mapping.getMappingName(), mapping.getSourceConnId(),
									mapping.getTargetConnId(), mapping.getMappings(), mapping.getS3FieldDelim());
    }

    public static List<MappingDTO> mapFromMappingsEntities(List<Mapping> mappings) {
        return mappings.stream().map((mapping) -> mapFromMappingEntity(mapping)).collect(Collectors.toList());
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
