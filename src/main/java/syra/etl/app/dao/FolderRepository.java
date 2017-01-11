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

import syra.etl.app.model.Folder;
import syra.etl.app.model.User;

/**
 *
 * Repository class for the Folder entity
 *
 */
@Repository
public class FolderRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(FolderRepository.class);

    @PersistenceContext
    EntityManager em;

    /**
     * finds a user_id given its username
     *
     * @param user_id - the user_id of the searched user
     * @return  a matching user, or null if no user found.
     */
    public Folder findUserByUserID(long user_id) {

        List<Folder> folder = em.createNamedQuery(Folder.FIND_BY_USERID, Folder.class)
                .setParameter("user_id", user_id)
                .getResultList();

        return folder.size() == 1 ? folder.get(0) : null;
    }

    /**
     * finds a folder Id given its username
     *
     * @param folderId - the user_id of the searched user
     * @return  a matching user, or null if no user found.
     */
    public Folder findUserByFolderID(long folderId) {

        List<Folder> folder = em.createNamedQuery(Folder.FIND_BY_FOLDERID, Folder.class)
                .setParameter("id", folderId)
                .getResultList();

        return folder.size() == 1 ? folder.get(0) : null;
    }

    
    /**
     *
     * counts the matching folders, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching folders, or an empty collection if no match found
     */
    

    public Long countFolders(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Folder> countRoot = cq.from(Folder.class);
        cq.select((cb.count(countRoot)));
        cq.where(getCommonWhereCondition(cb, username, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * finds a list of folders, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching folders, or an empty collection if no match found
     */
    public List<Folder> findFolders(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Folder> searchQuery = cb.createQuery(Folder.class);
        Root<Folder> searchRoot = searchQuery.from(Folder.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getCommonWhereCondition(cb, username, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("folderName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Folder> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }
    
    /**
    *
    * counts the matching folders, given the bellow criteria
    *
    * @param account-id - the currently account
    * @return -  a list of matching folders, or an empty collection if no match found
    */
    public Long countFolders(long account_id) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Folder> countRoot = cq.from(Folder.class);
        cq.select((cb.count(countRoot)));
        cq.where(getCommonWhereCondition(cb, account_id, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }

    /**
     *
     * finds a list of folders, given the bellow criteria
     *
     * @param account-id - the currently account
     * @return -  a list of matching folders, or an empty collection if no match found
     */
    public List<Folder> findFolders(long account_id) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Folder> searchQuery = cb.createQuery(Folder.class);
        Root<Folder> searchRoot = searchQuery.from(Folder.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getCommonWhereCondition(cb, account_id, searchRoot));

        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("folderName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Folder> filterQuery = em.createQuery(searchQuery);
		
        return filterQuery.getResultList();
    }

    /**
     * Delete a folder, given its identifier
     *
     * @param deletedFolderId - the id of the folder to be deleted
     */
    public void delete(Long deletedFolderId) {
        Folder delete = em.find(Folder.class, deletedFolderId);
        em.remove(delete);
    }

    /**
     *
     * finds a folder given its id
     *
     */
    public Folder findFolderById(Long id) {
        return em.find(Folder.class, id);
    }

    /**
     *
     * save changes made to a folder, or create the folder if its a new folder.
     *
     */
    public Folder save(Folder folder) {
        return em.merge(folder);
    }


    private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, String username, Root<Folder> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<Folder, User> user = searchRoot.join("user");

        predicates.add(cb.equal(user.<String>get("username"), username));

        return predicates.toArray(new Predicate[]{});
    }
    
    private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, long account_id, Root<Folder> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<Folder, User> user = searchRoot.join("user");

        predicates.add(cb.equal(user.get("account_id"), account_id));

        return predicates.toArray(new Predicate[]{});
    }

}
