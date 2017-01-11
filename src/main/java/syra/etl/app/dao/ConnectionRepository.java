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

//import syra.etl.app.model.Account;
import syra.etl.app.model.Connection;
import syra.etl.app.model.Folder;
import syra.etl.app.model.User;

/**
 *
 * Repository class for the Connection entity
 *
 */
@Repository
public class ConnectionRepository {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConnectionRepository.class);

    @PersistenceContext
    EntityManager em;

    /**
     *
     * counts the matching connections, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching connections, or an empty collection if no match found
     */
    public Long countConnections(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // query for counting the total results
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<Connection> countRoot = cq.from(Connection.class);
        cq.select((cb.count(countRoot)));
        cq.where(getCommonWhereCondition(cb, username, countRoot));
        Long resultsCount = em.createQuery(cq).getSingleResult();

        LOGGER.info("Found " + resultsCount + " results.");

        return resultsCount;
    }
    

    /**
     *
     * finds a list of connections, given the bellow criteria
     *
     * @param username - the currently logged in username
     * @return -  a list of matching connections, or an empty collection if no match found
     */
    public List<Connection> findConnections(String username) {

        CriteriaBuilder cb = em.getCriteriaBuilder();

        // the actual search query that returns one page of results
        CriteriaQuery<Connection> searchQuery = cb.createQuery(Connection.class);
        Root<Connection> searchRoot = searchQuery.from(Connection.class);
        searchQuery.select(searchRoot);
        searchQuery.where(getCommonWhereCondition(cb, username, searchRoot));
        
        List<Order> orderList = new ArrayList<Order>();
        orderList.add(cb.desc(searchRoot.get("connectionName")));
        searchQuery.orderBy(orderList);

        TypedQuery<Connection> filterQuery = em.createQuery(searchQuery);
		
       
        
        return filterQuery.getResultList();
    }

    /**
    *
    * counts the matching connections, given the bellow criteria
    *
    * @param username - the currently logged in username
    * @return -  a list of matching connections, or an empty collection if no match found
    */
   public Long countConnectionsAdmin(String username,long account_id) {

       CriteriaBuilder cb = em.getCriteriaBuilder();

       // query for counting the total results
       CriteriaQuery<Long> cq = cb.createQuery(Long.class);
       Root<Connection> countRoot = cq.from(Connection.class);
       cq.select((cb.count(countRoot)));
       cq.where(getCommonWhereConditionAdmin(cb, username,account_id, countRoot));
       Long resultsCount = em.createQuery(cq).getSingleResult();

       LOGGER.info("Found " + resultsCount + " results.");

       return resultsCount;
   }

   
    
    /**
    *
    * finds a list of connections for Admin, given the bellow criteria
    *
    * @param username - the currently logged in username
    * @return -  a list of matching connections, or an empty collection if no match found
    */
   public List<Connection> findConnectionsAdmin(String username,long account_id) {

       
	   
	   CriteriaBuilder cb = em.getCriteriaBuilder();
	   /* CriteriaQuery<Connection> searchQuery = cb.createQuery(Connection.class);
	   Root<Connection> searchRoot = searchQuery.from(Connection.class);
	   
	   Join<Connection, User> user = searchRoot.join(User.FIND_BY_USERNAME);
	   searchQuery.select(searchRoot);
	   searchQuery.where(cb.equal(user.get("account_id"), account_id ));*/
	   //Join<Order, Item> item = order.join(Order_.itemList, JoinType.LEFT);
	   //Join<Item, Type> type = order.join(Item_.type, JoinType.LEFT);
	   //cq.select(searchRoot);
	   //cq.where(cb.equal(type.get(Type_.id), 1));
	   
	   
	  // CriteriaBuilder cb = em.getCriteriaBuilder();

       // the actual search query that returns one page of results
       CriteriaQuery<Connection> searchQuery = cb.createQuery(Connection.class);
       Root<Connection> searchRoot = searchQuery.from(Connection.class);
       searchQuery.select(searchRoot);
       searchQuery.where(getCommonWhereConditionAdmin(cb, username,account_id, searchRoot));
       List<Order> orderList = new ArrayList<Order>();
       orderList.add(cb.desc(searchRoot.get("connectionName")));
       searchQuery.orderBy(orderList);

       TypedQuery<Connection> filterQuery = em.createQuery(searchQuery);
       //LOGGER.info("Found " + filterQuery.getResultList() + " results.");
       return filterQuery.getResultList();
   }

   /**
   *
   * counts the matching connections, given the bellow criteria
   *
   * @param username - the currently logged in username
   * @return -  a list of matching connections, or an empty collection if no match found
   */
  public Long countConnectionsByfolder(String username,long folderId) {

      CriteriaBuilder cb = em.getCriteriaBuilder();
      CriteriaQuery<Long> cq = cb.createQuery(Long.class);
      Root<Connection> countRoot = cq.from(Connection.class);
      cq.select((cb.count(countRoot)));
      cq.where(getCommonWhereConditionFolder(cb, username,folderId, countRoot));
      Long resultsCount = em.createQuery(cq).getSingleResult();

      LOGGER.info("Found " + resultsCount + " results.");

      return resultsCount;
  }

  
   
   /**
   *
   * finds a list of connections for Folder, given the bellow criteria
   *
   * @param username - the currently logged in username
   * @return -  a list of matching connections, or an empty collection if no match found
   */
  public List<Connection> findConnectionsByfolder(String username,long folderId) {

      
	   
	  CriteriaBuilder cb = em.getCriteriaBuilder();
	    
      CriteriaQuery<Connection> searchQuery = cb.createQuery(Connection.class);
      Root<Connection> searchRoot = searchQuery.from(Connection.class);
      searchQuery.select(searchRoot);
      searchQuery.where(getCommonWhereConditionFolder(cb, username,folderId, searchRoot));
      List<Order> orderList = new ArrayList<Order>();
      orderList.add(cb.desc(searchRoot.get("connectionName")));
      searchQuery.orderBy(orderList);

      TypedQuery<Connection> filterQuery = em.createQuery(searchQuery);
       return filterQuery.getResultList();
  }

    /**
     * Delete a connection, given its identifier
     *
     * @param deletedConnectionId - the id of the connection to be deleted
     */
    public void delete(Long deletedConnectionId) {
        Connection delete = em.find(Connection.class, deletedConnectionId);
        em.remove(delete);
    }

    /**
     *
     * finds a connection given its id
     *
     */
    public Connection findConnectionById(Long id) {
        return em.find(Connection.class, id);
    }

    /**
     *
     * save changes made to a connection, or create the connection if its a new connection.
     *
     */
    public Connection save(Connection connection) {
        return em.merge(connection);
    }


    private Predicate[] getCommonWhereCondition(CriteriaBuilder cb, String username, Root<Connection> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        //Join<Connection, User> folder = searchRoot.join("user");
        //predicates.add(cb.equal(folder.<String>get("username"), username));
        Join<Folder, User> user = searchRoot.join("user");

        predicates.add(cb.equal(user.<String>get("username"), username));

        return predicates.toArray(new Predicate[]{});
    }
    
    private Predicate[] getCommonWhereConditionAdmin(CriteriaBuilder cb, String username,long account_id, Root<Connection> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<Connection, User> user = searchRoot.join("user");
        //predicates.add(cb.equal(user.<String>get("username"), username));
        predicates.add(cb.equal(user.get("account_id"), 1));
        
        return predicates.toArray(new Predicate[]{});
    }
    
    private Predicate[] getCommonWhereConditionFolder(CriteriaBuilder cb, String username,long folderId, Root<Connection> searchRoot) {

        List<Predicate> predicates = new ArrayList<>();
        Join<Connection, Folder> folder = searchRoot.join("folder");
        predicates.add(cb.equal(folder.get("id"), folderId));
        
        return predicates.toArray(new Predicate[]{});
    }

}
