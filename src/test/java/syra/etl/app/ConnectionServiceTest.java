package syra.etl.app;

import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static syra.etl.app.dto.ConnectionDTO.mapFromConnectionEntity;

import java.util.Arrays;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import syra.etl.app.dto.ConnectionDTO;
import syra.etl.app.model.Connection;
import syra.etl.app.services.ConnectionService;
import syra.etl.config.root.RootContextConfig;
import syra.etl.config.root.TestConfiguration;

@RunWith(SpringJUnit4ClassRunner.class)
@ActiveProfiles("test")
@ContextConfiguration(classes={TestConfiguration.class, RootContextConfig.class})
public class ConnectionServiceTest {

    @Autowired
    private ConnectionService connectionService;

    @PersistenceContext
    private EntityManager em;

    @Test
    public void deleteConnections() {
        connectionService.deleteConnections(Arrays.asList(15L));
        Connection connection = em.find(Connection.class, 15L);
        assertNull("connection was not deleted" , connection);
    }

    @Test(expected = IllegalArgumentException.class)
    public void deleteConnectionsNull() {
        connectionService.deleteConnections(null);
    }

    @Test
    public void saveConnections() {
        ConnectionDTO connection1 = mapFromConnectionEntity(em.find(Connection.class, 1L));
        ConnectionDTO connection2 = mapFromConnectionEntity(em.find(Connection.class, 2L));

        connection1.setConnectionName("test1");
        connection2.setConnectionName("test2");

        List<ConnectionDTO> connections = Arrays.asList(connection1, connection2);

        connectionService.saveConnections(UserServiceTest.USERNAME, connections);

        Connection m1 = em.find(Connection.class, 1L);
        assertTrue("connectionName1 not as expected: " + m1.getConnectionName(), "test1".equals(m1.getConnectionName()));
        
		Connection m2 = em.find(Connection.class, 2L);
        assertTrue("connectionName2 not as expected: " + m2.getConnectionName(), "test2".equals(m2.getConnectionName()));
    }
}
