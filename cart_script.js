document.addEventListener('DOMContentLoaded', () => {
    // Estas funções agora estão em shared.js
    updateCartCount();
    renderCart();
});

function renderCart() {
    const cart = loadCart();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    let subtotal = 0;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            // Encontra o produto no array de dados global
            const product = products.find(p => p.id === item.id);
            if (!product) return; // Se não encontrar, pule para o próximo

            const itemPrice = parseFloat(product.price.replace('R$', '').replace(',', '.'));
            subtotal += itemPrice * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.id;

            // ... (o restante do código para criar os elementos do item do carrinho)
            // Criei um template para você não precisar reescrever
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
    }

    cartSubtotalElement.textContent = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// ... (o restante do seu código para interagir com o carrinho)
// Clicar em botões de + ou -
// Clicar em remover item
// ...