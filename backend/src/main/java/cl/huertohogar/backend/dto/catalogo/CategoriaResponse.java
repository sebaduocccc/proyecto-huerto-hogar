package cl.huertohogar.backend.dto.catalogo;

import cl.huertohogar.backend.model.Categoria;

public record CategoriaResponse(Long id, String nombre, String descripcion) {
    public static CategoriaResponse desde(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getNombre(), c.getDescripcion());
    }
}
