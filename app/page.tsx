import App from "../App"
import { TransactionsProvider } from "../hooks/use-transactions"

const Page = () => {
    return (
        <TransactionsProvider>
            <App />
        </TransactionsProvider>
    )
}

export default Page
