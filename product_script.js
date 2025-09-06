// O evento 'DOMContentLoaded' garante que o script só vai rodar depois que todo o HTML da página estiver carregado.
document.addEventListener('DOMContentLoaded', () => {
    // A função 'updateCartCount()' está em 'shared.js' e é chamada aqui para garantir que o número de itens no ícone do carrinho esteja sempre correto.
    updateCartCount();

    // -------------------------------------------------------------
    // Lógica para a PÁGINA INICIAL (index.html)
    // -------------------------------------------------------------
    // Encontra o container onde os cartões de produtos serão inseridos.
    const cardsContainer = document.getElementById('cards-container');

    // Verifica se estamos na página inicial (se o 'cardsContainer' existe).
    if (cardsContainer) {
        // Itera sobre o array 'products' do seu arquivo 'data.js'.
        products.forEach(product => {
            // Cria um link (<a>) que servirá como o cartão do produto.
            const card = document.createElement('a');
            // O link leva para a página 'produto.html', passando o 'id' do produto na URL.
            card.href = `produto.html?id=${product.id}`;
            card.classList.add('card'); // Adiciona a classe CSS para estilização.

            // Cria e configura a imagem do produto.
            const img = document.createElement('img');
            img.src = product.mainImage;
            img.alt = product.name;
            
            // Cria o título do produto.
            const h3 = document.createElement('h3');
            h3.textContent = product.name;

            // Cria o parágrafo com o preço.
            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = product.price;

            // Adiciona a imagem, o título e o preço dentro do cartão.
            card.appendChild(img);
            card.appendChild(h3);
            card.appendChild(price);
            
            // Adiciona o cartão completo ao container de cartões.
            cardsContainer.appendChild(card);
        });
    }

    // -------------------------------------------------------------
    // Lógica para as PÁGINAS DE PRODUTO INDIVIDUAL (ex: produto.html)
    // -------------------------------------------------------------
    // Encontra o container da página de produto.
    const productPage = document.querySelector('.product-page');
    // Verifica se estamos em uma página de produto.
    if (productPage) {
        // Pega o ID do produto a partir da URL (ex: 'id=red-velvet').
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        // Usa o ID para encontrar o produto correspondente no array 'products'.
        const product = products.find(p => p.id === productId);

        if (product) {
            // Se o produto for encontrado, atualiza os elementos HTML da página.
            document.querySelector('.product-name').textContent = product.name;
            document.querySelector('.product-price').textContent = product.price;
            document.querySelector('.product-description p').textContent = product.description;
            
            // Atualiza a imagem principal.
            const mainImage = document.getElementById('main-image');
            mainImage.src = product.mainImage;
            mainImage.alt = product.name;
            
            // Atualiza a galeria de miniaturas.
            const thumbnailContainer = document.querySelector('.thumbnail-images');
            thumbnailContainer.innerHTML = ''; // Limpa as miniaturas antigas.
            product.thumbnailImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Miniatura do ${product.name}`;
                thumbnailContainer.appendChild(img);
            });
            
            // Adiciona um evento de clique para as miniaturas, trocando a imagem principal.
            const thumbnails = thumbnailContainer.querySelectorAll('img');
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    mainImage.src = thumb.src;
                    // Remove a classe 'active' de todas as miniaturas e a adiciona à clicada para destacar.
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });

            // Lógica para os botões de quantidade (+ e -).
            const minusButton = document.querySelector('.quantity-button.minus');
            const plusButton = document.querySelector('.quantity-button.plus');
            const quantitySpan = document.getElementById('quantity');

            // Evento para o botão de diminuir a quantidade.
            minusButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                // Diminui apenas se a quantidade for maior que 1.
                if (currentQuantity > 1) {
                    quantitySpan.textContent = currentQuantity - 1;
                }
            });

            // Evento para o botão de aumentar a quantidade.
            plusButton.addEventListener('click', () => {
                let currentQuantity = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQuantity + 1;
            });

            // Adiciona a funcionalidade de adicionar ao carrinho e notificação.
            const addToCartBtn = document.querySelector('.btn-add-to-cart');
            const buyNowBtn = document.querySelector('.btn-buy');
            
            // Evento para o botão "Adicionar ao carrinho".
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantitySpan.textContent);
                addToCart(product, quantity); // Adiciona o item ao carrinho.
                showNotification(`Adicionado ao carrinho: ${quantity}x ${product.name}`);
            });
            
            // Evento para o botão "Comprar agora".
            buyNowBtn.addEventListener('click', () => {
                const quantity = parseInt(quantitySpan.textContent);
                addToCart(product, quantity);
                showNotification(`Redirecionando para o carrinho...`);
                
                // Redireciona para a página do carrinho após um pequeno atraso.
                setTimeout(() => {
                    window.location.href = 'carrinho.html';
                }, 1500); 
            });
        }
    }

    // -------------------------------------------------------------
    // Funções de suporte usadas nas duas lógicas acima.
    // -------------------------------------------------------------
    // Adiciona um item ao carrinho, verificando se ele já existe.
    function addToCart(product, quantity) {
        const cart = loadCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            // Adiciona um novo item com as informações necessárias.
            cart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: quantity, 
                image: product.mainImage 
            });
        }

        saveCart(cart); // Salva o carrinho atualizado.
        updateCartCount(); // Atualiza o contador de itens no cabeçalho.
    }

    // Exibe uma notificação pop-up para o usuário.
    function showNotification(message) {
        const notification = document.getElementById('cart-notification');
        const notificationMessage = document.getElementById('notification-message');
        notificationMessage.textContent = message;
        
        notification.classList.add('show');
        // Remove a notificação após 3 segundos.
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});