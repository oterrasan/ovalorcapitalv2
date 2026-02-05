module.exports = async (req, res) => {
  try {
    const sourceUrl = "https://impostometro.com.br/widget/contador/?wmode=transparent";
    const r = await fetch(sourceUrl, {
      headers: { "user-agent": "OVC/1.0 (+https://www.ovalorcapital.com.br)" }
    });

    if (!r.ok) {
      res.status(502).json({ ok: false, error: "fetch_failed" });
      return;
    }

    const html = await r.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const tokens = (text.match(/[A-Za-zÀ-ÿ]+|\d+/g) || []).map(t => t.trim());
    const lower = tokens.map(t => t.toLowerCase());

    function findPos(words) {
      for (let i = 0; i < lower.length; i++) {
        if (words.includes(lower[i])) return i;
      }
      return -1;
    }

    const units = [
      { key: "tri", words: ["tri", "trilhao", "trilhões", "trilhoes"], mult: 1e12 },
      { key: "bil", words: ["bilhao", "bilhões", "bilhoes"], mult: 1e9 },
      { key: "mil", words: ["milhao", "milhões", "milhoes"], mult: 1e6 },
      { key: "th", words: ["mil"], mult: 1e3 },
      { key: "reais", words: ["real", "reais"], mult: 1 },
      { key: "cent", words: ["centavo", "centavos"], mult: 0.01 },
    ];

    // capture digits between unit markers (digits are often split)
    const positions = units.map(u => ({ ...u, pos: findPos(u.words) }))
                           .filter(u => u.pos >= 0)
                           .sort((a,b) => a.pos - b.pos);

    function digitsBetween(aPos, bPos) {
      const dig = [];
      for (let i = aPos + 1; i < (bPos >= 0 ? bPos : lower.length); i++) {
        if (/^\d+$/.test(tokens[i])) dig.push(tokens[i]);
      }
      return dig.join("");
    }

    let total = 0;
    for (let i = 0; i < positions.length; i++) {
      const cur = positions[i];
      const next = positions[i + 1];
      const d = digitsBetween(cur.pos, next ? next.pos : -1);
      if (!d) continue;
      const n = parseInt(d, 10);
      if (!Number.isFinite(n)) continue;

      if (cur.key === "cent") {
        total += n / 100;
      } else {
        total += n * cur.mult;
      }
    }

    // Fallback: if parsing failed, return ok=false
    if (!Number.isFinite(total) || total <= 0) {
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      res.status(200).json({ ok: false, sourceUrl });
      return;
    }

    const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total);

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json({ ok: true, value: total, formatted, sourceUrl, updatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: "internal_error" });
  }
}
