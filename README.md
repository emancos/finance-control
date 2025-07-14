# Finance Control App

Um aplicativo simples de controle de despesas, desenvolvido com React Native e Expo.

## ✨ Funcionalidades

O aplicativo permite que o usuário gerencie suas finanças pessoais de maneira intuitiva. As funcionalidades implementadas incluem:

-   **Dashboard Principal:** Visualização rápida de resumos financeiros.
-   **Lista de Transações:** Exibição de todas as transações (despesas e receitas) com detalhes.
-   **Adicionar Nova Transação:** Um formulário completo para adicionar novas transações, com campos para:
    -   Descrição
    -   Valor
    -   Categoria
    -   Tipo de Pagamento (à vista ou parcelado)
    -   Divisão de compra coletiva entre várias pessoas.
-   **Detalhes da Transação:** Tela para visualizar todos os detalhes de uma transação específica.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas para o desenvolvimento de aplicativos móveis multiplataforma.

-   **[React Native](https://reactnative.dev/)**: Framework principal para o desenvolvimento do aplicativo.
-   **[Expo](https://expo.dev/)**: Plataforma e conjunto de ferramentas para facilitar o desenvolvimento e a construção de apps React Native.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática ao código, aumentando a robustez e a manutenibilidade.
-   **[React Navigation](https://reactnavigation.org/)**: Biblioteca para gerenciamento de navegação e empilhamento de telas.
-   **[Lucide React Native](https://lucide.dev/)**: Biblioteca de ícones.
-   **[React Native Element Dropdown](https://github.com/hoaphantn7604/react-native-element-dropdown)**: Componente de dropdown customizável usado nos formulários.

## Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/emancos/finance-control.git
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd finance-control
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento do Expo (É necessário um Virtual Device Manager configurado):**
    ```bash
    npx expo run:android
    ```
5.  **Use o aplicativo Expo Go** no seu celular para escanear o QR Code gerado no terminal.
