package syra.etl.app.services;


import static org.springframework.util.Assert.notNull;
import static syra.etl.app.services.ValidationUtils.assertNotBlank;

import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.ConnectionRepository;
import syra.etl.app.dao.MappingRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dao.FolderRepository;
import syra.etl.app.dto.ConnectionDTO;
import syra.etl.app.model.Connection;
import syra.etl.app.model.Folder;
import syra.etl.app.model.Mapping;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.User;

/**
 *
 * Business service for Connection-related operations.
 *
 */
@Service
public class ConnectionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConnectionService.class);

    @Autowired
    ConnectionRepository connectionRepository;

    @Autowired
    MappingRepository mappingRepository;

    @Autowired
    UserRepository userRepository;
    
    @Autowired
    FolderRepository folderRepository;

    /**
     *
     * searches connections by date/time
     *
     * @param username - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<Connection> findConnections(String username) {

        Long resultsCount = connectionRepository.countConnections(username);

        List<Connection> connections = connectionRepository.findConnections(username);

        return new SearchResult<>(resultsCount, connections);
    }
    
    /**
    *
    * searches connections by Admin suer
    *
    * @param username - the currently logged in user
    * @return - the found results
    */
   @Transactional(readOnly = true)
   public SearchResult<Connection> findConnectionsAdmin(String username,long account_id) {

       Long resultsCount = connectionRepository.countConnectionsAdmin(username,account_id);

       List<Connection> connections = connectionRepository.findConnectionsAdmin(username ,account_id);

       return new SearchResult<>(resultsCount, connections);
   }
   
   
   /**
   *
   * searches connections by Folder Id suer
   *
   * @param username - the currently logged in user
   * @return - the found results
   */
  @Transactional(readOnly = true)
  public SearchResult<Connection> findConnectionsByFolder(String username,long folderId) {

      Long resultsCount = connectionRepository.countConnectionsByfolder(username,folderId);

      List<Connection> connections = connectionRepository.findConnectionsByfolder(username ,folderId);

      return new SearchResult<>(resultsCount, connections);
  }
  
    /**
     *
     * deletes a list of connections, given their Ids
     *
     * @param deletedConnectionIds - the list of connections to delete
     */
    @Transactional
    public void deleteConnections(List<Long> deletedConnectionIds) {
        notNull(deletedConnectionIds, "deletedConnectionsId is mandatory");
        deletedConnectionIds.stream().forEach((deletedConnectionId) -> connectionRepository.delete(deletedConnectionId));
    }

    /**
     *
     * saves a connection (new or not) into the database.
     *
     * @param username - - the currently logged in user
     * @param id - the database ud of the connection
     * @return - the new version of the connection
     */

    @Transactional
    public Connection saveConnection(String username, Long id, String connectionName, String connectionType, String hiveThriftServer,
			String hdfsConnectionString, String hdfsPath, String hdfsAccessUser, String hdfsFieldDelim, String redshiftDbUrl,
			String redshiftUser, String redshiftPassword, String s3AccessKey, String s3SecreteKey, String hdfsTempDir, String s3FileUrl,long folderId) {

        assertNotBlank(username, "username cannot be blank");
        notNull(connectionName, "connectionName is mandatory");

        Connection connection = null;
        LOGGER.info(username);
        if (id != null) {
            connection = connectionRepository.findConnectionById(id);

            connection.setConnectionName(connectionName);
			connection.setConnectionType(connectionType);
			connection.setHiveThriftServer(hiveThriftServer);
			connection.setHdfsConnectionString(hdfsConnectionString);
			connection.setHdfsPath(hdfsPath);
			connection.setHdfsAccessUser(hdfsAccessUser);
			connection.setHdfsFieldDelim(hdfsFieldDelim);
			connection.setRedshiftDbUrl(redshiftDbUrl);
			connection.setRedshiftUser(redshiftUser);
			connection.setRedshiftPassword(redshiftPassword);
			connection.setS3AccessKey(s3AccessKey); 
			connection.setS3SecreteKey(s3SecreteKey); 
			connection.setHdfsTempDir(hdfsTempDir);
			connection.setS3FileUrl(s3FileUrl);
			
			// Update Mappings (mappings) info !!
			List<Mapping> mappings = mappingRepository.findMappings(username);
			
			// Loop through all Mappings created by user
			for(Mapping mapping : mappings){
			
				// Check if the current mapping is the one being updated by the user!!
				if(mapping.getSourceConnId() == id.intValue() || mapping.getTargetConnId() == id.intValue()){
				
					String sMappings = mapping.getMappings().replaceAll("\\\\n","");
					// Retrieve and Loop through all individual mappings JSON Objects !!
					JSONArray jsonArray = new JSONArray(sMappings);
					
					for(int mappingIndex=0; mappingIndex<jsonArray.length(); mappingIndex++){
						
						JSONObject jsonData = jsonArray.getJSONObject(mappingIndex);
						
						if(connectionType.equalsIgnoreCase("HIVE")){
							updateMappingData(jsonData, "hiveThriftServer", hiveThriftServer);
							
							// HIVE to HIVE possible!
							// Check source or target and update accordingly..
							
							if(mapping.getSourceConnId() == id.intValue()){
								updateMappingData(jsonData, "srcConnectionStr", hiveThriftServer);
							}
							
							if (mapping.getTargetConnId() == id.intValue()){
								updateMappingData(jsonData, "destConnectionStr", hiveThriftServer);
							}
							
						} else if(connectionType.equalsIgnoreCase("HDFS")){
							updateMappingData(jsonData, "hdfsFileName", hdfsConnectionString);
							updateMappingData(jsonData, "hdfs", hdfsPath);
							updateMappingData(jsonData, "hdfsAccessUser", hdfsAccessUser);
							updateMappingData(jsonData, "seperator", hdfsFieldDelim);
						} else if(connectionType.equalsIgnoreCase("REDSHIFT")){
							updateMappingData(jsonData, "redshiftDBURL", redshiftDbUrl);
							updateMappingData(jsonData, "redshiftUser", redshiftUser);
							updateMappingData(jsonData, "redshiftPassword", redshiftPassword);
							updateMappingData(jsonData, "s3AccessKey", s3AccessKey);
							updateMappingData(jsonData, "s3SecreteKey", s3SecreteKey);
							updateMappingData(jsonData, "tmpDir", hdfsTempDir);
						}

						// Local file location never update?
						// updateMappingData(jsonData, "localS3FilePath", s3FileUrl);
					}

					// Update Mappings Array back to the Mapping
					mapping.setMappings(jsonArray.toString());
				}
			}
			
        } else {
            User user = userRepository.findUserByUsername(username);
            LOGGER.info("Folder Id"+folderId);
			//Folder folder = folderRepository.findUserByUserID(user.getId());
            Folder folder = folderRepository.findUserByFolderID(folderId);
			 //LOGGER.info("2"+folder.getId().toString());
            if (user != null && folder != null) {
                connection = connectionRepository.save(new Connection(user, folder, connectionName, connectionType, hiveThriftServer,
															hdfsConnectionString, hdfsPath, hdfsAccessUser, hdfsFieldDelim, redshiftDbUrl,
															redshiftUser, redshiftPassword, s3AccessKey, s3SecreteKey, hdfsTempDir, s3FileUrl));
            } else {
                LOGGER.warn("A connection was attempted to be saved for a non-existing user: " + username);
			}
        }

        return connection;
    }
	
	private void updateMappingData(JSONObject jsonData, String key, String value){
		// Check if the Key exists, and update it !!
		if(jsonData.has(key) && value!=null){
			jsonData.put(key, value);
		}
	}

    /**
     *
     * saves a list of connections (new or not) into the database
     *
     * @param username - the currently logged in user
     * @param connections - the list of connections to be saved
     * @return - the new versions of the saved connections
     */
    @Transactional
    public List<Connection> saveConnections(String username, List<ConnectionDTO> connections) {
        return connections.stream()
                .map((connection) -> saveConnection(
                        username,
                        connection.getId(),
                        connection.getConnectionName(),
                        connection.getConnectionType(),
						connection.getHiveThriftServer(),
						connection.getHdfsConnectionString(),
						connection.getHdfsPath(),
						connection.getHdfsAccessUser(),
						connection.getHdfsFieldDelim(),
						connection.getRedshiftDbUrl(),
						connection.getRedshiftUser(),
						connection.getRedshiftPassword(),
						connection.getS3AccessKey(), 
						connection.getS3SecreteKey(), 
						connection.getHdfsTempDir(),
						connection.getS3FileUrl(),
						connection.getFolderId()
						))
                .collect(Collectors.toList());
    }
}
