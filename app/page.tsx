import App from "../App"
import { TransactionsProvider } from "../hooks/use-transactions"
import { SettingsProvider } from "../hooks/use-settings"

const Page = () => {
    return (
        <SettingsProvider>
            <TransactionsProvider>
                <App />
            </TransactionsProvider>
        </SettingsProvider>
    )
}

export default Page
