// A constante 'whatsappNumber' armazena o número de telefone para o pedido.
// Armazenar em uma variável facilita a atualização futura, evitando a necessidade de procurar o número em outros arquivos.
const whatsappNumber = "5591984579361";

// O array 'products' é o nosso "banco de dados" de produtos.
// Cada objeto dentro do array representa um único item da loja, com todas as suas informações.
const products = [
    {
        // 'id': Identificador único do produto. Deve ser uma string sem espaços. É usado na URL e para encontrar o produto no código.
        id: 'amendoas',
        // 'name': O nome completo do produto que será exibido na página.
        name: 'Cookie de Amêndoas',
        // 'price': O preço do produto, incluindo o símbolo de moeda.
        price: 'R$ 15,00',
        // 'description': Uma breve descrição para convencer o cliente a comprar!
        description: 'Um cookie levemente crocante com amêndoas laminadas, perfeito para acompanhar um café.',
        // 'mainImage': O caminho para a imagem principal do produto.
        mainImage: 'imagens/amendoas.jpg',
        // 'thumbnailImages': Um array de caminhos para as miniaturas de fotos do produto.
        // O cliente poderá clicar nelas para ver a imagem maior.
        thumbnailImages: [
            'imagens/amendoas_mini01.jpg',
            'imagens/amendoas_mini02.jpg',
            'imagens/amendoas_mini03.jpg'
        ]
    },
    {
        id: 'red-velvet',
        name: 'Cookie Red Velvet',
        price: 'R$ 14,00',
        description: 'Um cookie macio e aveludado de Red Velvet com gotas de chocolate branco.',
        mainImage: 'imagens/red_velvet.jpg',
        thumbnailImages: [
            'imagens/red_velvet.jpg',
            'imagens/red_velvet_mini01.jpg',
            'imagens/red_velvet_mini02.jpg'
        ]
    },
    {
        id: 'gotas-chocolate',
        name: 'Cookie de Gotas de Chocolate',
        price: 'R$ 12,00',
        description: 'O clássico irresistível com massa de baunilha e generosas gotas de chocolate meio amargo.',
        mainImage: 'imagens/gotas_de_chocolate.jpg',
        thumbnailImages: [
            'imagens/gotas_de_chocolate_mini01.jpg',
            'imagens/gotas_de_chocolate_mini02.jpg',
            'imagens/gotas_de_chocolate_mini03.jpg'
        ]
    },
    {
        id: 'pistache',
        name: 'Cookie de Pistache',
        price: 'R$ 20,00',
        description: 'Um cookie sofisticado, com um recheio cremoso e pedaços de pistache, para uma experiência única.',
        mainImage: 'imagens/pistache.jpg',
        thumbnailImages: [
            'imagens/pistache_mini01.jpg',
            'imagens/pistache_mini02.jpg',
            'imagens/pistache_mini03.jpg'
        ]
    },
    {
        id: 'chocolate-branco',
        name: 'Cookie de Chocolate Branco',
        price: 'R$ 15,00',
        description: 'Uma explosão de sabor com chocolate branco, massa crocante por fora e macia por dentro.',
        mainImage: 'imagens/chocolate_branco.jpg',
        thumbnailImages: [
            'imagens/chocolate_branco_mini01.jpg',
            'imagens/chocolate_branco_mini02.jpg',
            'imagens/chocolate_branco_mini03.jpg'
        ]
    }
    // Adicione os outros produtos aqui seguindo a mesma estrutura
];