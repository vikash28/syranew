package syra.etl.app.dto;


import java.util.List;
import java.util.stream.Collectors;

//import javax.persistence.JoinColumn;
//import javax.persistence.ManyToOne;

//import syra.etl.app.model.User;

import syra.etl.app.model.Folder;
import syra.etl.app.model.User;

/**
 *
 * JSON serializable DTO containing Folder data
 *
 */
public class FolderDTO {

    private Long id;
	private Long parentId;
	private String folderName;
	private String parentName;

 	
    public FolderDTO() {
    }
	
	public FolderDTO(Long id) {
		this.id = id;
	}

	//public FolderDTO(Long id, Long parentId, String folderName) {
	public FolderDTO(Long id,  String folderName , User user) {
		this.id = id;
		this.folderName = folderName;
		this.parentId = user.getId();
		this.parentName =  user.getUsername();
		//this.user_id = user_id;

	}	

    public static FolderDTO mapFromFolderEntity(Folder folder) {
       // return new FolderDTO(folder.getId(), folder.getParentId(), folder.getFolderName());
        return new FolderDTO(folder.getId(), folder.getFolderName(), folder.getUser());
    }

    public static List<FolderDTO> mapFromFoldersEntities(List<Folder> folders) {
        return folders.stream().map((folder) -> mapFromFolderEntity(folder)).collect(Collectors.toList());
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
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}
	
	public String getParentName() {
		return parentName;
	}

	public void setParentName(String parentName) {
		this.parentName = parentName;
	}
	
	// Needed to populate jsTree!!

//	public Long getParent() {
//		return parentId;
//	}
//
//	public String getText() {
//		return folderName;
//	}

	// Needed to populate jsTree!!
}
