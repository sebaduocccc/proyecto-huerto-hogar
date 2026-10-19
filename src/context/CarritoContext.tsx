import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Producto } from "../data/catalogo";

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
    addItem: (producto: Producto, cantidad: number) => void;
    removeItem: (sku: string) => void;
    updateQuantity: (sku: string, delta: number) => void;
    clearCarrito: () => void;
};

const STORAGE_KEY = "carrito";

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
            if (existing) {
                return prev.map((i) =>
                    i.sku === producto.sku ? { ...i, quantity: i.quantity + cantidad } : i
                );
            }
            return [
                ...prev,
                {
                    sku: producto.sku,
                    name: producto.name,
                    price: producto.price,
                    image: producto.image,
                    quantity: cantidad,
                },
            ];
        });
    };

    const removeItem = (sku: string) => {
        setItems((prev) => prev.filter((i) => i.sku !== sku));
    };

    const updateQuantity = (sku: string, delta: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.sku === sku && i.quantity + delta >= 1
                    ? { ...i, quantity: i.quantity + delta }
                    : i
            )
        );
    };

    const clearCarrito = () => setItems ([]);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CarritoContext.Provider
            value={{ items, total, count, addItem, removeItem, updateQuantity, clearCarrito }}
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

