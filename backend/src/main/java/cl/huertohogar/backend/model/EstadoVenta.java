package cl.huertohogar.backend.model;

/** Estado del pedido, desde la confirmacion hasta la entrega. */
public enum EstadoVenta {
    CONFIRMADA,
    EN_PREPARACION,
    ENVIADA,
    ENTREGADA,
    CANCELADA
}
