export function formatCurrency(value?: number | string) {
  const num = typeof value === "string" ? Number(value) : value;
  if (num === undefined || Number.isNaN(num)) return "—";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(value?: string) {
  if (!value) return "—";
  // Datas "YYYY-MM-DD" são parseadas manualmente porque `new Date(string)`
  // as interpreta como UTC meia-noite — em fusos atrás de UTC isso exibia
  // o dia anterior ao selecionado.
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

// Status exibido em telas de parcela: "atrasado" é derivado (não persistido)
// para parcelas em aberto cujo vencimento já passou.
export function getParcelaDisplayStatus(parcela: {
  situacao?: string;
  datavencimento?: string;
}) {
  if (parcela.situacao?.toLowerCase() !== "aberto" || !parcela.datavencimento) {
    return parcela.situacao;
  }
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(parcela.datavencimento);
  if (!isoMatch) return parcela.situacao;
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return isoMatch[0] < todayIso ? "atrasado" : parcela.situacao;
}
