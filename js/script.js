/* ==========================================================================
   DELIVERY DO FRANGO | Funcionamento da página
   Você NÃO precisa editar este arquivo no dia a dia.
   Nome, WhatsApp, Instagram, horários, preços, textos e imagens ficam em:
   js/config.js
   ========================================================================== */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var CFG = window.CONFIG;

  /* ------------------------------------------------------------------------
     0) Se o config.js tiver erro de digitação, avisa na tela
     ------------------------------------------------------------------------ */
  if (!CFG || typeof CFG !== "object") {
    var aviso = document.createElement("div");
    aviso.className = "config-erro";
    aviso.setAttribute("role", "alert");
    aviso.textContent =
      "Atenção: o arquivo js/config.js tem um erro de digitação (confira aspas e vírgulas). " +
      "Aperte F12 e veja a aba Console para descobrir a linha.";
    document.body.appendChild(aviso);
    raiz.classList.add("is-ready");
    return;
  }

  /* ------------------------------------------------------------------------
     1) UTILIDADES
     ------------------------------------------------------------------------ */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function pegar(obj, caminho) {
    return caminho.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }
  function escapar(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // *texto* vira destaque dourado
  function destacar(texto) { return escapar(texto).replace(/\*(.+?)\*/g, "<em>$1</em>"); }
  function semAsteriscos(texto) { return String(texto).replace(/\*/g, ""); }

  var formatoMoeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function temPreco(p) { return typeof p === "number" && isFinite(p) && p > 0; }
  function dinheiro(valor) { return formatoMoeda.format(valor); }

  var reduzirMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     2) DADOS DO CONFIG
     ------------------------------------------------------------------------ */
  var LOJA = CFG.loja || {};
  var CONTATO = CFG.contato || {};
  var FUNC = CFG.funcionamento || {};
  var PEDIDO = CFG.pedido || {};
  var TEXTOS = CFG.textos || {};
  var IMAGENS = CFG.imagens || {};
  var HORARIOS = Array.isArray(FUNC.horarios) ? FUNC.horarios : [];
  var ITENS = (Array.isArray(CFG.cardapio) ? CFG.cardapio : []).filter(function (i) { return i && i.id && i.nome; });

  var nomeLoja = String(LOJA.nome || "").trim() || "Frango Assado";
  var numeroWhats = String(CONTATO.whatsapp || "").replace(/\D/g, "");
  var usuarioInsta = String(CONTATO.instagram || "")
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");

  function linkWhatsApp(mensagem) {
    var texto = mensagem ? "?text=" + encodeURIComponent(mensagem) : "";
    return "https://wa.me/" + numeroWhats + texto;
  }
  var linkInstagram = usuarioInsta ? "https://www.instagram.com/" + usuarioInsta + "/" : "https://www.instagram.com/";

  function telefoneBonito(numero) {
    var d = String(numero || "").replace(/\D/g, "");
    var local = d.length > 11 && d.indexOf("55") === 0 ? d.slice(2) : d;
    if (local.length === 11) return "(" + local.slice(0, 2) + ") " + local.slice(2, 7) + "-" + local.slice(7);
    if (local.length === 10) return "(" + local.slice(0, 2) + ") " + local.slice(2, 6) + "-" + local.slice(6);
    return d ? "+" + d : "";
  }

  // Lembretes para quem está configurando (aparecem só no console, F12)
  if (!numeroWhats || /^550+$/.test(numeroWhats)) console.warn("[Config] Troque o número do WhatsApp em js/config.js");
  if (!usuarioInsta || usuarioInsta === "seu.perfil.aqui") console.warn("[Config] Troque o Instagram em js/config.js");

  /* ------------------------------------------------------------------------
     3) IMAGENS (tamanhos automáticos para Unsplash e Pexels)
     ------------------------------------------------------------------------ */
  function urlImagem(url, largura, proporcao) {
    if (!url) return "";
    var base = String(url).split("?")[0];
    var altura = proporcao ? Math.round(largura * proporcao) : 0;
    if (/images\.unsplash\.com/.test(base)) {
      return base + "?auto=format&fit=crop&w=" + largura + (altura ? "&h=" + altura : "") + "&q=72";
    }
    if (/images\.pexels\.com/.test(base)) {
      // fotos .png do Pexels são pesadas: pede em JPG
      var formato = /\.png$/i.test(base) ? "&fm=jpg" : "";
      return base + "?auto=compress&cs=tinysrgb&w=" + largura + (altura ? "&h=" + altura + "&fit=crop" : "") + formato;
    }
    return url; // arquivo da pasta images/ ou outro site
  }

  function aplicarImagem(img, url, opcoes) {
    if (!img || !url) return;
    opcoes = opcoes || {};
    var larguras = opcoes.larguras || [480, 800, 1200];
    var proporcao = opcoes.proporcao || 0;
    var ehBanco = /images\.(unsplash|pexels)\.com/.test(url);

    img.addEventListener("error", function aoFalhar() {
      img.removeEventListener("error", aoFalhar);
      img.removeAttribute("srcset");
      img.src = "images/sem-foto.svg";
    });

    if (ehBanco) {
      img.sizes = opcoes.sizes || "100vw";
      img.srcset = larguras.map(function (w) { return urlImagem(url, w, proporcao) + " " + w + "w"; }).join(", ");
      img.src = urlImagem(url, larguras[Math.min(1, larguras.length - 1)], proporcao);
    } else {
      img.removeAttribute("srcset");
      img.src = url;
    }
    if (opcoes.foco) img.style.objectPosition = opcoes.foco;
  }

  $$("[data-img]").forEach(function (img) {
    var url = IMAGENS[img.getAttribute("data-img")];
    var larguras = (img.getAttribute("data-widths") || "").split(",").map(Number).filter(Boolean);
    aplicarImagem(img, url, {
      larguras: larguras.length ? larguras : undefined,
      proporcao: parseFloat(img.getAttribute("data-ratio")) || 0,
      sizes: img.getAttribute("data-sizes") || "100vw",
    });
  });

  /* ------------------------------------------------------------------------
     4) TEXTOS E LINKS
     ------------------------------------------------------------------------ */
  $$("[data-config]").forEach(function (el) {
    var v = pegar(CFG, el.getAttribute("data-config"));
    if (typeof v === "string" && v.trim()) el.textContent = semAsteriscos(v);
  });
  $$("[data-config-html]").forEach(function (el) {
    var v = pegar(CFG, el.getAttribute("data-config-html"));
    if (typeof v === "string" && v.trim()) el.innerHTML = destacar(v);
  });
  $$("[data-config-upper]").forEach(function (el) {
    var v = pegar(CFG, el.getAttribute("data-config-upper"));
    if (typeof v === "string" && v.trim()) el.textContent = v.toLocaleUpperCase("pt-BR");
  });
  $$("[data-config-lower]").forEach(function (el) {
    var v = pegar(CFG, el.getAttribute("data-config-lower"));
    if (typeof v === "string" && v.trim()) el.textContent = v.toLocaleLowerCase("pt-BR");
  });

  // Nome da loja com a última palavra em destaque
  function nomeComDestaque(nome) {
    var partes = nome.split(/\s+/);
    if (partes.length < 2) return escapar(nome);
    var ultima = partes.pop();
    return escapar(partes.join(" ")) + " <span>" + escapar(ultima) + "</span>";
  }
  $$("[data-brand]").forEach(function (el) { el.innerHTML = nomeComDestaque(nomeLoja); });
  document.title = document.title.replace("Delivery do Frango", nomeLoja);

  var mensagemPadrao = CONTATO.mensagemWhatsapp || "";
  $$('[data-link="whatsapp"]').forEach(function (a) {
    a.href = linkWhatsApp(a.getAttribute("data-msg") || mensagemPadrao);
  });
  $$('[data-link="instagram"]').forEach(function (a) { a.href = linkInstagram; });
  $$("[data-whatsapp-exibicao]").forEach(function (el) { el.textContent = telefoneBonito(numeroWhats); });
  $$("[data-instagram-exibicao]").forEach(function (el) { el.textContent = usuarioInsta ? "@" + usuarioInsta : "Instagram"; });

  // Endereço (opcional)
  var endereco = String(CONTATO.endereco || "").trim();
  if (endereco) {
    $$("[data-endereco]").forEach(function (el) {
      el.hidden = false;
      var alvo = $("[data-endereco-texto]", el);
      if (!alvo) return;
      alvo.innerHTML = CONTATO.linkMapa
        ? '<a href="' + escapar(CONTATO.linkMapa) + '" target="_blank" rel="noopener">' + escapar(endereco) + "</a>"
        : escapar(endereco);
    });
  }

  // Lista de diferenciais do destaque
  var icones = ["fire", "heart-fill", "stars", "award", "hand-thumbs-up", "star-fill"];
  var listaDestaque = $("[data-destaque-itens]");
  if (listaDestaque && Array.isArray(TEXTOS.destaqueItens)) {
    listaDestaque.innerHTML = TEXTOS.destaqueItens.map(function (t, i) {
      return '<li><span class="icone-item"><svg class="icon" aria-hidden="true"><use href="#i-' +
        icones[i % icones.length] + '"></use></svg></span>' + escapar(t) + "</li>";
    }).join("");
  }

  $$("[data-ano]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ------------------------------------------------------------------------
     5) HORÁRIOS E STATUS "ABERTO AGORA"
     ------------------------------------------------------------------------ */
  var NOMES_DIAS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  function hora(hhmm) {
    var p = String(hhmm || "").split(":");
    var h = parseInt(p[0], 10) || 0;
    var m = parseInt(p[1], 10) || 0;
    return m ? h + "h" + String(m).padStart(2, "0") : h + "h";
  }
  function minutos(hhmm) {
    var p = String(hhmm || "").split(":");
    return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
  }
  function faixaHorario(h) { return hora(h.abre) + " às " + hora(h.fecha); }

  var mesmoHorario = HORARIOS.length > 0 && HORARIOS.every(function (h) {
    return h.abre === HORARIOS[0].abre && h.fecha === HORARIOS[0].fecha;
  });
  var resumoHorario = mesmoHorario
    ? (FUNC.dias || "Aberto") + ", das " + faixaHorario(HORARIOS[0])
    : HORARIOS.map(function (h) { return h.dia + ": " + faixaHorario(h); }).join(", ");

  $$("[data-horario-resumo]").forEach(function (el) { el.textContent = resumoHorario; });
  $$("[data-horario-lista]").forEach(function (el) {
    el.innerHTML = HORARIOS.map(function (h) { return escapar(h.dia) + ": " + faixaHorario(h); }).join("<br>");
  });

  var caixaHorarios = $("[data-horarios]");
  if (caixaHorarios) {
    caixaHorarios.innerHTML = HORARIOS.map(function (h) {
      return '<article class="horario-card">' +
        '<span class="horario-card__icone" aria-hidden="true"><svg class="icon"><use href="#i-calendar-check"></use></svg></span>' +
        '<div><p class="horario-card__dia">' + escapar(h.dia) + "</p>" +
        '<p class="horario-card__hora">' + faixaHorario(h) + "</p></div></article>";
    }).join("");
  }

  function agora() {
    try {
      var partes = new Intl.DateTimeFormat("en-US", {
        timeZone: FUNC.fusoHorario || "America/Sao_Paulo",
        weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
      }).formatToParts(new Date());
      var valor = function (tipo) { return (partes.find(function (p) { return p.type === tipo; }) || {}).value; };
      var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(valor("weekday"));
      var h = parseInt(valor("hour"), 10) % 24;
      return { dia: dia, min: h * 60 + parseInt(valor("minute"), 10) };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function calcularStatus() {
    if (!HORARIOS.length) return null;
    var n = agora();
    var hoje = HORARIOS.filter(function (h) { return Number(h.diaSemana) === n.dia; })[0];
    if (hoje) {
      if (n.min >= minutos(hoje.abre) && n.min < minutos(hoje.fecha)) {
        return { aberto: true, texto: "Aberto agora, até as " + hora(hoje.fecha) };
      }
      if (n.min < minutos(hoje.abre)) {
        return { aberto: false, texto: "Fechado agora. Abrimos hoje às " + hora(hoje.abre) };
      }
    }
    for (var i = 1; i <= 7; i++) {
      var d = (n.dia + i) % 7;
      var prox = HORARIOS.filter(function (h) { return Number(h.diaSemana) === d; })[0];
      if (prox) {
        var quando = i === 1 ? "amanhã" : String(prox.dia).toLocaleLowerCase("pt-BR");
        return { aberto: false, texto: "Fechado agora. Abrimos " + quando + " às " + hora(prox.abre) };
      }
    }
    return null;
  }

  function atualizarStatus() {
    var st = calcularStatus();
    var diaHoje = agora().dia;
    $$("[data-status]").forEach(function (el) {
      if (!st) { el.hidden = true; return; }
      el.hidden = false;
      el.classList.toggle("is-open", st.aberto);
      el.classList.toggle("is-closed", !st.aberto);
      var alvo = $("[data-status-texto]", el);
      if (alvo) alvo.textContent = st.texto;
    });
    $$("[data-semana] li").forEach(function (li) {
      var d = Number(li.getAttribute("data-dia"));
      var h = HORARIOS.filter(function (x) { return Number(x.diaSemana) === d; })[0];
      li.classList.toggle("is-open", !!h);
      li.classList.toggle("is-today", d === diaHoje);
      var estado = $("[data-estado]", li);
      if (estado) estado.textContent = (h ? ", aberto das " + faixaHorario(h) : ", fechado") + (d === diaHoje ? " (hoje)" : "");
    });
  }
  atualizarStatus();
  setInterval(atualizarStatus, 60 * 1000);

  /* ------------------------------------------------------------------------
     6) CARDÁPIO
     ------------------------------------------------------------------------ */
  var grade = $("[data-menu-grid]");
  var carrinho = {}; // { id: quantidade }

  function acharItem(id) { return ITENS.filter(function (i) { return i.id === id; })[0]; }
  function icone(nome) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + nome + '"></use></svg>'; }

  function opcao(sim, nome) {
    return '<li class="opt ' + (sim ? "opt--sim" : "opt--nao") + '">' +
      icone(sim ? "check-lg" : "x-lg") + (sim ? "Com " : "Sem ") + nome + "</li>";
  }

  function acaoHtml(item) {
    var qtd = carrinho[item.id] || 0;
    var nome = escapar(item.nome);
    var id = escapar(item.id);
    if (!qtd) {
      return '<button type="button" class="btn-add" data-add="' + id + '" aria-label="Adicionar ' + nome + ' ao pedido">' +
        icone("plus-lg") + "Adicionar</button>";
    }
    return '<div class="stepper" role="group" aria-label="Quantidade de ' + nome + '">' +
      '<button type="button" data-menos="' + id + '" aria-label="Diminuir quantidade">' + icone(qtd === 1 ? "trash3" : "dash-lg") + "</button>" +
      '<span class="stepper__qtd" aria-live="polite">' + qtd + "</span>" +
      '<button type="button" data-mais="' + id + '" aria-label="Aumentar quantidade">' + icone("plus-lg") + "</button></div>";
  }

  function cardHtml(item, i) {
    var comPreco = temPreco(item.preco);
    var meio = item.tamanho === "meio";
    return '<li class="card" style="--i:' + i + '" data-id="' + escapar(item.id) + '" data-tamanho="' + (meio ? "meio" : "inteiro") +
      '" data-recheio="' + (item.recheio ? 1 : 0) + '" data-batata="' + (item.batata ? 1 : 0) + '">' +
      '<article class="card__inner">' +
        '<div class="card__media">' +
          '<img data-card-img alt="Foto ilustrativa: ' + escapar(item.nome) + '" width="400" height="300" loading="lazy" decoding="async">' +
          '<span class="card__tag">' + (meio ? "Meio frango" : "Inteiro") + "</span>" +
          (item.selo ? '<span class="card__selo">' + escapar(item.selo) + "</span>" : "") +
          '<span class="card__check">' + icone("check-lg") + "No pedido</span>" +
        "</div>" +
        '<div class="card__body">' +
          '<h3 class="card__title">' + escapar(item.nome) + "</h3>" +
          (item.descricao ? '<p class="card__desc">' + escapar(item.descricao) + "</p>" : "") +
          '<ul class="card__opts">' + opcao(item.recheio, "recheio") + opcao(item.batata, "batatas") + "</ul>" +
          '<div class="card__foot">' +
            '<p class="price' + (comPreco ? "" : " price--consulte") + '"><span class="price__label">Preço</span>' +
            '<span class="price__value">' + (comPreco ? dinheiro(item.preco) : "Consulte") + "</span></p>" +
            '<div class="card__acao" data-acao>' + acaoHtml(item) + "</div>" +
          "</div>" +
        "</div>" +
      "</article></li>";
  }

  if (grade) {
    grade.innerHTML = ITENS.map(cardHtml).join("");
    $$(".card", grade).forEach(function (card) {
      var item = acharItem(card.getAttribute("data-id"));
      aplicarImagem($("[data-card-img]", card), item.imagem, {
        larguras: [360, 540, 720, 960],
        proporcao: 0.75,
        sizes: "(max-width: 559px) 130px, (max-width: 1023px) 46vw, 290px",
        foco: item.foco,
      });
    });
    grade.classList.add("reveal");
  }

  // Filtros "monte o seu frango"
  var formFiltros = $("[data-filtros]");
  var textoResultado = $("[data-resultado]");
  var caixaVazio = $("[data-menu-vazio]");

  function valorFiltro(nome) {
    var marcado = formFiltros && formFiltros.querySelector('input[name="' + nome + '"]:checked');
    return marcado ? marcado.value : "todos";
  }

  function filtrar(animar) {
    if (!grade) return;
    var t = valorFiltro("tamanho"), r = valorFiltro("recheio"), b = valorFiltro("batata");
    var visiveis = 0;
    $$(".card", grade).forEach(function (card) {
      var ok = (t === "todos" || card.getAttribute("data-tamanho") === t) &&
               (r === "todos" || card.getAttribute("data-recheio") === r) &&
               (b === "todos" || card.getAttribute("data-batata") === b);
      if (ok) {
        if (card.hidden && animar) {
          card.classList.remove("entrando");
          void card.offsetWidth;
          card.classList.add("entrando");
        }
        card.hidden = false;
        visiveis++;
      } else {
        card.hidden = true;
      }
    });

    var filtrando = t !== "todos" || r !== "todos" || b !== "todos";
    if (textoResultado) {
      if (!filtrando) textoResultado.innerHTML = "Mostrando todas as <strong>" + visiveis + " opções</strong>";
      else if (visiveis === 1) textoResultado.innerHTML = "<strong>Perfeito!</strong> Esta é a sua combinação:";
      else if (visiveis > 1) textoResultado.innerHTML = "<strong>" + visiveis + " opções</strong> para a sua escolha";
      else textoResultado.textContent = "Nenhuma opção encontrada";
    }
    $$(".filtros__resumo [data-limpar]").forEach(function (btn) { btn.hidden = !filtrando; });
    if (caixaVazio) caixaVazio.hidden = visiveis > 0;
  }

  if (formFiltros) {
    formFiltros.addEventListener("change", function () { filtrar(true); });
  }
  $$("[data-limpar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      $$('input[value="todos"]', formFiltros || document).forEach(function (r) { r.checked = true; });
      filtrar(true);
    });
  });
  filtrar(false);

  /* ------------------------------------------------------------------------
     7) PEDIDO (carrinho)
     ------------------------------------------------------------------------ */
  var barra = $("[data-order-bar]");
  var gaveta = $("[data-drawer]");
  var painel = gaveta ? $(".drawer__panel", gaveta) : null;
  var listaCarrinho = $("[data-cart-list]");
  var botaoCarrinhoTopo = $(".header__cart");
  var formCheckout = $("[data-checkout]");
  if (barra) barra.hidden = false;

  function idsNoPedido() { return Object.keys(carrinho).filter(function (id) { return carrinho[id] > 0; }); }
  function totalItens() { return idsNoPedido().reduce(function (s, id) { return s + carrinho[id]; }, 0); }
  function totalValor() {
    var completo = true, valor = 0;
    idsNoPedido().forEach(function (id) {
      var item = acharItem(id);
      if (temPreco(item.preco)) valor += item.preco * carrinho[id];
      else completo = false;
    });
    return { valor: valor, completo: completo };
  }

  function atualizarCard(id) {
    var card = grade && grade.querySelector('.card[data-id="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]');
    if (!card) return;
    var item = acharItem(id);
    $("[data-acao]", card).innerHTML = acaoHtml(item);
    card.classList.toggle("no-pedido", !!carrinho[id]);
  }

  function pular(el) {
    if (!el || reduzirMovimento) return;
    el.classList.remove("pulou");
    void el.offsetWidth;
    el.classList.add("pulou");
  }

  function atualizarResumo() {
    var qtd = totalItens();
    var t = totalValor();
    var textoQtd = qtd + (qtd === 1 ? " item" : " itens");
    var textoValor = t.completo ? "total " + dinheiro(t.valor) : "valor a confirmar";

    $$("[data-cart-count]").forEach(function (el) { el.textContent = qtd; });
    $$("[data-cart-resumo]").forEach(function (el) { el.textContent = textoQtd + ", " + textoValor; });
    $$("[data-cart-total]").forEach(function (el) {
      el.textContent = t.completo ? dinheiro(t.valor) : "A confirmar";
      el.classList.toggle("a-confirmar", !t.completo);
    });
    var obs = $("[data-obs-total]");
    if (obs) {
      obs.textContent = t.completo
        ? (PEDIDO.observacaoTotal || "")
        : "Alguns preços são confirmados pelo WhatsApp. " + (PEDIDO.observacaoTotal || "");
    }

    if (barra) barra.classList.toggle("is-visible", qtd > 0);
    document.body.classList.toggle("tem-pedido", qtd > 0);
    if (botaoCarrinhoTopo) botaoCarrinhoTopo.hidden = qtd === 0;
    if (gaveta) gaveta.classList.toggle("is-empty", qtd === 0);
  }

  function renderCarrinho() {
    if (!listaCarrinho) return;
    listaCarrinho.innerHTML = idsNoPedido().map(function (id) {
      var item = acharItem(id);
      var qtd = carrinho[id];
      var comPreco = temPreco(item.preco);
      return '<li class="cart-item">' +
        '<img src="' + escapar(urlImagem(item.imagem, 160, 1)) + '" alt="" width="58" height="58" loading="lazy">' +
        '<div><p class="cart-item__nome">' + escapar(item.nome) + "</p>" +
        '<p class="cart-item__preco">' + (comPreco ? dinheiro(item.preco) + " cada" : "Preço a consultar") + "</p></div>" +
        '<div class="cart-item__linha">' + acaoHtml(item) +
        '<span class="cart-item__sub">' + (comPreco ? dinheiro(item.preco * qtd) : "") + "</span></div></li>";
    }).join("");
  }

  function alterar(id, delta) {
    var item = acharItem(id);
    if (!item) return;
    var antes = carrinho[id] || 0;
    var nova = Math.max(0, Math.min(99, antes + delta));
    if (nova) carrinho[id] = nova; else delete carrinho[id];

    atualizarCard(id);
    atualizarResumo();
    if (gaveta && !gaveta.hidden) renderCarrinho();
    if (delta > 0) { pular(barra); pular(botaoCarrinhoTopo); }
    if (antes === 0 && nova === 1) avisar("Adicionado: " + item.nome);
    return nova;
  }

  // Cliques em Adicionar, + e -
  document.addEventListener("click", function (e) {
    var alvo = e.target.closest("[data-add], [data-mais], [data-menos]");
    if (!alvo) return;
    var id = alvo.getAttribute("data-add") || alvo.getAttribute("data-mais") || alvo.getAttribute("data-menos");
    var dentroDaGaveta = !!alvo.closest("[data-drawer]");
    var nova = alterar(id, alvo.hasAttribute("data-menos") ? -1 : 1);

    // mantém o foco do teclado no lugar certo depois de redesenhar
    var escopo = dentroDaGaveta ? listaCarrinho : grade && grade.querySelector('.card[data-id="' + id + '"]');
    if (!escopo) return;
    var foco = nova ? escopo.querySelector('[data-mais="' + id + '"]') : escopo.querySelector('[data-add="' + id + '"]');
    if (dentroDaGaveta && !nova) foco = painel;
    if (foco) foco.focus({ preventScroll: true });
  });

  /* Painel do pedido ------------------------------------------------------ */
  var ultimoFoco = null;

  function abrirPedido() {
    if (!gaveta) return;
    renderCarrinho();
    atualizarResumo();
    ultimoFoco = document.activeElement;
    gaveta.hidden = false;
    void gaveta.offsetWidth;
    gaveta.classList.add("is-open");
    document.body.classList.add("no-scroll", "pedido-aberto");
    setTimeout(function () { if (painel) painel.focus(); }, 60);
  }

  function fecharPedido(voltarFoco) {
    if (!gaveta || gaveta.hidden) return;
    gaveta.classList.remove("is-open");
    document.body.classList.remove("no-scroll", "pedido-aberto");
    setTimeout(function () { gaveta.hidden = true; }, 420);
    if (voltarFoco !== false && ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }

  $$("[data-open-drawer]").forEach(function (b) { b.addEventListener("click", abrirPedido); });
  $$("[data-close-drawer]").forEach(function (b) {
    b.addEventListener("click", function () {
      fecharPedido(!b.hasAttribute("data-ir-cardapio"));
      if (b.hasAttribute("data-ir-cardapio")) {
        var alvo = document.getElementById("cardapio");
        if (alvo) alvo.scrollIntoView({ behavior: reduzirMovimento ? "auto" : "smooth" });
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!gaveta || gaveta.hidden) return;
    if (e.key === "Escape") { fecharPedido(); return; }
    if (e.key !== "Tab") return;
    // mantém o Tab dentro do painel
    var focaveis = $$('button:not([disabled]), [href], input:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])', painel)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focaveis.length) return;
    var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === painel)) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  });

  /* Entrega ou retirada --------------------------------------------------- */
  var podeEntrega = PEDIDO.entrega !== false;
  var podeRetirada = PEDIDO.retirada !== false;
  var grupoRecebimento = $("[data-recebimento]");
  var campoEndereco = $("[data-campo-endereco]");
  var erroEndereco = $("[data-erro-endereco]");

  if (grupoRecebimento) {
    var opEntrega = $("[data-opcao-entrega]", grupoRecebimento);
    var opRetirada = $("[data-opcao-retirada]", grupoRecebimento);
    if (!podeEntrega && opEntrega) opEntrega.remove();
    if (!podeRetirada && opRetirada) opRetirada.remove();
    var restantes = $$("input[name=recebimento]", grupoRecebimento);
    if (!restantes.length) grupoRecebimento.hidden = true;
    if (restantes.length === 1) {
      restantes[0].checked = true;
      $(".segmented", grupoRecebimento).classList.add("so-uma");
    }
  }

  function recebimentoEscolhido() {
    var marcado = formCheckout && formCheckout.querySelector("input[name=recebimento]:checked");
    return marcado ? marcado.value : "";
  }
  var dicaRetirada = $("[data-dica-retirada]");
  if (dicaRetirada && endereco) $("[data-endereco-retirada]", dicaRetirada).textContent = endereco;
  function mostrarEndereco() {
    var escolha = recebimentoEscolhido();
    if (campoEndereco) campoEndereco.hidden = escolha !== "entrega";
    if (dicaRetirada) dicaRetirada.hidden = !(endereco && escolha === "retirada");
  }
  if (formCheckout) {
    formCheckout.addEventListener("change", function (e) {
      mostrarEndereco();
      if (e.target.name === "recebimento" && grupoRecebimento) grupoRecebimento.classList.remove("com-erro");
    });
    formCheckout.addEventListener("submit", function (e) { e.preventDefault(); enviarPedido(); });
    formCheckout.addEventListener("input", function (e) {
      if (e.target.name === "endereco" && e.target.value.trim()) {
        e.target.classList.remove("is-invalid");
        if (erroEndereco) erroEndereco.hidden = true;
      }
    });
  }
  mostrarEndereco();

  /* Enviar pelo WhatsApp -------------------------------------------------- */
  function montarMensagem(dados) {
    var linhas = ["Olá, " + nomeLoja + "! Quero fazer um pedido pelo site:", ""];
    idsNoPedido().forEach(function (id) {
      var item = acharItem(id);
      var qtd = carrinho[id];
      var valor = temPreco(item.preco) ? " (" + dinheiro(item.preco * qtd) + ")" : "";
      linhas.push("- " + qtd + "x " + item.nome + valor);
    });
    var t = totalValor();
    linhas.push("");
    linhas.push("*Total:* " + (t.completo ? dinheiro(t.valor) : "a confirmar"));
    if (dados.recebimento) linhas.push("*Recebimento:* " + (dados.recebimento === "entrega" ? "Entrega" : "Retirada no local"));
    if (dados.recebimento === "entrega" && dados.endereco) linhas.push("*Endereço:* " + dados.endereco);
    if (dados.nome) linhas.push("*Nome:* " + dados.nome);
    if (dados.obs) linhas.push("*Observações:* " + dados.obs);
    return linhas.join("\n");
  }

  function enviarPedido() {
    if (!totalItens()) return;
    var campo = function (nome) {
      var el = formCheckout && formCheckout.elements[nome];
      return el ? String(el.value || "").trim() : "";
    };
    var dados = { recebimento: recebimentoEscolhido(), nome: campo("nome"), endereco: campo("endereco"), obs: campo("obs") };

    // validações simples
    var temOpcoes = grupoRecebimento && !grupoRecebimento.hidden;
    if (temOpcoes && !dados.recebimento) {
      grupoRecebimento.classList.add("com-erro");
      avisar("Escolha: retirar no local ou entrega", true);
      var primeiraOpcao = grupoRecebimento.querySelector("input");
      if (primeiraOpcao) primeiraOpcao.focus();
      return;
    }
    var entradaEndereco = formCheckout && formCheckout.elements.endereco;
    if (dados.recebimento === "entrega" && !dados.endereco) {
      if (erroEndereco) erroEndereco.hidden = false;
      if (entradaEndereco) { entradaEndereco.classList.add("is-invalid"); entradaEndereco.focus(); }
      return;
    }
    if (erroEndereco) erroEndereco.hidden = true;
    if (entradaEndereco) entradaEndereco.classList.remove("is-invalid");

    window.open(linkWhatsApp(montarMensagem(dados)), "_blank", "noopener");
    avisar("Abrindo o WhatsApp com o seu pedido");
  }

  var botaoLimpar = $("[data-limpar-pedido]");
  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function () {
      idsNoPedido().forEach(function (id) { delete carrinho[id]; atualizarCard(id); });
      atualizarResumo();
      renderCarrinho();
      if (painel) painel.focus();
    });
  }
  atualizarResumo();

  /* ------------------------------------------------------------------------
     8) AVISOS RÁPIDOS (toast)
     ------------------------------------------------------------------------ */
  var caixaAviso = $("[data-toast]");
  var timerAviso;
  function avisar(mensagem, erro) {
    if (!caixaAviso) return;
    caixaAviso.classList.toggle("is-erro", !!erro);
    caixaAviso.innerHTML = icone(erro ? "x-lg" : "check-lg") + "<span>" + escapar(mensagem) + "</span>";
    caixaAviso.classList.add("is-visible");
    clearTimeout(timerAviso);
    timerAviso = setTimeout(function () { caixaAviso.classList.remove("is-visible"); }, 2600);
  }

  /* ------------------------------------------------------------------------
     9) CABEÇALHO E MENU
     ------------------------------------------------------------------------ */
  var cabecalho = $("[data-header]");
  function aoRolar() { if (cabecalho) cabecalho.classList.toggle("is-scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  var botaoMenu = $("[data-nav-toggle]");
  var menu = $("[data-nav]");
  var rotuloMenu = $("[data-nav-toggle-label]");
  function definirMenu(aberto) {
    if (!botaoMenu || !menu) return;
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    menu.classList.toggle("is-open", aberto);
    if (cabecalho) cabecalho.classList.toggle("menu-aberto", aberto);
    document.body.classList.toggle("no-scroll", aberto);
    if (rotuloMenu) rotuloMenu.textContent = aberto ? "Fechar menu" : "Abrir menu";
  }
  if (botaoMenu && menu) {
    botaoMenu.addEventListener("click", function () { definirMenu(botaoMenu.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) definirMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && botaoMenu.getAttribute("aria-expanded") === "true") { definirMenu(false); botaoMenu.focus(); }
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 960) definirMenu(false); });
  }

  // Destaca no menu a seção visível
  var linksMenu = $$(".nav__link");
  if ("IntersectionObserver" in window && linksMenu.length) {
    var observadorSecoes = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        linksMenu.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["inicio", "cardapio", "destaque", "funcionamento", "contato"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) observadorSecoes.observe(s);
    });
  }

  /* ------------------------------------------------------------------------
     10) ANIMAÇÕES
     ------------------------------------------------------------------------ */
  // Revelar elementos ao rolar
  var revelar = $$(".reveal");
  if ("IntersectionObserver" in window && !reduzirMovimento) {
    var observadorRevelar = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          observadorRevelar.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revelar.forEach(function (el) { observadorRevelar.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Brasas subindo na primeira tela
  var brasas = $("[data-embers]");
  if (brasas && !reduzirMovimento) {
    var quantidade = window.innerWidth < 600 ? 10 : 18;
    for (var i = 0; i < quantidade; i++) {
      var s = document.createElement("span");
      s.style.setProperty("--x", (Math.random() * 100).toFixed(1) + "%");
      s.style.setProperty("--s", (2 + Math.random() * 4).toFixed(1) + "px");
      s.style.setProperty("--d", (7 + Math.random() * 8).toFixed(1) + "s");
      s.style.setProperty("--delay", (-Math.random() * 14).toFixed(1) + "s");
      s.style.setProperty("--dx", ((Math.random() - 0.5) * 140).toFixed(0) + "px");
      brasas.appendChild(s);
    }
  }

  // Faixa animada: repete o conteúdo para o loop ficar contínuo
  var faixa = $("[data-faixa]");
  if (faixa) {
    var base = faixa.innerHTML;
    faixa.innerHTML = base + base + base + base;
  }

  // No celular, o botão flutuante aparece quando os botões do topo saem da tela
  // (assim ele não fica em cima do botão "Ver Cardápio")
  var flutuante = $(".whats-float");
  var acoesHero = $(".hero__actions");
  if (flutuante && acoesHero && "IntersectionObserver" in window) {
    var telaPequena = window.matchMedia("(max-width: 959px)");
    var acoesVisiveis = telaPequena.matches;
    var aplicarFlutuante = function () {
      flutuante.classList.toggle("escondido", telaPequena.matches && acoesVisiveis);
    };
    aplicarFlutuante();
    new IntersectionObserver(function (entradas) {
      acoesVisiveis = entradas[0].isIntersecting;
      aplicarFlutuante();
    }).observe(acoesHero);
    if (telaPequena.addEventListener) telaPequena.addEventListener("change", aplicarFlutuante);
  }

  // Convite do botão flutuante (só no computador)
  if (flutuante && window.matchMedia("(hover: hover)").matches && !reduzirMovimento) {
    setTimeout(function () {
      flutuante.classList.add("convite");
      setTimeout(function () { flutuante.classList.remove("convite"); }, 4500);
    }, 3500);
  }

  /* ------------------------------------------------------------------------
     11) DADOS ESTRUTURADOS (ajuda o Google a entender a loja)
     ------------------------------------------------------------------------ */
  try {
    var diasSchema = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dadosLoja = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: nomeLoja,
      servesCuisine: ["Frango assado", "Comida brasileira"],
      url: location.href.split("#")[0],
      image: urlImagem(IMAGENS.topo, 1200, 0.75),
      telephone: numeroWhats ? "+" + numeroWhats : undefined,
      sameAs: usuarioInsta ? [linkInstagram] : undefined,
      address: endereco ? { "@type": "PostalAddress", streetAddress: endereco, addressCountry: "BR" } : undefined,
      openingHoursSpecification: HORARIOS.map(function (h) {
        return { "@type": "OpeningHoursSpecification", dayOfWeek: diasSchema[Number(h.diaSemana)], opens: h.abre, closes: h.fecha };
      }),
    };
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify(dadosLoja);
    document.head.appendChild(ld);
  } catch (e) { /* sem problemas se falhar */ }

  /* Pronto: mostra a primeira tela ---------------------------------------- */
  raiz.classList.add("is-ready");
})();
