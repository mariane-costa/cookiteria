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

    // MANTIDO: Lógica para o WhatsApp, mas usada apenas no carrinho agora
    const phoneNumber = '5591984579361';
    let whatsappBaseURL = '';
    if (isMobileDevice()) {
        whatsappBaseURL = `https://wa.me/${phoneNumber}`;
    } else {
        whatsappBaseURL = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    }
    
    // NOVO: Função para adicionar o produto ao carrinho, usada pelos dois botões
    function addProductToCart() {
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
        updateCartCount();
        return { quantity: quantityToAdd, name: productName };
    }

    // ALTERADO: O botão "Adicionar ao Carrinho" agora usa a nova função
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const addedProduct = addProductToCart();
            showNotification(`${addedProduct.quantity}x ${addedProduct.name} adicionado ao carrinho!`);
        });
    }
    
    // ALTERADO: O botão "Comprar" agora adiciona o item e redireciona para o carrinho
    if (buyButton) {
        buyButton.addEventListener('click', () => {
            addProductToCart(); // Adiciona o produto ao carrinho
            window.location.href = 'carrinho.html'; // Redireciona para a página do carrinho
        });
    }

    updateCartCount();
});