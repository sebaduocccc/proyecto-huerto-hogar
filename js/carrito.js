document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

function getCart() {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    return Array.isArray(stored) ? stored : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function initCart() {
    renderCart();

    const cartTableBody = document.getElementById('cart-table-body');
    cartTableBody.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.remove-item-btn');
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.sku);
            return;
        }

        const minusBtn = event.target.closest('.btn-qty-minus');
        if (minusBtn) {
            updateQuantity(minusBtn.dataset.sku, -1);
            return
        }

        const plusBtn = event.target.closest('.btn-qty-plus');
        if (plusBtn) {
            updateQuantity(plusBtn.dataset.sku, 1);
            return
        }
    });

    const clearCartBtn = document.getElementById('clear-cart-btn');
    clearCartBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) return;

        if (confirm('¿Realmente quieres vaciar tu carrito?')) {
            saveCart([]);
            renderCart([]);
        }
    });
}

function renderCart() {
    const cart = getCart();
    const emptyCartMsg = document.getElementById('empty-cart-msg');
    const cartContent = document.getElementById('cart-content');

    if (cart.length === 0) {
        emptyCartMsg.classList.remove('d-none');
        cartContent.classList.add('d-none');
        return;
    }

    emptyCartMsg.classList.add('d-none');
    cartContent.classList.remove('d-none');

    renderCartTable(cart);
    renderCartTotal(cart);
}

function renderCartTable(cart){
    const cartTableBody = document.getElementById('cart-table-body');

    cartTableBody.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;

        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image || 'img/not-found.svg'}" alt="${item.name}" style="width: 60px; object-fit: contain;">
                        <span class="fw-bold">${item.name}</span>
                    </div>
                </td>
                <td>$${item.price.toLocaleString('es-CL')}</td>
                <td>
                    <div class="input-group input-group-sm" style="width: 110px;">
                        <button type="button" class="btn btn-outline-secondary btn-qty-minus" data-sku="${item.sku}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="form-control text-center">${item.quantity}</span>
                        <button type="button" class="btn btn-outline-secondary btn-qty-plus" data-sku="${item.sku}">+</button>
                    </div>           
                </td>
                <td class="fw-bold">$${subtotal.toLocaleString('es-CL')}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm remove-item-btn" data-sku="${item.sku}" aria-label="Eliminar ${item.name}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCartTotal(cart){
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total.toLocaleString('es-CL')}`;
}

function removeFromCart(sku) {
    const cart = getCart().filter(item => item.sku !== sku);
    saveCart(cart);
    renderCart();
}

function updateQuantity(sku, delta){
    const cart = getCart();
    const item = cart.find(item => item.sku === sku);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    item.quantity = newQuantity;

    saveCart(cart);
    renderCart();
}