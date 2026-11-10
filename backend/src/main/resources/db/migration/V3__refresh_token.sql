-- =====================================================================
-- Refresh tokens: permiten renovar el access token (JWT) sin volver a pedir la contraseña.
-- Solo se guarda el hash SHA-256 del token, nunca el valor real.
-- =====================================================================
CREATE TABLE refresh_token (
    id          BIGINT      NOT NULL AUTO_INCREMENT,
    usuario_id  BIGINT      NOT NULL,
    token_hash  VARCHAR(64) NOT NULL,
    creado_en   DATETIME(6) NOT NULL,
    expira_en   DATETIME(6) NOT NULL,
    revocado_en DATETIME(6),
    rotado      BOOLEAN     NOT NULL DEFAULT FALSE,   -- TRUE = se revoco porque se emitio uno nuevo
    CONSTRAINT pk_refresh_token PRIMARY KEY (id),
    CONSTRAINT uk_refresh_token_hash UNIQUE (token_hash),
    CONSTRAINT fk_refresh_token_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_refresh_token_usuario ON refresh_token (usuario_id);
CREATE INDEX idx_refresh_token_expira ON refresh_token (expira_en);
