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

// Função para mostrar a notificação estilizada
function showNotification(message) {
    const notification = document.getElementById('cart-notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000); 
    }
}

// NOVO: Função para detectar se é um dispositivo móvel
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

// Evento de carregamento para as páginas de produtos
document.addEventListener('DOMContentLoaded', () => {

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

    // NOVO: Definimos o URL do WhatsApp com base no dispositivo
    const phoneNumber = '5591984579361';
    let whatsappBaseURL = '';
    if (isMobileDevice()) {
        whatsappBaseURL = `https://wa.me/${phoneNumber}`;
    } else {
        whatsappBaseURL = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    }

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
            showNotification(`${quantityToAdd}x ${productName} adicionado ao carrinho!`);
            updateCartCount();
        });
    }
    
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            const productName = document.querySelector('.product-name').textContent;
            const productPrice = document.querySelector('.product-price').textContent;
            const quantity = document.querySelector('.quantity').textContent;
            
            let message = `Olá, Mariane! Gostaria de comprar o seguinte produto:%0AProduto: ${productName}%0APreço: ${productPrice}%0AQuantidade: ${quantity}%0A%0APor favor, me informe sobre as formas de pagamento e entrega.`;

            // NOVO: Usamos a URL base dinâmica
            window.open(`${whatsappBaseURL}&text=${message}`, '_blank');
        });
    }
    updateCartCount();
});