package cl.huertohogar.backend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/** La fecha de nacimiento debe corresponder a alguien de al menos {edad} años. Null se considera valido. */
@Documented
@Constraint(validatedBy = MayorDeEdadValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface MayorDeEdad {
    int edad() default 18;

    String message() default "Debes ser mayor de 18 años";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
