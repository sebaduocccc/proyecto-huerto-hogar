package cl.huertohogar.backend.dto.venta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Checkout (pagina Pago). Los datos de la tarjeta NO se envian al backend.
 * Puede usarse como invitado o con sesion iniciada.
 */
public record VentaRequest(
        @NotBlank @Size(max = 100) String nombre,
        @NotBlank @Email(message = "El correo no es válido") @Size(max = 150) String correo,
        @Size(max = 20) String telefono,
        @NotBlank @Size(max = 255) String direccion,
        @NotBlank @Size(max = 100) String ciudad,
        @Size(max = 20) String codigoPostal,
        @NotBlank @Size(max = 60) String pais,
        @NotEmpty(message = "El carrito está vacío") @Size(max = 50) List<@Valid ItemVentaRequest> items
) {
}
