// --- Funções principais de gerenciamento do carrinho ---

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

// Função para exibir os itens na página do carrinho
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    const cart = loadCart();
    const cartSummary = document.getElementById('cart-summary');
    const emptyMessage = document.getElementById('empty-cart-message');
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        cartSummary.style.display = 'none';
        cartItemsContainer.innerHTML = '';
        return;
    }
    emptyMessage.style.display = 'none';
    cartSummary.style.display = 'flex';
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    cart.forEach((item, index) => {
        const itemTotalPrice = item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="Miniatura do produto ${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>
                    ${item.name} 
                    <small>(R$ ${item.price.toFixed(2).replace('.', ',')}/unidade)</small>
                </h3>
                <p class="cart-item-price">Total: R$ ${itemTotalPrice.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-button minus" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-button plus" data-index="${index}">+</button>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        subtotal += itemTotalPrice;
    });
    document.getElementById('cart-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Configura os eventos de clique para os botões do carrinho
function setupCartItemEvents() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    cartItemsContainer.addEventListener('click', (event) => {
        const target = event.target;
        const button = target.closest('button');
        if (!button) return;
        const index = button.dataset.index;
        if (button.classList.contains('minus')) {
            updateItemQuantity(index, -1);
        } else if (button.classList.contains('plus')) {
            updateItemQuantity(index, 1);
        } else if (button.classList.contains('remove-item')) {
            removeItem(index);
        }
    });
}

// Atualiza a quantidade de um item no carrinho
function updateItemQuantity(index, change) {
    let cart = loadCart();
    if (cart[index]) {
        const newQuantity = cart[index].quantity + change;
        if (newQuantity >= 1) {
            cart[index].quantity = newQuantity;
        } else {
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCartItems();
        updateCartCount();
    }
}

// Remove um item completamente do carrinho
function removeItem(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartItems();
    updateCartCount();
}

// Configura o botão de checkout
function setupCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');
    if (!checkoutButton) return;
    checkoutButton.addEventListener('click', () => {
        const cart = loadCart();
        const whatsappBaseURL = 'https://wa.me/5591984579361';
        let message = `Olá, Mariane! Gostaria de fazer o seguinte pedido:%0A%0A`;
        let subtotal = 0;
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        cart.forEach(item => {
            message += `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2).replace('.', ',')}%0A`;
            subtotal += item.price * item.quantity;
        });
        message += `%0ASubtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}%0A%0APor favor, me informe sobre as formas de pagamento e entrega.`;
        window.open(`${whatsappBaseURL}?text=${message}`, '_blank');
    });
}

// Evento de carregamento para a página do carrinho
document.addEventListener('DOMContentLoaded', () => {
    // Apenas executa na página do carrinho
    if (document.getElementById('cart-items')) {
        renderCartItems();
        setupCartItemEvents(); // Chamado apenas uma vez, na página do carrinho
        setupCheckoutButton();
    }
    updateCartCount();
});