// --- Funções e Eventos para as páginas de produtos ---

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

// NOVO: Função para mostrar a notificação estilizada
function showNotification(message) {
    const notification = document.getElementById('cart-notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        // Define um temporizador para remover a notificação após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); 
    }
}

// Evento de carregamento para as páginas de produtos
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
                    image: productImage 
                };
                cart.push(newProduct);
            }
            saveCart(cart);
            
            // NOVO: Chamamos a notificação estilizada em vez do alert()
            showNotification(`${quantityToAdd}x ${productName} adicionado ao carrinho!`);
            
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
    updateCartCount();
});