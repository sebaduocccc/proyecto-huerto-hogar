package cl.huertohogar.backend.validation;

import cl.huertohogar.backend.dto.usuario.RegistroRequest;
import cl.huertohogar.backend.util.Rut;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/** Las mismas reglas que validaciones.ts del frontend, ahora tambien en el backend. */
class ValidacionesTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @ParameterizedTest
    @ValueSource(strings = {"12.345.678-5", "12345678-5", "11.111.111-1", "9.999.999-3"})
    void rutsValidos(String rut) {
        assertThat(Rut.esValido(rut)).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"12.345.678-9", "12345678", "abc", "1-1", ""})
    void rutsInvalidos(String rut) {
        assertThat(Rut.esValido(rut)).isFalse();
    }

    @Test
    void registroValido() {
        assertThat(validator.validate(registro("12.345.678-5", "+56 9 1234 5678", LocalDate.of(1990, 1, 1)))).isEmpty();
    }

    @Test
    void registroInvalidoReportaCadaCampo() {
        Set<String> campos = errores(registro("12.345.678-9", "912345678", LocalDate.now().minusYears(17)));
        assertThat(campos).containsExactlyInAnyOrder("rut", "telefono", "fechaNacimiento");
    }

    private RegistroRequest registro(String rut, String telefono, LocalDate nacimiento) {
        return new RegistroRequest("Juan Pérez", "juan@mail.cl", "clave123", telefono, rut, nacimiento,
                "Región Metropolitana de Santiago", "Santiago", "Calle 1");
    }

    private Set<String> errores(Object o) {
        Set<ConstraintViolation<Object>> v = validator.validate(o);
        return v.stream().map(c -> c.getPropertyPath().toString()).collect(Collectors.toSet());
    }
}
