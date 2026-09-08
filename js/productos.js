const productsDatabase = {
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const product = productsDatabase[productId];

    if(!product) {
        renderNotFound();
        return;
    }

    populateProductDetails(product);

    setupQuantityControls();
    setupAddToCartForm(product);
});

function populateProductDetails(product) {
    document.title = `${product.name} | Huerto Hogar`;
    document.getElementById('breadcrumb-product-name').textContent = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-sku').textContent = product.sku;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-long-desc').textContent = product.longDescription;

    document.getElementById('product-price').textContent = `$${product.price.toLocaleString('es-CL')}`;

/*     if (product.oldPrice) {
        const oldPriceEl = document.getElementById('product-old-price');
        oldPriceEl.textContent = `$${product.oldPrice.toLocaleString('es-CL')}`
        oldPriceEl.classList.remove('d-none');
    }

    if (product.badge) {
        const badgeEl = document.getElementById('product-badge');
        badgeEl.textContent = product.badge;
        badgeEl.classList.remove('d-none');
    } */

    const mainImg = document.getElementById('product-image');
    mainImg.src = product.image;
    mainImg.alt = product.name;
    
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    if (product.gallery && product.gallery.length > 1) {
        thumbnailsContainer.innerHTML = product.gallery.map((imgSrc, index) => `
        <button type="button" class="btn p-0 border rounded overflow-hidden thumbnail-btn ${index === 0 ? 'border-primary': ''}" style="width: 70px; height: 70px;">
            <img src="${imgSrc}" class="w-100 h-100 object-fit-cover" alt="Vista ${index+1}">
        </button>
        `).join('');

        thumbnailsContainer.querySelectorAll('.thumbnail-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const clickedImgSrc = btn.querySelector('img').src;
                mainImg.src = clickedImgSrc;

                thumbnailsContainer.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('border-primary'));
                btn.classList.add('border-primary');
            });
        });
    }

    const longDescription = document.getElementById('product-long-desc');
    if (product.longDescription) {
        longDescription.innerHTML = Object.entries(product.longDescription).map(([key, value]) => `
        <li class="py-1 border-bottom">
            <strong class="text-dark">${key}:</strong> <span class="text-secondary">${value}</span>
        </li>
        `).join('');
    }
}

function renderNotFound() {
    document.querySelector('main').innerHTML = `
    <div class="text-center py-5">
        <h2>Producto no encontrado</h2>
        <p class="text-muted">El producto que buscas no existe o fue removido.</p>
        <a href="productos.html" class="btn btn-primary mt-3">Volver al catálogo</a>
    </div>   
    `;
}

function setupQuantityControls() {
    const qtyInput = document.getElementById('quantity-input');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');

    btnMinus.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value) || 1;
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });
    
    btnPlus.addEventListener('click', () => {
        const currentValue = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentValue + 1;
    });
}

function setupAddToCartForm(product) {
    const form = document.getElementById('add-to-cart-form');
    const qtyInput = document.getElementById('quantity-input');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const quantity = parseInt(qtyInput.value) || 1;

        const cart=JSON.parse(localStorage.getItem('cart')) || [];

        const existingIndex=cart.findIndex(item=>item.id === product.id);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`Añadido ${quantity}x "${product.name}" al carrito!`);
    });
}