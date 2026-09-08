const defaultCatalog = {
    "FR001": {
        sku: "FR001",
        name: "Manzanas Fuji",        
        category: "Frutas",
        price: 1200,
        stock: 150,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Fuji"
        }
    },
    "FR002": {
        sku: "FR002",
        name: "Naranjas Valencia",
        category: "Frutas",
        price: 1000,
        stock: 200,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Valencia"
        }
    },
    "FR003": {
        sku: "FR003",
        name: "Plátanos Cavendish",
        category: "Frutas",
        price: 800,
        stock: 250,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Cavendish"
        }
    }, 
    "VR001": {
        sku: "VR001",
        name: "Zanahorias Orgánicas",
        category: "Verduras",
        price: 900,
        stock: 100,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra, ideales para ensaladas, jugos o como snack saludable.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánicas"
        }
    }, 
    "VR002": {
        sku: "VR002",
        name: "Espinacas Frescas",
        category: "Verduras",
        price: 700,
        stock: 80,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Frescas"
        }
    }, 
    "VR003": {
        sku: "VR003",
        name: "Pimientos Tricolores",
        category: "Verduras",
        price: 1500,
        stock: 120,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Tricolores"
        }
    },
    "PO001": {
        sku: "PO001",
        name: "Miel Orgánica",
        category: "Orgánicos",
        price: 5000,
        stock: 50,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánica"
        }
    },    
    "PO003": {
        sku: "PO003",
        name: "Quinoa Orgánica",
        category: "Orgánicos",
        price: 3000,
        stock: 3,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Quinoa orgánica.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Orgánica"
        }
    },
    "PL001": {
        sku: "PL001",
        name: "Leche Entera",
        category: "Lácteos",
        price: 1000,
        stock: 3,
        image: "img/not-found.svg",
        gallery: ["img/not-found.svg", "img/not-found.svg"],
        description: "Leche de vaca entera.",
        longDescription: {
            "Origen": "Chile",
            "Variedad": "Entera"
        }
    }    
};

function getCatalog() {
    const stored = localStorage.getItem('productsCatalog');
    if (!stored) {
        localStorage.setItem('productsCatalog', JSON.stringify(defaultCatalog));
       stored = localStorage.getItem('productsCatalog');
    }
    return JSON.parse(stored);
}

function saveCatalog(catalog) {
    localStorage.setItem('productsCatalog', JSON.stringify(catalog));
}