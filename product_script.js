document.addEventListener('DOMContentLoaded', () => {
    // A função updateCartCount() está em shared.js
    updateCartCount();

    // -------------------------------------------------------------
    // Lógica para a PÁGINA INICIAL (index.html)
    // -------------------------------------------------------------
    const cardsContainer = document.getElementById('cards-container');

if (cardsContainer) {
    products.forEach(product => {
        const card = document.createElement('a');
        card.href = `${product.id}.html`;
        card.classList.add('card');

        const img = document.createElement('img');
        img.src = product.mainImage;
        img.alt = product.name;
        
        const h3 = document.createElement('h3');
        h3.textContent = product.name;

        const price = document.createElement('p');
        price.classList.add('price');
        price.textContent = product.price;

        card.appendChild(img);
        card.appendChild(h3);
        card.appendChild(price);
        cardsContainer.appendChild(card);
    });
}

    // -------------------------------------------------------------
    // Lógica para as PÁGINAS DE PRODUTO (ex: red-velvet.html)
    // -------------------------------------------------------------
    const productPage = document.querySelector('.product-page');
    if (productPage) {
        // Encontra o ID do produto a partir da URL
        const urlPath = window.location.pathname;
        const productId = urlPath.substring(urlPath.lastIndexOf('/') + 1).replace('.html', '');

        const product = products.find(p => p.id === productId);

        if (product) {
            // Atualiza os detalhes principais do produto
            document.querySelector('.product-name').textContent = product.name;
            document.querySelector('.product-price').textContent = product.price;
            document.querySelector('.product-description p').textContent = product.description;
            
            // Atualiza a imagem principal
            const mainImage = document.getElementById('main-image');
            mainImage.src = product.mainImage;
            mainImage.alt = product.name;
            
            // Atualiza as miniaturas
            const thumbnailContainer = document.querySelector('.thumbnail-images');
            thumbnailContainer.innerHTML = ''; // Limpa as miniaturas existentes
            product.thumbnailImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Miniatura do ${product.name}`;
                thumbnailContainer.appendChild(img);
            });
            
            // Adiciona a funcionalidade de troca de imagens
            const thumbnails = thumbnailContainer.querySelectorAll('img');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImage.src = thumb.src;
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });

            // Lógica para os botões de quantidade
            const minusButton = document.querySelector('.quantity-button.minus');
            const plusButton = document.querySelector('.quantity-button.plus');
            const quantitySpan = document.getElementById('quantity');

            minusButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                if (currentQuantity > 1) {
                    quantitySpan.textContent = currentQuantity - 1;
                }
            });

            plusButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQuantity + 1;
            });


            // Adiciona a funcionalidade de adicionar ao carrinho e notificação.
            const addToCartBtn = document.querySelector('.btn-add-to-cart');
            const buyNowBtn = document.querySelector('.btn-buy');
            
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantitySpan.textContent);
                addToCart(product, quantity);
                showNotification(`Adicionado ao carrinho: ${quantity}x ${product.name}`);
            });
            
            buyNowBtn.addEventListener('click', () => {
                const quantity = parseInt(quantitySpan.textContent);
                addToCart(product, quantity);
                // Aqui você pode adicionar a lógica para redirecionar para a página de checkout, por exemplo
                showNotification(`Comprando: ${quantity}x ${product.name}`);
                setTimeout(() => {
                    window.location.href = 'carrinho.html';
                }, 1500); 
            });
        }
    }

    // -------------------------------------------------------------
    //                 Funções de suporte 
    // -------------------------------------------------------------
    function addToCart(product, quantity) {
        const cart = loadCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: quantity, 
                image: product.mainImage 
            });
        }

        saveCart(cart);
        updateCartCount();
    }

    function showNotification(message) {
        const notification = document.getElementById('cart-notification');
        const notificationMessage = document.getElementById('notification-message');
        notificationMessage.textContent = message;
        
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});