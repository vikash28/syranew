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

import syra.etl.app.dao.MappingRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.dto.MappingDTO;
import syra.etl.app.model.Mapping;
import syra.etl.app.model.SearchResult;
import syra.etl.app.model.User;

/**
 *
 * Business service for Mapping-related operations.
 *
 */
@Service
public class MappingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(MappingService.class);

    @Autowired
    MappingRepository mappingRepository;

    @Autowired
    UserRepository userRepository;

    /**
     *
     * searches mappings by date/time
     *
     * @param username - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<Mapping> findMappings(String username) {

        Long resultsCount = mappingRepository.countMappings(username);

        List<Mapping> mappings = mappingRepository.findMappings(username);

        return new SearchResult<>(resultsCount, mappings);
    }

    /**
     *
     * deletes a list of mappings, given their Ids
     *
     * @param deletedMappingIds - the list of mappings to delete
     */
    @Transactional
    public void deleteMappings(List<Long> deletedMappingIds) {
        notNull(deletedMappingIds, "deletedMappingsId is mandatory");
        deletedMappingIds.stream().forEach((deletedMappingId) -> mappingRepository.delete(deletedMappingId));
    }

    /**
     *
     * saves a mapping (new or not) into the database.
     *
     * @param username - - the currently logged in user
     * @param id - the database ud of the mapping
     * @return - the new version of the mapping
     */

    @Transactional
    public Mapping saveMapping(String username, Long id, Long folderId, String mappingName, 
								Integer sourceConnId, Integer targetConnId, String mappings, String s3FieldDelim) {

        assertNotBlank(username, "username cannot be blank");
        notNull(mappingName, "mappingName is mandatory");
        notNull(folderId, "folderId is mandatory");

        Mapping mapping = null;

        if (id != null) {
            mapping = mappingRepository.findMappingById(id);

            mapping.setFolderId(folderId);
            mapping.setMappingName(mappingName);
			mapping.setSourceConnId(sourceConnId);
			mapping.setTargetConnId(targetConnId);
			mapping.setMappings(mappings);
			mapping.setS3FieldDelim(s3FieldDelim);			
        } else {
            User user = userRepository.findUserByUsername(username);

            if (user != null) {
                mapping = mappingRepository.save(new Mapping(user, folderId, mappingName, 
																sourceConnId, targetConnId, 
																mappings, s3FieldDelim));
            } else {
                LOGGER.warn("A mapping was attempted to be saved for a non-existing user: " + username);
			}
        }

        return mapping;
    }

    /**
     *
     * saves a list of mappings (new or not) into the database
     *
     * @param username - the currently logged in user
     * @param mappings - the list of mappings to be saved
     * @return - the new versions of the saved mappings
     */
    @Transactional
    public List<Mapping> saveMappings(String username, List<MappingDTO> mappings) {
        return mappings.stream()
                .map((mapping) -> saveMapping(
                        username,
                        mapping.getId(),
                        mapping.getFolderId(),
						mapping.getMappingName(),
						mapping.getSourceConnId(),
						mapping.getTargetConnId(),
						mapping.getMappings(),
						mapping.getS3FieldDelim()))
                .collect(Collectors.toList());
    }
}
