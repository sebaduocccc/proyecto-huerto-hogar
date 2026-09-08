const defaultCatalog = {
    "FR001": {
        sku: "FR001",
        name: "Manzanas",        
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
    "FR002": {
        sku: "FR002",
        name: "Naranjas",
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

function getCatalog() {
    const stored = localStorage.getItem('productsCatalog');
    if (!stored) {
        localStorage.setItem('productsCatalog', JSON.stringify(defaultCatalog));
        return defaultCatalog;
    }
    return JSON.parse(stored);
}

function saveCatalog(catalog) {
    localStorage.setItem('productsCatalog', JSON.stringify(catalog));
}