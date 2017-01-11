package syra.etl.app.services;


import static org.springframework.util.Assert.notNull;
import static syra.etl.app.services.ValidationUtils.assertNotBlank;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.FolderRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dto.FolderDTO;
import syra.etl.app.model.Folder;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.User;

/**
 *
 * Business service for Folder-related operations.
 *
 */
@Service
public class FolderService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FolderService.class);

    @Autowired
    FolderRepository folderRepository;

    @Autowired
    UserRepository userRepository;

    /**
     *
     * searches folders by date/time
     *
     * @param username - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<Folder> findFolders(String username) {

        Long resultsCount = folderRepository.countFolders(username);

        List<Folder> folders = folderRepository.findFolders(username);

        return new SearchResult<>(resultsCount, folders);
    }
    

    /**
     *
     * searches folders 
     *
     * @param username - the currently logged in user
     * @param account-id - the currently account
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<Folder> findFoldersAdmin(String username,long account_id) {

        Long resultsCount = folderRepository.countFolders(account_id);

        List<Folder> folders = folderRepository.findFolders(account_id);

        return new SearchResult<>(resultsCount, folders);
    }

    /**
     *
     * deletes a list of folders, given their Ids
     *
     * @param deletedFolderIds - the list of folders to delete
     */
    @Transactional
    public void deleteFolders(List<Long> deletedFolderIds) {
        notNull(deletedFolderIds, "deletedFoldersId is mandatory");
        //deletedFolderIds.stream().forEach(  );
        deletedFolderIds.stream().forEach((deletedFolderId) -> folderRepository.delete(deletedFolderId));
    }

    /**
     *
     * saves a folder (new or not) into the database.
     *
     * @param username - - the currently logged in user
     * @param id - the database ud of the folder
     * @return - the new version of the folder
     */

    @Transactional
    //public Folder saveFolder(String username, Long id, Long parentId, String folderName) {
    public Folder saveFolder(String username, Long id,  String folderName ,Long user_id) {	
    	LOGGER.info("Found " + user_id + " results.");
    	assertNotBlank(username, "username cannot be blank");
        //notNull(parentId, "parentId is mandatory");
        notNull(folderName, "folderName is mandatory");
        notNull(user_id, "User Id is mandatory");
       
    	
        Folder folder = null;

        if (id != null) {
            folder = folderRepository.findFolderById(id);

            folder.setFolderName(folderName);
            //folder.setUserId(user_id);

        } 
        
        else if( user_id != null){
        	LOGGER.info("Found " + user_id + " results.");
        	
        	User user = userRepository.findUserByUserID(user_id);
        	if (user != null) {
            	 folder = folderRepository.save(new Folder(user,  folderName));
            } else {
                LOGGER.warn("A folder was attempted to be saved for a non-existing user: " + user_id);
			}
        	
        }
        else {
            User user = userRepository.findUserByUsername(username);
            
            if (user != null) {
            	// folder = folderRepository.save(new Folder(user, parentId, folderName));
            	 folder = folderRepository.save(new Folder(user,  folderName));
            } else {
                LOGGER.warn("A folder was attempted to be saved for a non-existing user: " + username);
			}
        }

        return folder;
    }

    /**
     *
     * saves a list of folders (new or not) into the database
     *
     * @param username - the currently logged in user
     * @param folders - the list of folders to be saved
     * @return - the new versions of the saved folders
     */
    @Transactional
    public List<Folder> saveFolders(String username, List<FolderDTO> folders) {
    	LOGGER.info("Found " + folders + " results.");
    	
    	return folders.stream()
                .map((folder) -> saveFolder(
                        username,
                        folder.getId(),
                        folder.getFolderName(),
                        folder.getParentId()
                        //folder.getParentId()
                        //folder.getFolderName()
                        ))
                .collect(Collectors.toList());
    }
}
