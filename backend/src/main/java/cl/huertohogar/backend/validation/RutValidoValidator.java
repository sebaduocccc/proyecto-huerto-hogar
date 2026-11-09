package cl.huertohogar.backend.validation;

import cl.huertohogar.backend.util.Rut;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class RutValidoValidator implements ConstraintValidator<RutValido, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null || value.isBlank() || Rut.esValido(value);
    }
}
