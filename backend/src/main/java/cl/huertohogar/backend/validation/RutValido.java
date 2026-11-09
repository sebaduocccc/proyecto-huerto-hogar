package cl.huertohogar.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/** El campo debe ser un RUT chileno valido. Null o vacio se consideran validos (usar @NotBlank si es obligatorio). */
@Documented
@Constraint(validatedBy = RutValidoValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface RutValido {
    String message() default "El RUT no es válido (ej: 12.345.678-5)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
