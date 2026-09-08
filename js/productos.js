document.addEventListener('DOMContentLoaded', () => {
    renderProductCatalog();
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
                            <img src="${product.image || 'img/not-found.svg'}" class="card-img-top img-fluid" alt="${product.name}" style="height: 100px; object-fit: contain;">
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
                                $${product.price.toLocalString('es-CL')}
                            </p>
                        </div>
                        <button type="button" class="btn btn-primary add-to-cart-btn w-100" onclick="quickAddToCart('${product.sku}')">
                            <i class="fa-solid fa-cart-shopping me-2"></i>Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>               
        `).join('');
}

function quickAddToCart(sku) {
    const catalog = getCatalog();
    const product = catalog[sku];

    if(!product) return;

    const cart=JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex=cart.findIndex(item => item.sku === products.sku);

    if(existingIndex > -1) {
        cart[existingIndex].qantity+=1;
    } else {
        cart.push({
            sku: product.sku,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`1x "${product.name}" añadido al carrito!`)
}