-- =====================================================================
-- Huerto Hogar - rol VENDEDOR
-- Puede ver la lista y el detalle de productos y de ordenes (solo lectura).
-- =====================================================================

-- ---------- Permisos de solo lectura ----------
INSERT INTO permiso (nombre, descripcion) VALUES
    ('PRODUCTOS_VER', 'Ver la lista y el detalle de los productos en el panel'),
    ('VENTAS_VER',    'Ver la lista y el detalle de las ordenes');

-- ADMIN mantiene todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM rol r JOIN permiso p
WHERE r.nombre = 'ADMIN' AND p.nombre IN ('PRODUCTOS_VER', 'VENTAS_VER');

-- ---------- Rol de sistema (no se puede eliminar) ----------
INSERT INTO rol (nombre, descripcion, sistema) VALUES
    ('VENDEDOR', 'Vendedor de la tienda', TRUE);

-- ver productos y ordenes + lo propio de cualquier cuenta (perfil y compras)
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT r.id, p.id FROM rol r JOIN permiso p
WHERE r.nombre = 'VENDEDOR'
  AND p.nombre IN ('PRODUCTOS_VER', 'VENTAS_VER', 'PERFIL_PROPIO', 'COMPRAS_PROPIAS');
