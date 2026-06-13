function parseTimestamp(ts) {
  return new Date(ts);
}

function filtrarPorPeriodo(entries, filtro) {
  if (!Array.isArray(entries)) return [];
  if (filtro === 'tudo') return entries;
  const agora = new Date();
  return entries.filter((entry) => {
    const data = parseTimestamp(entry.timestamp);
    if (filtro === 'hora') {
      return agora.getTime() - data.getTime() <= 60 * 60 * 1000;
    }
    if (filtro === 'hoje') {
      return (
        data.getDate() === agora.getDate() &&
        data.getMonth() === agora.getMonth() &&
        data.getFullYear() === agora.getFullYear()
      );
    }
    return true;
  });
}

function statsTemperatura(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { media: '—', max: '—', min: '—' };
  }
  const valores = entries
    .filter((e) => e.tipo === 'temp')
    .map((e) => Number(e.valor));
  if (valores.length === 0) return { media: '—', max: '—', min: '—' };
  const soma = valores.reduce((a, b) => a + b, 0);
  return {
    media: soma / valores.length,
    max: Math.max(...valores),
    min: Math.min(...valores),
  };
}

function statsUmidade(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { media: '—', max: '—', min: '—' };
  }
  const valores = entries
    .filter((e) => e.tipo === 'umid')
    .map((e) => Number(e.valor));
  if (valores.length === 0) return { media: '—', max: '—', min: '—' };
  const soma = valores.reduce((a, b) => a + b, 0);
  return {
    media: soma / valores.length,
    max: Math.max(...valores),
    min: Math.min(...valores),
  };
}

function contagemLampada(entries) {
  if (!Array.isArray(entries)) return 0;
  return entries.filter(
    (e) => e.tipo === 'luz' && (e.valor === '1' || e.valor === 1)
  ).length;
}

function serieTemperatura(entries) {
  if (!Array.isArray(entries)) return { labels: [], dados: [] };
  const ordenados = entries
    .filter((e) => e.tipo === 'temp')
    .sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));
  if (ordenados.length === 0) return { labels: [], dados: [] };
  const recentes = ordenados.slice(-30);
  return {
    labels: recentes.map((e) => {
      const d = parseTimestamp(e.timestamp);
      return (
        String(d.getHours()).padStart(2, '0') +
        ':' +
        String(d.getMinutes()).padStart(2, '0')
      );
    }),
    dados: recentes.map((e) => Number(e.valor)),
  };
}

function serieUmidade(entries) {
  if (!Array.isArray(entries)) return { labels: [], dados: [] };
  const ordenados = entries
    .filter((e) => e.tipo === 'umid')
    .sort((a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp));
  if (ordenados.length === 0) return { labels: [], dados: [] };
  const recentes = ordenados.slice(-30);
  return {
    labels: recentes.map((e) => {
      const d = parseTimestamp(e.timestamp);
      return (
        String(d.getHours()).padStart(2, '0') +
        ':' +
        String(d.getMinutes()).padStart(2, '0')
      );
    }),
    dados: recentes.map((e) => Number(e.valor)),
  };
}

export {
  filtrarPorPeriodo,
  statsTemperatura,
  statsUmidade,
  contagemLampada,
  serieTemperatura,
  serieUmidade,
};
