// Função para salvar o carrinho no armazenamento local (localStorage) do navegador.
// Isso permite que o carrinho persista mesmo se o usuário fechar a página.
// 'JSON.stringify' converte o array JavaScript 'cart' em uma string, que é o formato exigido pelo localStorage.
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho do armazenamento local.
// 'localStorage.getItem' busca a string do carrinho.
// 'JSON.parse' a converte de volta para um array JavaScript.
// O '|| []' é um "fallback" que garante que a função sempre retorne um array vazio se o carrinho estiver vazio ou não existir, evitando erros.
function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Função para atualizar o número de itens no ícone do carrinho no cabeçalho.
function updateCartCount() {
    const cart = loadCart();
    const cartCountElement = document.querySelector('.cart-count');
    let totalQuantity = 0;
    
    // Itera sobre cada item do carrinho e soma suas quantidades.
    cart.forEach(item => {
        totalQuantity += item.quantity;
    });
    
    // Se o elemento do contador existe (evita erros), atualiza seu texto com o total.
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;
    }
}

// Função para detectar se o usuário está acessando o site de um dispositivo móvel.
// A expressão regular '/Mobi|Android/i' busca por padrões comuns em navegadores de celular na string do 'userAgent'.
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}