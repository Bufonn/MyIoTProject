const API = process.env.EXPO_PUBLIC_API_URL;

/**
 * Salva um registro de histórico no json-server.
 * @param {'temp'|'umid'|'luz'} tipo - tipo do dado
 * @param {number|string} valor - valor recebido do broker
 */

export async function salvarHistorico(tipo, valor) {
  try {
    const registro = {
      tipo,
      valor,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${API}/historico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('[appCrud] Erro ao salvar histórico:', error.message);
    return null;
  }
}

/**
 * Busca todos os registros do histórico, do mais recente ao mais antigo.
 * @param {number} limite - máximo de registros (padrão 100)
 */

export async function buscarHistorico(limite = 100) {
  try {
    const response = await fetch(
      `${API}/historico?_sort=timestamp&_order=desc&_limit=${limite}`
    );

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('[appCrud] Erro ao buscar histórico:', error.message);
    return [];
  }
}

/**
 * Deleta todo o histórico — percorre e remove item a item
 * (json-server não suporta DELETE em massa nativamente).
 */

export async function limparHistorico() {
  try {
    const registros = await buscarHistorico(1000);
    await Promise.all(
      registros.map((r) =>
        fetch(`${API}/historico/${r.id}`, { method: 'DELETE' })
      )
    );
    return true;
  } catch (error) {
    console.warn('[appCrud] Erro ao limpar histórico:', error.message);
    return false;
  }
}
