const DEFAULT_PRODUCTS = {
    "manzanas": {
        id: "manzanas",
        name: "Manzanas",
        sku: "FR001",
        category: "Frutas",
        price: 750,
/*         oldPrice: 1000,
        badge: "25% OFF", */
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Manzanas rojas",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Fuji"
        }
    },
    "naranjas": {
        id: "naranjas",
        name: "Naranjas",
        sku: "FR002",
        category: "Frutas",
        price: 900,
/*         oldPrice: 1000,
        badge: "10% OFF", */
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Naranjas naranjas",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Valenciana"
        }
    }
};

function getProductsCatalog() {
    const stored = localStorage.getItem('products_catalog');
    if (!stored) {
        localStorage.setItem('products_catalog', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(stored);
}

function saveProductsCatalgo(catalog) {
    localStorage.setItem('products_catalog', JSON.stringify(catalog));
}