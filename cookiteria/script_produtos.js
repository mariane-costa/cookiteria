// Lógica 01: Miniaturas Clicáveis
// Espera o documento ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona a imagem principal
    const mainImage = document.querySelector('.main-image img');
    // Seleciona todas as miniaturas
    const thumbnails = document.querySelectorAll('.thumbnail-images img');

    // Itera sobre cada miniatura
    thumbnails.forEach(thumbnail => {
        // Adiciona um evento de 'clique' em cada miniatura
        thumbnail.addEventListener('click', () => {
            // Remove a classe 'active' de todas as miniaturas
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Adiciona a classe 'active' na miniatura clicada
            thumbnail.classList.add('active');
            
            // Troca o atributo 'src' da imagem principal pelo 'src' da miniatura clicada
            mainImage.src = thumbnail.src;
            // Troca o atributo 'alt' da imagem principal pelo 'alt' da miniatura clicada
            mainImage.alt = thumbnail.alt;
        });
    });
});

// Lógica 02: Seletor de Quantidade
// Espera o documento ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os botões de diminuir e aumentar quantidade
    const minusButton = document.querySelector('.quantity-button.minus');
    const plusButton = document.querySelector('.quantity-button.plus');
    // Seleciona o elemento que mostra a quantidade
    const quantitySpan = document.querySelector('.quantity');

    let quantity = 1; // Inicia a quantidade em 1

    // Adiciona evento de clique para o botão de diminuir
    minusButton.addEventListener('click', () => {
        // Garante que a quantidade não seja menor que 1
        if (quantity > 1) {
            quantity--; // Diminui a quantidade
            quantitySpan.textContent = quantity; // Atualiza o texto na tela
        }
    });

    // Adiciona evento de clique para o botão de aumentar
    plusButton.addEventListener('click', () => {
        quantity++; // Aumenta a quantidade
        quantitySpan.textContent = quantity; // Atualiza o texto na tela
    });
});

// Lógica 03: Botões de Ação
// Espera o documento ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os botões de ação
    const addToCartButton = document.querySelector('.btn-add-to-cart');
    const buyButton = document.querySelector('.btn-buy');

    // URL base do WhatsApp
    const whatsappBaseURL = 'https://wa.me/5591984579361';

    // Adiciona evento de clique para o botão 'Adicionar ao Carrinho'
    addToCartButton.addEventListener('click', () => {
        // Simplesmente mostra um alerta por enquanto
        alert('Produto adicionado ao carrinho! (Lógica a ser implementada futuramente)');
    });

    // Adiciona evento de clique para o botão 'Comprar'
    buyButton.addEventListener('click', () => {
        const productName = document.querySelector('.product-name').textContent;
        const productPrice = document.querySelector('.product-price').textContent;
        const quantity = document.querySelector('.quantity').textContent;
        
        // Mensagem de pré-preenchimento para o WhatsApp
        const message = `Olá, Mariane! Gostaria de comprar o seguinte produto:%0AProduto: ${productName}%0APreço: ${productPrice}%0AQuantidade: ${quantity}%0A%0APor favor, me informe sobre as formas de pagamento e entrega.`;

        // Monta a URL completa do WhatsApp
        const whatsappURL = `${whatsappBaseURL}?text=${message}`;

        // Redireciona para o WhatsApp
        window.open(whatsappURL, '_blank');
    });
});