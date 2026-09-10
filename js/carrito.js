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
        if (!removeBtn) return;

        removeFromCart(removeBtn.dataset.sku);
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
                <td>${item.quantity}</td>
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