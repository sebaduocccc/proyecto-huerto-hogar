-- =====================================================================
-- Huerto Hogar - datos iniciales
-- =====================================================================

-- ---------- Permisos ----------
INSERT INTO permiso (id, nombre, descripcion) VALUES
    (1, 'PERFIL_PROPIO',        'Ver y editar el perfil propio'),
    (2, 'COMPRAS_PROPIAS',      'Ver el historial de compras propio'),
    (3, 'PRODUCTOS_GESTIONAR',  'Crear, editar y eliminar productos'),
    (4, 'CATEGORIAS_GESTIONAR', 'Crear, editar y eliminar categorias'),
    (5, 'USUARIOS_GESTIONAR',   'Crear, editar y eliminar usuarios'),
    (6, 'ROLES_GESTIONAR',      'Crear, editar y eliminar roles y asignarles permisos'),
    (7, 'VENTAS_GESTIONAR',     'Ver todas las ventas y cambiar su estado');

-- ---------- Roles (de sistema: no se pueden eliminar) ----------
INSERT INTO rol (id, nombre, descripcion, sistema) VALUES
    (1, 'ADMIN',   'Administrador de la tienda', TRUE),
    (2, 'USUARIO', 'Cliente registrado',         TRUE);

-- ADMIN: todos los permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT 1, id FROM permiso;

-- USUARIO: solo lo propio
INSERT INTO rol_permiso (rol_id, permiso_id) VALUES
    (2, 1),
    (2, 2);

-- ---------- Administrador por defecto ----------
-- email: admin@huertohogar.cl  |  password: admin123  (BCrypt)
INSERT INTO usuario (id, nombre, email, password, rol_id, activo, created_at, updated_at) VALUES
    (1, 'Administrador', 'admin@huertohogar.cl',
     '$2a$10$sMn7yDBVAC59vUnM9sRuXe7Hu9BNAbPxSm2y2euIGVfj5ouzrE20i',
     1, TRUE, NOW(6), NOW(6));

-- ---------- Categorias ----------
INSERT INTO categoria (id, nombre, descripcion) VALUES
    (1, 'Frutas',    'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura.'),
    (2, 'Verduras',  'Verduras orgánicas cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural.'),
    (3, 'Orgánicos', 'Productos elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables.'),
    (4, 'Lácteos',   'Productos lácteos de granjas locales dedicadas a la producción responsable y de calidad.');

-- ---------- Productos (catalogo del frontend) ----------
INSERT INTO producto (sku, nombre, categoria_id, precio, stock, imagen, descripcion, created_at, updated_at) VALUES
    ('FR001', 'Manzanas Fuji',        1, 1200, 10, '/productos/manzana-fuji.jpg',
     'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.', NOW(6), NOW(6)),
    ('FR002', 'Naranjas Valencia',    1, 1000, 10, '/productos/naranjas-valencia.png',
     'Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.', NOW(6), NOW(6)),
    ('FR003', 'Plátanos Cavendish',   1,  800, 10, '/productos/platano-cavendish.jpg',
     'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.', NOW(6), NOW(6)),
    ('VR001', 'Zanahorias Orgánicas', 2,  900, 10, '/productos/zanahoria-organica.jpg',
     'Zanahorias crujientes cultivadas sin pesticidas en la Región de O''Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.', NOW(6), NOW(6)),
    ('VR002', 'Espinacas Frescas',    2,  700, 10, '/productos/espinaca-fresca.jpg',
     'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.', NOW(6), NOW(6)),
    ('VR003', 'Pimientos Tricolores', 2, 1500, 10, '/productos/pimientos-tricolores.jpg',
     'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.', NOW(6), NOW(6)),
    ('PO001', 'Miel Orgánica',        3, 5000, 10, '/productos/miel-organica.webp',
     'Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.', NOW(6), NOW(6)),
    ('PO003', 'Quinoa Orgánica',      3, 3000, 10, '/productos/quinoa-organica.jpg',
     'Quinoa orgánica.', NOW(6), NOW(6)),
    ('PL001', 'Leche Entera',         4, 1000, 10, '/productos/leche-entera.webp',
     'Leche de vaca entera.', NOW(6), NOW(6));

INSERT INTO producto_detalle (producto_sku, clave, valor) VALUES
    ('FR001', 'Origen', 'Chile'), ('FR001', 'Variedad', 'Fuji'),
    ('FR002', 'Origen', 'Chile'), ('FR002', 'Variedad', 'Valencia'),
    ('FR003', 'Origen', 'Chile'), ('FR003', 'Variedad', 'Cavendish'),
    ('VR001', 'Origen', 'Chile'), ('VR001', 'Variedad', 'Orgánicas'),
    ('VR002', 'Origen', 'Chile'), ('VR002', 'Variedad', 'Frescas'),
    ('VR003', 'Origen', 'Chile'), ('VR003', 'Variedad', 'Tricolores'),
    ('PO001', 'Origen', 'Chile'), ('PO001', 'Variedad', 'Orgánica'),
    ('PO003', 'Origen', 'Chile'), ('PO003', 'Variedad', 'Orgánica'),
    ('PL001', 'Origen', 'Chile'), ('PL001', 'Variedad', 'Entera');
