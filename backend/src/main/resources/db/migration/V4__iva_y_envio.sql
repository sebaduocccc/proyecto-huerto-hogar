-- =====================================================================
-- Huerto Hogar - IVA y costo de envio en las ventas
-- total = subtotal (suma de productos) + iva (19%) + envio
-- =====================================================================

ALTER TABLE venta
    ADD COLUMN subtotal INT NOT NULL DEFAULT 0 AFTER pais,
    ADD COLUMN iva      INT NOT NULL DEFAULT 0 AFTER subtotal,
    ADD COLUMN envio    INT NOT NULL DEFAULT 0 AFTER iva;

-- las ventas anteriores se cobraron sin IVA ni envio: su total era solo la suma de productos
UPDATE venta SET subtotal = total;
