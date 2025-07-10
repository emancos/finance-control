import type { Transaction, CategoryTotal } from "./transaction"

export type RootStackParamList = {
    Login: undefined
    Main: undefined
    TransactionDetail: { transaction: Transaction }
    AddTransaction: { transaction?: Transaction }
    CategoryTransactions: { category: CategoryTotal }
}

export type TabParamList = {
    Dashboard: undefined
    Categories: undefined
    AddTransaction: undefined
    Reports: undefined
    Settings: undefined
}

export type AddTransactionScreenRouteProp = {
    key: string
    name: "AddTransaction"
    params?: { transaction?: Transaction }
}
