package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a folder search request.
 *
 */
public class FoldersDTO {

    List<FolderDTO> folders;

    public FoldersDTO(List<FolderDTO> folders) {
        this.folders = folders;
    }

    public List<FolderDTO> getFolders() {
        return folders;
    }

    public void setFolders(List<FolderDTO> folders) {
        this.folders = folders;
    }
}
