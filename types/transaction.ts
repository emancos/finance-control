export interface Transaction {
    id?: string
    description: string
    value: string
    date: string
    type: "positive" | "negative"
    category?: string
    time?: string
    paymentMethod?: string
    notes?: string
    timestamp?: number
    installments?: number
    installmentValue?: string
    isCollective?: boolean
    people?: Person[]
}

export interface Person {
    id: string
    name: string
    amount: string
}

export interface CategoryTotal {
    id: string
    name: string
    total: number
    formattedTotal: string
    percentage: number
    color: string
    icon?: any
}
  