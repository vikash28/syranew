package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a mappingsview search request.
 *
 */
public class MappingsViewsDTO {

    List<MappingsViewDTO> mappingsviews;

    public MappingsViewsDTO(List<MappingsViewDTO> mappingsviews) {
        this.mappingsviews = mappingsviews;
    }

    public List<MappingsViewDTO> getMappingsViews() {
        return mappingsviews;
    }

    public void setMappingsViews(List<MappingsViewDTO> mappingsviews) {
        this.mappingsviews = mappingsviews;
    }
}
