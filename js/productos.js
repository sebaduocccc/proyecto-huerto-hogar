document.addEventListener('DOMContentLoaded', () => {
    renderProductCatalog();

    const gridContainer = document.getElementById('products-catalog');
    gridContainer.addEventListener('click', (event) => {
        const minusBtn = event.target.closest('.btn-qty-minus');
        if (minusBtn) {
            const span = minusBtn.closest('.input-group').querySelector('.quantity-input');
            const current = parseInt(span.textContent, 10) || 1;
            if (current > 1) span.textContent = current - 1;
        }

        const plusBtn = event.target.closest('.btn-qty-plus');
        if (plusBtn) {
            const span = plusBtn.closest('.input-group').querySelector('.quantity-input');
            const current = parseInt(span.textContent, 10) || 1;
            span.textContent = current + 1;
        }

        
    })
});

function renderProductCatalog() {
    const gridContainer = document.getElementById('products-catalog');
    if (!gridContainer) return;

    const catalog = getCatalog();
    const products = Object.values(catalog);

    if (products.length === 0) {
        gridContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3 class="text-muted">No hay productos disponibles.</h3>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = products.map(product => `
            <div class="col">
                <div class="card h-100 product-card border-0 shadow-sm text-center">
                    <div class="card-image-wrapper">
                        <a href="producto-detalle.html?sku=${product.sku}">
                            <img src="${product.image || 'img/not-found.svg'}" class="card-img-top img-fluid mt-3" alt="${product.name}" style="height: 100px; object-fit: contain;">
                        </a>
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <span class="badge bg-light text-secondary mb-2">${product.category || 'General'}</span>
                            <h5 class="card-title mb-1">
                                <a href="producto-detalle.html?sku=${product.sku}" class="product-link text-decoration-none text-dark fw-bold">
                                    ${product.name}
                                </a>
                            </h5>
                            <p class="product-price fw-bold text-emerald fs-5 mb-3">
                                $${product.price.toLocaleString('es-CL')}
                            </p>
                        </div>
                        <div class="input-group my-3 align-self-center" style="width: 130px;">
                            <button type="button" class="btn btn-outline-secondary btn-qty-minus">-</button>
                            <span class="form-control text-center quantity-input">1</span>
                            <button type="button" class="btn btn-outline-secondary btn-qty-plus">+</button>
                        </div>
                        <button type="button" class="btn btn-primary add-to-cart-btn w-100" onclick="quickAddToCart('${product.sku}', this)">
                            <i class="fa-solid fa-cart-shopping me-2"></i>Añadir al carrito
                        </button>                        
                    </div>
                </div>
            </div>               
        `).join('');
}

function quickAddToCart(sku, button) {
    const catalog = getCatalog();
    const product = catalog[sku];

    if(!product) return;

    const card = button.closest('.product-card');
    const qtySpan = card.querySelector('.quantity-input');
    const quantity = parseInt(qtySpan.textContent, 10) || 1;

    const cart=JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex=cart.findIndex(item => item.sku === product.sku);

    if(existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} unidad(es) de ${product.name} añadido(s) al carrito.`)
}