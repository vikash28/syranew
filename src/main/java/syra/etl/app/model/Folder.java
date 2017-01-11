package syra.etl.app.model;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 *
 * The Folder JPA entity
 *
 */
@Entity
@Table(name = "FOLDERS")

@NamedQueries({
    @NamedQuery(
            name = Folder.FIND_BY_USERID,
            query = "select f from Folder f where user_id = :user_id"
    ),
    @NamedQuery(
            name = Folder.FIND_BY_FOLDERID,
            query = "select f from Folder f where id = :id"
    )
})


public class Folder  {

	public static final String FIND_BY_USERID = "folder.findByUserId";
	public static final String FIND_BY_FOLDERID = "folder.findByFolderId";
	
	@Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;

	//private Long parentId;
	private String folderName;
	//private Long user_id;

	public Folder(){
	}
	
//	public Folder(User user, Long parentId, String folderName) {
//		super();
//		this.user = user;
//		this.parentId = parentId;
//		this.folderName = folderName;
//	}
	
	public Folder(User user, String folderName) {
		super();
		this.user = user;
		this.folderName = folderName;
	}
	
	 
	
	@ManyToOne
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	 
	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getId() {
        return id;
    }
	
	/*public Long getUserId() {
			return user_id;
	}

	public void setUserId(Long user_id) {
			this.user_id = user_id;
	}*/
	
//	public Long getParentId() {
//		return parentId;
//	}
//
//	public void setParentId(Long parentId) {
//		this.parentId = parentId;
//	}
	
	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}
}
