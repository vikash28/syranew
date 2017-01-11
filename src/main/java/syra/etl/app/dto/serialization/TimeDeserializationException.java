package syra.etl.app.dto.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 *
 * Custom exception thrown when it was not possible to deserialize a time field,
 * @see syra.etl.app.dto.serialization.CustomTimeDeserializer
 *
 */
@SuppressWarnings("serial")
public class TimeDeserializationException extends JsonProcessingException {

    protected TimeDeserializationException(Throwable rootCause) {
        super(rootCause);
    }

}
