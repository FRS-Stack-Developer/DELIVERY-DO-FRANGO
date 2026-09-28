/* ==========================================================================
   CONFIGURAÇÕES DA LOJA
   --------------------------------------------------------------------------
   Este é o ÚNICO arquivo que você precisa editar no dia a dia.
   Aqui ficam: nome da loja, WhatsApp, Instagram, horários, preços,
   textos e imagens.

   Dicas rápidas:
   - Mantenha as aspas "..." em volta dos textos.
   - Não apague as vírgulas no fim das linhas.
   - Depois de salvar, atualize a página no navegador (F5) para ver.
   ========================================================================== */

window.CONFIG = {

  /* ------------------------------------------------------------------------
     1) LOJA
     ------------------------------------------------------------------------ */
  loja: {
    nome: "Delivery do Frango",
    // Frase curta usada no rodapé e no topo do cardápio
    slogan: "Frango assado de verdade, só aos fins de semana.",
  },

  /* ------------------------------------------------------------------------
     2) CONTATO E REDES SOCIAIS
     ------------------------------------------------------------------------ */
  contato: {
    // WhatsApp: 55 (Brasil) + DDD + número. SÓ NÚMEROS, sem espaço ou traço.
    // Exemplo: (31) 98765-4321  vira  "5531987654321"
    whatsapp: "5531000000000",

    // Mensagem que já aparece escrita quando o cliente clica nos botões
    mensagemWhatsapp: "Olá! Vim pelo site e gostaria de fazer um pedido.",

    // Instagram: só o nome do perfil, sem o @ e sem o link.
    // Exemplo: para instagram.com/frangodofulano, escreva "frangodofulano"
    instagram: "seu.perfil.aqui",

    // Endereço (opcional). Se deixar vazio "", ele não aparece no site.
    endereco: "Rua Rio das Velhas, 1310, Santa Luzia",
    // Link do Google Maps (opcional). Se vazio, o endereço aparece sem link.
    linkMapa: "https://www.google.com/maps/search/?api=1&query=Rua%20Rio%20das%20Velhas%2C%201310%2C%20Santa%20Luzia%2C%20MG",
  },

  /* ------------------------------------------------------------------------
     3) FUNCIONAMENTO
     diaSemana: 0 = domingo, 1 = segunda ... 6 = sábado
     Horários no formato 24h "HH:MM".
     ------------------------------------------------------------------------ */
  funcionamento: {
    dias: "Sábados e domingos",
    horarios: [
      { dia: "Sábado",  diaSemana: 6, abre: "10:00", fecha: "14:00" },
      { dia: "Domingo", diaSemana: 0, abre: "10:00", fecha: "14:00" },
    ],
    // Fuso horário usado para mostrar "Aberto agora" / "Fechado agora"
    fusoHorario: "America/Sao_Paulo",
    // Recado que aparece na seção de horários
    aviso: "Faça seu pedido com antecedência pelo WhatsApp e garanta o seu frango quentinho.",
  },

  /* ------------------------------------------------------------------------
     4) PEDIDOS
     O cliente monta o pedido no site e a mensagem chega pronta no WhatsApp.
     Deixe true (sim) ou false (não) para cada forma de receber.
     ------------------------------------------------------------------------ */
  pedido: {
    entrega: true,    // o cliente pode pedir para entregar em casa
    retirada: true,   // o cliente pode buscar no local
    // Frase exibida abaixo do total (deixe "" para esconder)
    observacaoTotal: "Taxa de entrega, se houver, é combinada pelo WhatsApp.",
  },

  /* ------------------------------------------------------------------------
     5) TEXTOS PRINCIPAIS
     Coloque uma parte do texto entre *asteriscos* para destacá-la em dourado.
     ------------------------------------------------------------------------ */
  textos: {
    heroTitulo: "O sabor que deixa seu fim de semana *muito mais gostoso!*",
    heroSubtitulo: "Frango assado douradinho, crocante por fora e suculento por dentro, com batatas assadas no ponto. Do forno direto para a sua mesa.",

    cardapioTitulo: "Nosso Cardápio",
    cardapioSubtitulo: "Frango inteiro ou meio frango, com ou sem recheio, com ou sem batatas. Escolha do jeito que a sua família gosta.",

    destaqueTitulo: "Frango assado, douradinho por fora, suculento por dentro e *cheio de sabor!*",
    destaqueTexto: "Temperado com carinho e assado sem pressa até a pele ficar dourada e crocante. Com batatas assadas do lado, é o almoço de fim de semana que a família inteira espera.",
    destaqueItens: [
      "Pele dourada e crocante",
      "Carne suculenta e macia",
      "Tempero caseiro da casa",
      "Batatas assadas no ponto",
    ],

    contatoTitulo: "Bateu a fome? *Chama a gente!*",
    contatoTexto: "Pedidos e informações pelo WhatsApp. Novidades, fotos e promoções do fim de semana no Instagram.",
  },

  /* ------------------------------------------------------------------------
     6) IMAGENS
     Pode usar um link da internet (https://...) ou um arquivo da pasta
     images/ (exemplo: "images/minha-foto.jpg").
     Fotos atuais: bancos gratuitos Unsplash e Pexels (créditos no README).
     O ideal é trocar por fotos reais dos seus frangos!
     ------------------------------------------------------------------------ */
  imagens: {
    topo:          "https://images.unsplash.com/photo-1615557960916-5f4791effe9d",
    destaque:      "https://images.unsplash.com/photo-1630564510761-a560db92a09b",
    destaqueExtra: "https://images.pexels.com/photos/29640883/pexels-photo-29640883.jpeg",
    funcionamento: "https://images.pexels.com/photos/13458086/pexels-photo-13458086.jpeg",
  },

  /* ------------------------------------------------------------------------
     7) CARDÁPIO
     preco: use número com PONTO, sem R$. Exemplo: 59.90
            Deixe null enquanto não tiver o preço (aparece "Consulte").
     tamanho: "inteiro" ou "meio"
     recheio / batata: true (com) ou false (sem)
     selo: etiqueta opcional na foto (ou "" para nenhuma)
     foco: opcional, ajusta o enquadramento da foto (ex.: "50% 30%")
     ------------------------------------------------------------------------ */
  cardapio: [
    {
      id: "inteiro-recheio-batata",
      nome: "Frango inteiro com recheio + batatas",
      descricao: "Frango inteiro recheado, assado até dourar, com batatas assadas no ponto. O almoço da família resolvido.",
      tamanho: "inteiro", recheio: true, batata: true,
      preco: null,
      imagem: "https://images.pexels.com/photos/10821324/pexels-photo-10821324.jpeg",
      selo: "Mais completo",
    },
    {
      id: "inteiro-recheio",
      nome: "Frango inteiro com recheio sem batatas",
      descricao: "Frango inteiro com o recheio da casa, douradinho por fora e suculento por dentro.",
      tamanho: "inteiro", recheio: true, batata: false,
      preco: null,
      imagem: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6",
      selo: "",
    },
    {
      id: "inteiro-batata",
      nome: "Frango inteiro sem recheio + batatas",
      descricao: "Frango inteiro no tempero da casa, pele crocante e batatas assadas douradinhas.",
      tamanho: "inteiro", recheio: false, batata: true,
      preco: null,
      imagem: "https://images.pexels.com/photos/5956831/pexels-photo-5956831.jpeg",
      selo: "",
      foco: "62% 58%",
    },
    {
      id: "inteiro",
      nome: "Frango inteiro sem recheio e sem batatas",
      descricao: "O clássico da casa: frango inteiro assado, pele crocante e carne suculenta.",
      tamanho: "inteiro", recheio: false, batata: false,
      preco: null,
      imagem: "https://images.unsplash.com/photo-1606728035253-49e8a23146de",
      selo: "Clássico",
    },
    {
      id: "meio-recheio-batata",
      nome: "Meio frango com recheio + batatas",
      descricao: "Meio frango com recheio e batatas assadas. Porção caprichada para 1 ou 2 pessoas.",
      tamanho: "meio", recheio: true, batata: true,
      preco: null,
      imagem: "https://images.pexels.com/photos/4589138/pexels-photo-4589138.jpeg",
      selo: "",
    },
    {
      id: "meio-recheio",
      nome: "Meio frango com recheio sem batatas",
      descricao: "Meio frango recheado: todo o sabor do inteiro em uma porção menor.",
      tamanho: "meio", recheio: true, batata: false,
      preco: null,
      imagem: "https://images.pexels.com/photos/27643014/pexels-photo-27643014.jpeg",
      selo: "",
    },
    {
      id: "meio-batata",
      nome: "Meio frango sem recheio + batatas",
      descricao: "Meio frango assado com batatas douradinhas. Prático, gostoso e na medida certa.",
      tamanho: "meio", recheio: false, batata: true,
      preco: null,
      imagem: "https://images.unsplash.com/photo-1742455259385-654d727825f1",
      selo: "",
    },
    {
      id: "meio",
      nome: "Meio frango sem recheio e sem batatas",
      descricao: "Meio frango assado no ponto, simples e cheio de sabor.",
      tamanho: "meio", recheio: false, batata: false,
      preco: null,
      imagem: "https://images.pexels.com/photos/8408989/pexels-photo-8408989.jpeg",
      selo: "",
      foco: "30% 50%",
    },
  ],
};
