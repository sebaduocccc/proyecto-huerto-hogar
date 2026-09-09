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

}

function renderCartTotal(cart){

}

function removeFromCart() {
    
}