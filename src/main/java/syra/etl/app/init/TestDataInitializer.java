package syra.etl.app.init;


import javax.persistence.EntityManagerFactory;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import syra.etl.app.model.Account;
import syra.etl.app.model.User;
import syra.etl.app.model.UserLog;
import syra.etl.app.model.Connection;
import syra.etl.app.model.Folder;
import syra.etl.app.model.Job;
import syra.etl.app.model.Mapping;
import syra.etl.app.model.S3Credentials;
import syra.etl.app.model.ServerCredentials;

//import syra.etl.app.model.UserRole;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * This is a initializing bean that inserts some test data in the database. It is only active in
 * the development profile, to see the data login with user123 / PAssword2 and do a search starting on
 * 1st of January 2015.
 *
 */
@Component
public class TestDataInitializer {

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    Logger LOGGER = LoggerFactory.getLogger(TestDataInitializer.class);

    public void init() throws Exception {

		SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);

        Session session = sessionFactory.openSession();
        Transaction transaction = session.beginTransaction();

        Account account= new Account("vikash","vikash@gmail.com",4,1);
        session.persist(account);
        //LOGGER.info(account.getAccountid());
        
        //UserRole userrole = new UserRole("Admin");
        //session.persist(userrole);
        
        User user = new User("vikash", "$2a$10$HrO7qJd57sIYAZ7d68CKa.hyeANQNmkLj8vUSnlvC/pjLOhm51G1C", "test@email.com","ADMIN", account);
        //$2a$10$x9vXeDsSC2109FZfIJz.pOZ4dJ056xBpbesuMJg3jZ.ThQkV119t
        //$2a$10$HrO7qJd57sIYAZ7d68CKa.hyeANQNmkLj8vUSnlvC/pjLOhm51G1C
        session.persist(user);
        
        Folder folder=new Folder(user, "Main");
        session.persist(folder);
        
        //S3Credentials(User user, String secretKey,String accessKey)
        S3Credentials S3=new S3Credentials(user, "Syra Account","AKIAJZJDCKYE224FBKUA", "U+RBTBz3M6UBt1muMxfN2hlX\\/bkIUs9DAZQiypiq");
        session.persist(S3);
        
        ServerCredentials Server=new ServerCredentials(user, "Server1 ",8080L, "test","test","121.121.2112.1212");
        session.persist(Server);
        
        Job jb=new Job(user,Server,S3,"","","" );
        session.persist(jb);
        
        
        UserLog userlog = new UserLog(user, "Admin", null, null, null, null);
        session.persist(userlog);
        
		// session.persist(new Connection(user, new Date(115, 0, 1), new Time(12, 0, 0), "1 - Mitraillette", 2000L));
        
		session.persist(new Connection(user,folder, "My Connection", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My HDFS Connection", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My Hive Connection2", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My Connection2", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My HDFS Connection2", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My Hive Connection3", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My Connection3", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user,folder, "My HDFS Connection3", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		/*session.persist(new Connection(user, "My Hive Connection4", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Connection4", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My HDFS Connection4", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Hive Connection5", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Connection5", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My HDFS Connection5", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Hive Connection6", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Connection6", "Hive", "","","","","http://localhost", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My HDFS Connection6", "HDFS", "http://hdfs","/mypath","myuser","",",", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
		session.persist(new Connection(user, "My Hive Connection7", "Hive", "","","","","http://localhost2", "http://redshift.com", "redshiftuser", "pass", "accessKey", "secreteKey", "/tmp", ""));
*/
		session.persist(new Mapping(user, -1L, "My Hive to Redshift mapping", 101, 102, "my mappings data will come in this field..", ","));
		
		

        transaction.commit();
    }
}
