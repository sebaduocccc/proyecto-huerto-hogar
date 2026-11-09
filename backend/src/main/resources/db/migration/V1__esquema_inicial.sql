-- =====================================================================
-- Huerto Hogar - esquema inicial
-- Migra a MySQL el modelo que el frontend guardaba en localStorage.
-- =====================================================================

-- ---------- Seguridad: permisos, roles y usuarios ----------

CREATE TABLE permiso (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(255),
    CONSTRAINT pk_permiso PRIMARY KEY (id),
    CONSTRAINT uk_permiso_nombre UNIQUE (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE rol (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50)  NOT NULL,
    descripcion VARCHAR(255),
    sistema     BOOLEAN      NOT NULL DEFAULT FALSE,
    CONSTRAINT pk_rol PRIMARY KEY (id),
    CONSTRAINT uk_rol_nombre UNIQUE (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE rol_permiso (
    rol_id     BIGINT NOT NULL,
    permiso_id BIGINT NOT NULL,
    CONSTRAINT pk_rol_permiso PRIMARY KEY (rol_id, permiso_id),
    CONSTRAINT fk_rol_permiso_rol     FOREIGN KEY (rol_id)     REFERENCES rol (id)     ON DELETE CASCADE,
    CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (permiso_id) REFERENCES permiso (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE usuario (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    nombre           VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    password         VARCHAR(255) NOT NULL,
    rut              VARCHAR(12),
    telefono         VARCHAR(20),
    direccion        VARCHAR(255),
    comuna           VARCHAR(100),
    region           VARCHAR(100),
    fecha_nacimiento DATE,
    rol_id           BIGINT       NOT NULL,
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at       DATETIME(6)  NOT NULL,
    updated_at       DATETIME(6),
    CONSTRAINT pk_usuario PRIMARY KEY (id),
    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT uk_usuario_rut UNIQUE (rut),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ---------- Catalogo ----------

CREATE TABLE categoria (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50) NOT NULL,
    descripcion TEXT,
    CONSTRAINT pk_categoria PRIMARY KEY (id),
    CONSTRAINT uk_categoria_nombre UNIQUE (nombre)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE producto (
    sku          VARCHAR(10)  NOT NULL,
    nombre       VARCHAR(100) NOT NULL,
    categoria_id BIGINT       NOT NULL,
    precio       INT          NOT NULL,
    stock        INT          NOT NULL,
    imagen       VARCHAR(255),
    descripcion  TEXT,
    created_at   DATETIME(6)  NOT NULL,
    updated_at   DATETIME(6),
    CONSTRAINT pk_producto PRIMARY KEY (sku),
    CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria (id),
    CONSTRAINT ck_producto_precio CHECK (precio >= 0),
    CONSTRAINT ck_producto_stock  CHECK (stock >= 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- equivale a "longDescription" del frontend (Origen, Variedad, ...)
CREATE TABLE producto_detalle (
    producto_sku VARCHAR(10)  NOT NULL,
    clave        VARCHAR(50)  NOT NULL,
    valor        VARCHAR(255) NOT NULL,
    CONSTRAINT pk_producto_detalle PRIMARY KEY (producto_sku, clave),
    CONSTRAINT fk_producto_detalle_producto FOREIGN KEY (producto_sku) REFERENCES producto (sku) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ---------- Ventas ----------

CREATE TABLE venta (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    fecha         DATETIME(6)  NOT NULL,
    usuario_id    BIGINT,                      -- NULL = compra como invitado
    nombre        VARCHAR(100) NOT NULL,
    correo        VARCHAR(150) NOT NULL,
    telefono      VARCHAR(20),
    direccion     VARCHAR(255) NOT NULL,
    ciudad        VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    pais          VARCHAR(60)  NOT NULL,
    total         INT          NOT NULL,
    estado        VARCHAR(20)  NOT NULL DEFAULT 'CONFIRMADA',
    CONSTRAINT pk_venta PRIMARY KEY (id),
    CONSTRAINT fk_venta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_venta_usuario ON venta (usuario_id);
CREATE INDEX idx_venta_fecha ON venta (fecha);

CREATE TABLE detalle_venta (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    venta_id        BIGINT       NOT NULL,
    producto_sku    VARCHAR(10),               -- NULL si el producto se elimino del catalogo
    sku             VARCHAR(10)  NOT NULL,     -- copia del sku al momento de la compra
    nombre_producto VARCHAR(100) NOT NULL,
    imagen          VARCHAR(255),
    precio_unitario INT          NOT NULL,
    cantidad        INT          NOT NULL,
    subtotal        INT          NOT NULL,
    CONSTRAINT pk_detalle_venta PRIMARY KEY (id),
    CONSTRAINT fk_detalle_venta_venta    FOREIGN KEY (venta_id)     REFERENCES venta (id)     ON DELETE CASCADE,
    CONSTRAINT fk_detalle_venta_producto FOREIGN KEY (producto_sku) REFERENCES producto (sku) ON DELETE SET NULL,
    CONSTRAINT ck_detalle_venta_cantidad CHECK (cantidad > 0)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
