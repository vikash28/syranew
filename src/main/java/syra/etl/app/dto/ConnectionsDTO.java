package syra.etl.app.dto;

import java.util.List;

/**
 *
 * JSON serializable DTO containing data concerning a connection search request.
 *
 */
public class ConnectionsDTO {

    List<ConnectionDTO> connections;

    public ConnectionsDTO(List<ConnectionDTO> connections) {
        this.connections = connections;
    }

    public List<ConnectionDTO> getConnections() {
        return connections;
    }

    public void setConnections(List<ConnectionDTO> connections) {
        this.connections = connections;
    }
}
