package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a mapping search request.
 *
 */
public class MappingsDTO {

    List<MappingDTO> mappings;

    public MappingsDTO(List<MappingDTO> mappings) {
        this.mappings = mappings;
    }

    public List<MappingDTO> getMappings() {
        return mappings;
    }

    public void setMappings(List<MappingDTO> mappings) {
        this.mappings = mappings;
    }
}
