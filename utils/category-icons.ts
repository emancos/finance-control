import {
    ShoppingCart,
    Car,
    Pill,
    Gamepad2,
    UtensilsCrossed,
    Home,
    Heart,
    GraduationCap,
    Bus,
    Shirt,
    CircleDollarSign,
    HelpCircle,
} from "lucide-react-native"

// Mapeamento de categorias para ícones e cores
export const categoryIcons: Record<string, { icon: any; color: string }> = {
    supermercado: { icon: ShoppingCart, color: "#ff9800" },
    veiculo: { icon: Car, color: "#2196f3" },
    farmacia: { icon: Pill, color: "#f44336" },
    lazer: { icon: Gamepad2, color: "#e91e63" },
    alimentacao: { icon: UtensilsCrossed, color: "#4caf50" },
    moradia: { icon: Home, color: "#9c27b0" },
    saude: { icon: Heart, color: "#f44336" },
    educacao: { icon: GraduationCap, color: "#3f51b5" },
    transporte: { icon: Bus, color: "#607d8b" },
    vestuario: { icon: Shirt, color: "#795548" },
    receita: { icon: CircleDollarSign, color: "#4caf50" },
    outros: { icon: HelpCircle, color: "#9e9e9e" },
}

// Obter lista de categorias para dropdown
export const getCategoryOptions = () => {
    return Object.entries(categoryIcons).map(([value, { icon: _, color: __, ...rest }]) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        ...rest,
    }))
}
  