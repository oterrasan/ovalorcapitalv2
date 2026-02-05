const CATEGORIES = [
  { slug: "economia", label: "Economia", subs: ["politica-economica","pib-crescimento","inflacao-juros","cambio","fiscal-tributacao","imposto-renda","itcmd","planejamento-tributario"] },
  { slug: "mercados", label: "Mercados", subs: ["bolsa","indices","moedas","commodities","cripto"] },
  { slug: "investimentos", label: "Investimentos", subs: ["renda-fixa","renda-variavel","fundos","exterior","previdencia-investimentos","sucessao-investimentos"] },
  { slug: "seguros", label: "Seguros", subs: ["vida","renda-dit","rc-profissional","patrimonial","empresarial"] },
  { slug: "saude", label: "Saúde", subs: ["planos-saude","mercado-saude","financas-medicas"] },
  { slug: "previdencia", label: "Previdência", subs: ["previdencia-privada","inss","pgbl-vgbl","aposentadoria"] },
  { slug: "credito", label: "Crédito", subs: ["credito-pessoal","credito-empresarial","consignado","imobiliario"] },
  { slug: "empresas", label: "Empresas", subs: ["resultados","fusoes-aquisicoes","setores","governanca"] },
  { slug: "imoveis", label: "Imóveis", subs: ["mercado-imobiliario","financiamento","fundos-imobiliarios"] },
  { slug: "carreira", label: "Carreira", subs: ["mercado-trabalho","desenvolvimento","lideranca"] },
  { slug: "aprenda", label: "Aprenda", subs: ["guias","glossario","videos","cursos"] },
  { slug: "mpes", label: "MPEs", subs: ["gestao","tributacao","credito"] },
  { slug: "ferramentas", label: "Ferramentas", subs: ["calculadoras","simuladores","tabelas","agenda","ao-vivo"] },
  { slug: "politica", label: "Política", subs: ["brasilia","congresso","executivo","judiciario","geopolitica"] },
  { slug: "negocios", label: "Negócios", subs: ["empreendedorismo","varejo","energia","agronegocio","gestao"] },
  { slug: "tecnologia", label: "Tecnologia", subs: ["inteligencia-artificial","ciberseguranca","startups","big-tech","inovacao"] },
  { slug: "regulacao", label: "Regulação", subs: ["bacen","cvm","susep","congresso","regras-mercado"] },
  { slug: "tributos", label: "Tributos", subs: ["reforma-tributaria","irpf","icms-iss","itcmd","planejamento"] },
  { slug: "industria", label: "Indústria", subs: ["infraestrutura","construcao","manufatura","logistica","defesa"] },
  { slug: "familia", label: "Família", subs: ["educacao-financeira","patrimonio","sucessao","protecoes","planejamento"] },
  { slug: "esportes", label: "Esportes", subs: ["economia-do-esporte","marketing-esportivo","gestao-clubes","ligas-eventos","carreira-atletas"] },
  { slug: "parcerias", label: "Parcerias", subs: ["anuncie","afiliados","eventos","institucional","contato"] },
  { slug: "vc", label: "VC", subs: ["quem-somos","missao","metodologia","governanca","contato"] },
];

const LS_KEY = "OVC_ADMIN_ARTICLES_V1";

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function nowISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function loadDB() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (_) { return []; }
}
function saveDB(db) { localStorage.setItem(LS_KEY, JSON.stringify(db)); }

function buildArticleHTML(a) {
  const title = a.title || "Artigo";
  const excerpt = a.excerpt || "";
  const content = a.content || "";
  const date = a.date || "";
  const cat = a.category || "";
  const sub = a.subcategory || "";
  const back = `/${cat}/`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title} - O Valor Capital</title>
  <meta name="description" content="${excerpt.replace(/"/g, "&quot;")}" />
  <style>
    :root{--bg:#0b0f14;--card:#0f172a;--border:rgba(148,163,184,.18);--text:#e5e7eb;--muted:#94a3b8;--accent:#0b3b60}
    *{box-sizing:border-box}
    body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
    a{color:inherit;text-decoration:none}
    .container{max-width:860px;margin:0 auto;padding:18px}
    header{border-bottom:1px solid var(--border);background:linear-gradient(180deg, rgba(11,59,96,.35), transparent)}
    .meta{color:var(--muted);font-size:13px;margin-top:8px}
    .card{background:rgba(15,23,42,.75);border:1px solid var(--border);border-radius:14px;padding:18px;margin-top:16px}
    h1{margin:10px 0 8px;font-size:30px;line-height:1.15}
    p{line-height:1.65}
    hr{border:0;border-top:1px solid var(--border);margin:18px 0}
    .back{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);padding:8px 12px;border-radius:999px;color:var(--muted);background:rgba(15,23,42,.65)}
  </style>
</head>
<body>
<header>
  <div class="container">
    <a class="back" href="${back}">← Voltar para ${cat}</a>
    <div class="meta">${date} • ${cat}${sub ? " / " + sub : ""}</div>
    <h1>${title}</h1>
    ${excerpt ? `<div class="meta">${excerpt}</div>` : ""}
  </div>
</header>
<main class="container">
  <article class="card">
    ${content}
  </article>
  <hr/>
  <div class="meta">O Valor Capital • Conteúdo gerado via Admin (estático)</div>
</main>
</body>
</html>`;
}

function downloadFile(name, text, type="application/json") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function render() {
  const db = loadDB();
  const list = document.getElementById("list");
  const status = document.getElementById("status");
  status.innerHTML = `Itens no banco: <b>${db.length}</b> • Armazenamento: <span class="muted">localStorage</span>`;
  list.innerHTML = "";

  db.slice().reverse().forEach((a, idx) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="t">${a.title}</div>
      <div class="m">${a.date} • /artigos/${a.slug}/ • ${a.category}${a.subcategory ? " / " + a.subcategory : ""}</div>
      <div class="actions">
        <button class="btn" data-act="download" data-i="${idx}">Baixar HTML</button>
        <button class="btn" data-act="del" data-i="${idx}">Excluir</button>
      </div>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const act = btn.getAttribute("data-act");
      const i = Number(btn.getAttribute("data-i"));
      const current = loadDB().slice().reverse(); // UI order
      const a = current[i];
      if (!a) return;

      if (act === "download") {
        const html = buildArticleHTML(a);
        downloadFile(`artigo_${a.slug}.html`, html, "text/html;charset=utf-8");
      }
      if (act === "del") {
        const real = loadDB();
        const pos = real.findIndex(x => x.slug === a.slug);
        if (pos >= 0) {
          real.splice(pos, 1);
          saveDB(real);
          render();
        }
      }
    });
  });
}

function fillCategories() {
  const cat = document.getElementById("category");
  const sub = document.getElementById("subcategory");
  cat.innerHTML = "";
  CATEGORIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.slug;
    opt.textContent = c.label;
    cat.appendChild(opt);
  });

  function fillSubs() {
    const selected = CATEGORIES.find(c => c.slug === cat.value) || CATEGORIES[0];
    sub.innerHTML = "";
    selected.subs.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = s;
      sub.appendChild(opt);
    });
  }
  cat.addEventListener("change", fillSubs);
  fillSubs();
}

function boot() {
  document.getElementById("date").value = nowISODate();
  fillCategories();

  const titleEl = document.getElementById("title");
  const slugEl = document.getElementById("slug");

  titleEl.addEventListener("input", () => {
    if (!slugEl.value.trim()) slugEl.value = slugify(titleEl.value);
  });

  document.getElementById("btnAdd").addEventListener("click", () => {
    const a = {
      title: titleEl.value.trim(),
      slug: slugify(slugEl.value),
      date: document.getElementById("date").value,
      category: document.getElementById("category").value,
      subcategory: document.getElementById("subcategory").value,
      excerpt: document.getElementById("excerpt").value.trim(),
      content: document.getElementById("content").value.trim()
    };

    if (!a.title || !a.slug) return alert("Título e slug são obrigatórios.");

    const db = loadDB();
    if (db.some(x => x.slug === a.slug)) return alert("Slug já existe no banco local.");
    db.push(a);
    saveDB(db);
    render();
  });

  document.getElementById("btnDownloadHtml").addEventListener("click", () => {
    const a = {
      title: titleEl.value.trim(),
      slug: slugify(slugEl.value),
      date: document.getElementById("date").value,
      category: document.getElementById("category").value,
      subcategory: document.getElementById("subcategory").value,
      excerpt: document.getElementById("excerpt").value.trim(),
      content: document.getElementById("content").value.trim()
    };
    if (!a.title || !a.slug) return alert("Título e slug são obrigatórios.");
    const html = buildArticleHTML(a);
    downloadFile(`artigo_${a.slug}.html`, html, "text/html;charset=utf-8");
  });

  document.getElementById("btnExport").addEventListener("click", () => {
    const db = loadDB();
    // Output format ready to commit in /data/articles.json
    const out = db.slice().sort((a,b)=> (b.date||"").localeCompare(a.date||""));
    downloadFile("articles.json", JSON.stringify(out, null, 2));
  });

  document.getElementById("btnClear").addEventListener("click", () => {
    document.getElementById("title").value = "";
    document.getElementById("slug").value = "";
    document.getElementById("excerpt").value = "";
    document.getElementById("content").value = "";
    document.getElementById("date").value = nowISODate();
  });

  render();
}

document.addEventListener("DOMContentLoaded", boot);
