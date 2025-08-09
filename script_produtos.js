// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Carrinho salvo:', cart);
}

// Função para carregar o carrinho do localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Carrinho carregado:', cart);
    return cart;
}

// Função para atualizar o contador de itens no cabeçalho
function updateCartCount() {
    const cart = loadCart();
    const cartCountElement = document.querySelector('.cart-count');

    // CORREÇÃO: Vamos somar a quantidade de cada item, e não apenas contar o número de itens
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
        // Calcula o preço total por item
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
    setupCartItemEvents();
}

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

// Função para atualizar a quantidade de um item no carrinho
function updateItemQuantity(index, change) {
    let cart = loadCart();
    if (cart[index]) {
        const currentQuantity = cart[index].quantity;
        const newQuantity = currentQuantity + change;

        if (newQuantity >= 1) {
            // Se a nova quantidade for 1 ou mais, apenas a atualizamos
            cart[index].quantity = newQuantity;
        } else {
            // Se a nova quantidade for 0 (ou menos), removemos o item
            cart.splice(index, 1);
        }
        
        saveCart(cart);
        renderCartItems();
        updateCartCount();
    }
}

function removeItem(index) {
    let cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart); // Salva o carrinho atualizado
    renderCartItems();
    updateCartCount();
}

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

// --- Eventos da Página ---
document.addEventListener('DOMContentLoaded', () => {
    // Lógicas da página de produto
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
                mainImage.src = thumbnail.src;
                mainImage.alt = thumbnail.alt;
            });
        });
    }

    const minusButton = document.querySelector('.quantity-button.minus');
    const plusButton = document.querySelector('.quantity-button.plus');
    const quantitySpan = document.querySelector('.quantity');
    if (minusButton && plusButton && quantitySpan) {
        let quantity = 1;
        minusButton.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });
        plusButton.addEventListener('click', () => {
            quantity++;
            quantitySpan.textContent = quantity;
        });
    }

    const addToCartButton = document.querySelector('.btn-add-to-cart');
    const buyButton = document.querySelector('.btn-buy');
    const whatsappBaseURL = 'https://wa.me/5591984579361';
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const productName = document.querySelector('.product-name').textContent;
            const productPrice = parseFloat(document.querySelector('.product-price').textContent.replace('R$ ', '').replace(',', '.'));
            const quantityToAdd = parseInt(document.querySelector('.quantity').textContent);
            
            // NOVO: Coletamos a URL da imagem principal para salvar no carrinho
            const productImage = document.querySelector('.main-image img').src;

            let cart = loadCart();
            let found = false;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].name === productName) {
                    cart[i].quantity += quantityToAdd;
                    found = true;
                    break;
                }
            }

            if (!found) {
                const newProduct = { 
                    name: productName, 
                    price: productPrice, 
                    quantity: quantityToAdd,
                    image: productImage // NOVO: Salvamos a URL da imagem aqui
                };
                cart.push(newProduct);
            }
            
            saveCart(cart);
            
            alert(`${quantityToAdd}x ${productName} adicionado ao carrinho!`);
            updateCartCount();
        });
    }
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            const productName = document.querySelector('.product-name').textContent;
            const productPrice = document.querySelector('.product-price').textContent;
            const quantity = document.querySelector('.quantity').textContent;
            const message = `Olá, Mariane! Gostaria de comprar o seguinte produto:%0AProduto: ${productName}%0APreço: ${productPrice}%0AQuantidade: ${quantity}%0A%0APor favor, me informe sobre as formas de pagamento e entrega.`;
            const whatsappURL = `${whatsappBaseURL}?text=${message}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // Lógicas da página do carrinho
    if (document.getElementById('cart-items')) {
        renderCartItems();
        setupCheckoutButton();
    }
    
    updateCartCount(); // Atualiza o contador em todas as páginas
});