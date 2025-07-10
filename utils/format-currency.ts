/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 */
export function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace(".", ",")}`
}

/**
 * Converte uma string de moeda para um valor numérico
 */
export function parseCurrency(value: string): number {
    // Remove símbolos de moeda, espaços e converte vírgula para ponto
    const numericValue = value
        .replace(/[R$\s.]/g, "")
        .replace(",", ".")
        .replace(/[^\d.-]/g, "")

    // Converte para número
    return Number.parseFloat(numericValue)
}

/**
 * Formata um valor para exibição com sinal positivo ou negativo
 */
export function formatTransactionValue(value: number, type: "positive" | "negative"): string {
    const formattedValue = formatCurrency(Math.abs(value))
    return type === "positive" ? `+ ${formattedValue}` : `- ${formattedValue}`
}
  