// O evento 'DOMContentLoaded' garante que o script só vai rodar depois que todo o HTML da página estiver carregado.
document.addEventListener('DOMContentLoaded', () => {
    // Chamadas iniciais para carregar a página do carrinho.
    // 'updateCartCount()' e 'renderCart()' usam as funções que estão no arquivo 'shared.js'.
    updateCartCount();
    renderCart();

    // Adiciona um "ouvinte de eventos" para todos os cliques dentro da área dos itens do carrinho.
    // Isso é chamado de "delegação de eventos" e é mais eficiente do que adicionar um ouvinte para cada botão.
    document.getElementById('cart-items').addEventListener('click', (event) => {
        const target = event.target; // 'target' é o elemento exato que foi clicado.
        
        // Verifica qual botão foi clicado usando as classes CSS.
        if (target.classList.contains('increment-quantity')) {
            // Se o botão de '+' foi clicado, pega o ID do produto do elemento pai.
            const itemId = target.closest('.cart-item').dataset.id;
            changeQuantity(itemId, 1); // Chama a função para aumentar a quantidade em 1.
        } else if (target.classList.contains('decrement-quantity')) {
            // Se o botão de '-' foi clicado.
            const itemId = target.closest('.cart-item').dataset.id;
            changeQuantity(itemId, -1); // Chama a função para diminuir a quantidade em 1.
        } else if (target.closest('.remove-item')) {
            // Se o botão de lixeira foi clicado.
            const itemId = target.closest('.cart-item').dataset.id;
            removeItem(itemId); // Chama a função para remover o item do carrinho.
        }
    });

    // Adiciona um evento para o botão de "Esvaziar Carrinho".
    document.getElementById('clear-cart-button').addEventListener('click', () => {
        clearCart(); // Chama a função que limpa o carrinho por completo.
    });

    // Adiciona um evento para o botão de "Finalizar Compra".
    // const checkoutButton = document.getElementById('checkout-button');
    // if (checkoutButton) { // Garante que o botão existe antes de tentar adicionar o evento.
    //     checkoutButton.addEventListener('click', sendWhatsAppOrder);
    // }
    
});

// A função principal que desenha todos os itens do carrinho na página HTML.
// A função principal que desenha todos os itens do carrinho na página HTML.
function renderCart() {
    const cart = loadCart(); // Carrega os dados do carrinho do localStorage.
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    let subtotal = 0;

    // Limpa o conteúdo da lista de itens para evitar duplicatas ao atualizar a tela.
    cartItemsContainer.innerHTML = '';

    // Verifica se o carrinho está vazio.
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p id="empty-cart-message" style="text-align:center;">Seu carrinho está vazio.</p>';
        cartSubtotalElement.textContent = 'Subtotal: R$ 0,00';
        // Esconde a seção de resumo se o carrinho estiver vazio
        document.getElementById('cart-summary').style.display = 'none';
    } else {
        // Mostra a seção de resumo se o carrinho tiver itens
        document.getElementById('cart-summary').style.display = 'block';

        // Itera sobre cada item no carrinho.
        cart.forEach(item => {
            // Encontra os detalhes completos do produto no seu "banco de dados" (data.js) usando o ID.
            const product = products.find(p => p.id === item.id);
            if (!product) return; // Se o produto não for encontrado, ignora e passa para o próximo.

            // Converte o preço do produto para um número e calcula o subtotal total do carrinho.
            const itemPrice = parseFloat(product.price.replace('R$', '').replace(',', '.'));
            const itemSubtotal = itemPrice * item.quantity; // **Calcula o subtotal deste item**
            subtotal += itemSubtotal;

            // Cria o elemento HTML para o item do carrinho.
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.id; // Armazena o ID do produto no HTML para fácil acesso.

            // Insere a estrutura e os dados do item.
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${product.mainImage}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="cart-item-price">Preço unit.: ${product.price}</p>
                    <p class="cart-item-subtotal">Subtotal: R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</p> </div>
                <div class="cart-item-actions">
                    <button class="quantity-button decrement-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-button increment-quantity">+</button>
                    <button class="remove-item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem); // Adiciona o item à lista.
        });

        // Atualiza o subtotal total do carrinho na tela.
        cartSubtotalElement.textContent = `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }
}

// Aumenta ou diminui a quantidade de um item no carrinho.
// Recebe o 'id' do produto e a 'change' (mudança), que pode ser +1 ou -1.
function changeQuantity(id, change) {
    const cart = loadCart();
    const item = cart.find(i => i.id === id); // Encontra o item no carrinho.

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(id); // Se a quantidade for 0 ou menos, remove o item.
        } else {
            // Salva, atualiza o contador e renderiza a tela novamente para mostrar a mudança.
            saveCart(cart);
            updateCartCount();
            renderCart();
        }
    }
}

// Remove um item do carrinho.
function removeItem(id) {
    let cart = loadCart();
    // Cria um novo array, filtrando e removendo o item com o ID correspondente.
    cart = cart.filter(item => item.id !== id);
    saveCart(cart); // Salva o novo array.
    updateCartCount();
    renderCart();
}

// Esvazia todo o carrinho.
function clearCart() {
    localStorage.removeItem('cart'); // Remove a informação do carrinho do navegador.
    updateCartCount();
    renderCart();
}

// Prepara e envia o pedido para o WhatsApp.
function sendWhatsAppOrder() {
    const cart = loadCart();
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    // Monta a mensagem do pedido, incluindo o total e os detalhes.
    let message = "Olá, gostaria de fazer um pedido!\n\n*Detalhes do pedido:*\n\n";
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            const price = parseFloat(product.price.replace('R$', '').replace(',', '.'));
            const itemTotal = price * item.quantity;
            total += itemTotal;
            message += `${item.quantity}x ${product.name} - R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        }
    });

    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += "Aguardando confirmação. Obrigado!";

    // Converte a mensagem para um formato seguro para a URL.
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "5591984579361"; // **Lembre-se de colocar seu número de telefone aqui!**

    // Cria o link do WhatsApp com a mensagem pré-preenchida.
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Abre o link em uma nova aba do navegador.
    window.open(whatsappUrl, '_blank');
}