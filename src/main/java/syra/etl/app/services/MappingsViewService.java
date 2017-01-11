package syra.etl.app.services;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import syra.etl.app.dao.MappingsViewRepository;
import syra.etl.app.dao.UserRepository;
import syra.etl.app.model.MappingsView;
import syra.etl.app.model.SearchResult;

/**
 *
 * Business service for MappingsView-related operations.
 *
 */
@Service
public class MappingsViewService {

    @SuppressWarnings("unused")
	private static final Logger LOGGER = LoggerFactory.getLogger(MappingsViewService.class);

    @Autowired
    MappingsViewRepository mappingsviewRepository;

    @Autowired
    UserRepository userRepository;

    /**
     *
     * searches mappingsviewsviews
     *
     * @param username - the currently logged in user
     * @return - the found results
     */
    @Transactional(readOnly = true)
    public SearchResult<MappingsView> findMappingsViews(String username) {

        Long resultsCount = mappingsviewRepository.countMappingsViews(username);

        List<MappingsView> mappingsviews = mappingsviewRepository.findMappingsViews(username);

        return new SearchResult<>(resultsCount, mappingsviews);
    }
}
