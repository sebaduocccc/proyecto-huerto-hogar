import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getProducto, type Producto } from "../data/catalogo";

export type CarritoItem = {
    sku: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

type CarritoContextValue = {
    items: CarritoItem[];
    total: number;
    count: number;
    getStock: (sku: string) => number;
    addItem: (producto: Producto, cantidad: number) => void;
    removeItem: (sku: string) => void;
    updateQuantity: (sku: string, delta: number) => void;
    clearCarrito: () => void;
};

const STORAGE_KEY = "carrito";

const getStock = (sku: string) => getProducto(sku)?.stock ?? 0;

function loadCarrito(): CarritoItem[] {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: {children: ReactNode}) {
    const [items, setItems] = useState<CarritoItem[]>(loadCarrito);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = (producto: Producto, cantidad: number) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.sku === producto.sku);
            const quantity = Math.min(
                (existing?.quantity ?? 0) + cantidad,
                getStock(producto.sku)
            );
            
            if (quantity <= 0) return prev;
            
            if (existing){
                return prev.map((i) =>
                    (i.sku === producto.sku ? { ...i, quantity } : i)
                );
            }
            const {sku, name, price, image } = producto;
            return [...prev, {sku, name, price, image, quantity }];
        });
    };

    

    const updateQuantity = (sku: string, delta: number) => {        
        setItems((prev) =>
            prev.map((i) =>
                i.sku === sku
                    ? { ...i, quantity: Math.max(1, Math.min(i.quantity + delta, getStock(sku))) }
                    : i
            )
        );
    };

    const removeItem = (sku: string) => 
        setItems((prev) => prev.filter((i) => i.sku !== sku));    
    
    const clearCarrito = () => setItems ([]);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CarritoContext.Provider
            value={{ items, total, count, getStock, addItem, removeItem, updateQuantity, clearCarrito }}
        >
            { children }
        </CarritoContext.Provider>
    );
};

export function useCarrito() {
    const ctx = useContext(CarritoContext);
    if (!ctx) throw new Error("useCarrito must be used inside <CarritoProvider>");
    return ctx;
}

