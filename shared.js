// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho do localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Função para atualizar o contador de itens no cabeçalho
function updateCartCount() {
    const cart = loadCart();
    const cartCountElement = document.querySelector('.cart-count');
    let totalQuantity = 0;
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;
    }
}

// Função para detectar se é um dispositivo móvel
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}