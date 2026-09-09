document.addEventListener('DOMContentLoaded', () => {
    initCart();
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function initCart() {
    renderCart();
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
                        <img src="${item.image || 'img/not-found.svg'}" alt="${item.name}" style="width: 60px; object-fit: contain";>
                        <span class="fw-bold">${item.name}</span>
                    </div>
                </td>
                <td>$${item.price.toLocaleString('es-CL')}</td>
                <td>${item.quantity}</td>
                <td class="fw-bold">$${subtotal.toLocaleString('es-CL')}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm remove-item-btn" data-sku="{item.sku}" aria-label="Eliminar ${item.name}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function renderCartTotal(cart){

}

function removeFromCart() {

}