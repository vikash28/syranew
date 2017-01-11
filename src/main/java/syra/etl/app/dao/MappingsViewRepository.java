package syra.etl.app.dao;


import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import syra.etl.app.model.MappingsView;
import syra.etl.app.model.User;

/**
 *
 * Repository class for the MappingsView entity
 *
 */
@Repository
public class MappingsViewRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(MappingsViewRepository.class);

    @PersistenceContext
    EntityManager em;

    /**
     *
     * counts the matching mappingsviews, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching mappingsviews, or an empty collection if no match found
     */
    public Long countMappingsViews(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<MappingsView> countRoot = cq.from(MappingsView.class);
        cq.select((cb.count(countRoot)));
        cq.where(getCommonWhereCondition(cb, username, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * finds a list of mappingsviews, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching mappingsviews, or an empty collection if no match found
     */
    public List<MappingsView> findMappingsViews(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<MappingsView> searchQuery = cb.createQuery(MappingsView.class);
        Root<MappingsView> searchRoot = searchQuery.from(MappingsView.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getCommonWhereCondition(cb, username, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("mappingName")));
        searchQuery.orderBy(orderList);

        TypedQuery<MappingsView> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     *
     * finds a mappingsview given its id
     *
     */
    public MappingsView findMappingsViewById(Long id) {
        return em.find(MappingsView.class, id);
    }

    private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, String username, Root<MappingsView> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<MappingsView, User> user = searchRoot.join("user");

        predicates.add(cb.equal(user.<String>get("username"), username));

        return predicates.toArray(new Predicate[]{});
    }

}
