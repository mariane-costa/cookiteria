document.addEventListener('DOMContentLoaded', () => {
    // Estas funções agora estão em shared.js
    updateCartCount();
    renderCart();

    // Adiciona o event listener para os botões de ação do carrinho.
    document.getElementById('cart-items').addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('increment-quantity')) {
            const itemId = target.closest('.cart-item').dataset.id;
            changeQuantity(itemId, 1);
        } else if (target.classList.contains('decrement-quantity')) {
            const itemId = target.closest('.cart-item').dataset.id;
            changeQuantity(itemId, -1);
        } else if (target.closest('.remove-item')) {
            const itemId = target.closest('.cart-item').dataset.id;
            removeItem(itemId);
        }
    });

    // Event listener para o novo botão de esvaziar carrinho.
    document.getElementById('clear-cart-button').addEventListener('click', () => {
        clearCart();
    });
});

function renderCart() {
    const cart = loadCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    let subtotal = 0;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartSubtotalElement.textContent = 'Subtotal: R$ 0,00';
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;

            const itemPrice = parseFloat(product.price.replace('R$', '').replace(',', '.'));
            subtotal += itemPrice * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.id;

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${product.mainImage}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">${product.price}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-button decrement-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-button increment-quantity">+</button>
                    <button class="remove-item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartSubtotalElement.textContent = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

function changeQuantity(id, change) {
    const cart = loadCart();
    const item = cart.find(i => i.id === id);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            saveCart(cart);
            updateCartCount();
            renderCart();
        }
    }
}

function removeItem(id) {
    let cart = loadCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartCount();
    renderCart();
}

// NOVO: Função para esvaziar o carrinho
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
}

function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = loadCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}