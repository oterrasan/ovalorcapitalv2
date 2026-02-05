async function fetchPtaxForDate(code, d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const dateStr = `${mm}-${dd}-${yyyy}`;

  const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${encodeURIComponent(code)}'&@dataCotacao='${dateStr}'&$orderby=dataHoraCotacao%20desc&$top=1&$format=json`;
  const r = await fetch(url, { headers: { "user-agent": "OVC/1.0 (+https://www.ovalorcapital.com.br)" } });
  if (!r.ok) return null;
  const j = await r.json();
  const row = j && j.value && j.value[0];
  if (!row) return null;
  return {
    buy: Number(row.cotacaoCompra),
    sell: Number(row.cotacaoVenda),
    date: row.dataHoraCotacao || null,
  };
}

async function getLatestPtax(code) {
  const now = new Date();
  // BCB PTAX might not publish on weekends/holidays; try up to 10 days back.
  for (let back = 0; back <= 10; back++) {
    const d = new Date(now);
    d.setDate(now.getDate() - back);
    const data = await fetchPtaxForDate(code, d);
    if (data && Number.isFinite(data.sell)) return data;
  }
  return null;
}

module.exports = async (req, res) => {
  try {
    const codesParam = (req.query.codes || "USD,EUR").toString();
    const codes = codesParam.split(",").map(s => s.trim().toUpperCase()).filter(Boolean).slice(0, 10);

    const rates = {};
    for (const code of codes) {
      const latest = await getLatestPtax(code);
      if (!latest) continue;

      // previous for pct change
      let pctChange = null;
      const now = new Date();
      for (let back = 1; back <= 15; back++) {
        const d = new Date(now);
        d.setDate(now.getDate() - back);
        const prev = await fetchPtaxForDate(code, d);
        if (prev && Number.isFinite(prev.sell)) {
          pctChange = ((latest.sell - prev.sell) / prev.sell) * 100;
          break;
        }
      }

      rates[code] = { ...latest, pctChange };
    }

    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=1800");
    res.status(200).json({ ok: true, rates, updatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, error: "internal_error" });
  }
}
