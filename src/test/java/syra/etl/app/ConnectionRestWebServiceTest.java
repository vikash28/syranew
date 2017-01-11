package syra.etl.app;

import static org.junit.Assert.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import sun.security.acl.PrincipalImpl;
import syra.etl.app.dao.ConnectionRepository;
import syra.etl.app.model.Connection;
import syra.etl.config.root.RootContextConfig;
import syra.etl.config.root.TestConfiguration;
import syra.etl.config.servlet.ServletContextConfig;

@SuppressWarnings("restriction")
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ActiveProfiles("test")
@ContextConfiguration(classes={TestConfiguration.class, RootContextConfig.class, ServletContextConfig.class})
public class ConnectionRestWebServiceTest {

    private MockMvc mockMvc;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private WebApplicationContext wac;

    @Before
    public void init()  {
        mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testSearchConnections() throws Exception {
        mockMvc.perform(get("/connection")
                .accept(MediaType.APPLICATION_JSON)
                .principal(new PrincipalImpl("test123")))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(jsonPath("$.['connections'].[0].['connectionName']").value("test"));
    }

    @Test
    public void testSaveConnections() throws Exception {
        mockMvc.perform(post("/connection")
                .contentType(MediaType.APPLICATION_JSON)
                .content("[{\"id\":\"1\", \"connectionName\": \"test\" }]")
                .accept(MediaType.APPLICATION_JSON)
                .principal(new PrincipalImpl(UserServiceTest.USERNAME)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(jsonPath("$.[0].['connectionName']").value("test"));
    }

    @Test
    public void deleteConnections() throws Exception {
        mockMvc.perform(delete("/connection")
                .contentType(MediaType.APPLICATION_JSON)
                .content("[3]")
                .accept(MediaType.APPLICATION_JSON)
                .principal(new PrincipalImpl(UserServiceTest.USERNAME)))
                .andDo(print())
                .andExpect(status().isOk());

        Connection connection = connectionRepository.findConnectionById(3L);
        assertNull("connection no deleted", connection);
    }

}
