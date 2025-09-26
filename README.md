> [!WARNING]
>  The Arctica app is still in prototyping and early development.

# Arctica

 **[🇺🇸 English](./README.md)  |  [🇨🇳 简体中文](./README_zh.md)**

> Decentralized Platform for Fandoms - Ship and Preserve Your Fanworks On-Chain

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Lens Protocol](https://img.shields.io/badge/Protocol-Lens-dark.svg)](https://lens.xyz/docs/protocol)
[![Grove Storage](https://img.shields.io/badge/Storage-Grove-orange.svg)](https://lens.xyz/docs/storage)
[![License: AGPL](https://img.shields.io/badge/License-AGPL-purple.svg)](https://opensource.org/licenses/agpl-v3)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.75-orange.svg)](https://tanstack.com/query)

## 🩵 Project Overview

**Arctica** is a decentralized fandom portal that provides creators with a secure, open environment to share and preserve fan works. As an alternative to Tumblr, Pixiv, and Lofter, Arctica leverages blockchain technology to ensure long-term preservation and complete ownership of creative works.

## ✨ Core Features

- **🚢 On-Chain Storage**: long-term content storage powered by Lens Protocol - Grove
- **🍪 Creator Tools**: Text editor with image and text composition support
- **🌐 Decentralized**: Censorship-resistant with full creator ownership
- **👥 Social Interaction**: Follow, like, comment, and share functionality
- **🔍 Content Discovery**: Smart recommendations and tag-based categorization
- **🌍 Multilingual**: Multilingual interface support
- **📱 Responsive Design**: Optimized mobile and desktop experience
- **🩵 Fanac Culture**: Features specifically designed for fannish activities

## 🧱 Architecture

### Tech Stack

| Layer              | Technology                              | Purpose                                 |
| ------------------ | --------------------------------------- | --------------------------------------- |
| **Frontend**       | Next.js 14.2.16 + TypeScript 5.0 + App Router | Modern React app with server-side rendering |
| **Blockchain**     | Lens Protocol + Grove Storage           | Decentralized content storage and social graph |
| **Web3 Integration** | Wagmi v2.15 + Viem v2.29 + ConnectKit | Wallet connection and blockchain interaction |
| **State Management** | Zustand 5.0 + TanStack Query v5.75    | Application state and server data management |
| **UI Components**  | TailwindCSS 3.4 + Radix UI + shadcn/ui + Mantine UI | Component library and design system    |
| **Internationalization** | next-intl 4.3                      | Multi-language support                 |
| **Real-time Communication** | XMTP React SDK                 | messaging                |
| **Theme System**   | next-themes 0.4 + Mantine 8.2          | Dark/light theme switching             |

## 🎮 User Guide

### 1. Connect Wallet

Click the "Connect Wallet" button in the top right corner. Supports mail-login or and other major wallets.

### 2. Create Content

- Navigate to "Upload" button
- Use the text editor to edit content
- Add images, tags, and descriptions
- Publish to on-chain storage

### 3. Discover Content

- Browse popular content on home page
- Use tags to filter content of interest
- Follow favorite creators
- Interact with content (like, comment, share)

### 4. Manage Profile

- Edit profile and avatar
- View creation history
- Manage follow list
- Configure personal preferences


## 📁 Project Structure

```
Arctica/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── [locale]/                # Internationalized routes
│   │   │   ├── about/               # About page
│   │   │   ├── feed/                # Home page
│   │   │   ├── profile/             # User profile
│   │   │   ├── p/[postid]/          # Post details
│   │   │   ├── u/[user]/            # User profile pages
│   │   │   ├── what-is-chip/        # onchain explanation page
│   │   │   ├── ClientLayout.tsx     # Client-side layout
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Home page
│   │   ├── Web3Provider.tsx         # Web3 context provider
│   │   ├── globals.css              # Global styles
│   │   ├── manifest.json            # PWA manifest
│   │   └── favicon.ico              # Site favicon
│   ├── components/
│   │   ├── auth/                    # Authentication components
│   │   ├── comment/                 # Comment system
│   │   ├── dialogs/                 # Dialog components
│   │   ├── editer/                  # Rich text editor
│   │   ├── feed/                    # Feed components
│   │   ├── footer.tsx               # Site footer
│   │   ├── global-modals.tsx        # Global modal components
│   │   ├── header.tsx               # Site header
│   │   ├── home/                    # Home page components
│   │   ├── loading.tsx              # Loading components
│   │   ├── post/                    # Post-related components
│   │   ├── providers/               # Context providers
│   │   ├── search/                  # Search functionality
│   │   ├── token-id-display.tsx     # Token ID display component
│   │   ├── ui/                      # Reusable UI components
│   │   ├── user/                    # User-related components
│   │   └── user-avatar.tsx          # User avatar component
│   ├── contexts/                    # React contexts
│   ├── hooks/                       # Custom React hooks
│   ├── i18n/                        # Internationalization config
│   ├── lib/                         # Utility libraries and config
│   ├── middleware.ts                # Next.js middleware
│   ├── stores/                      # State management
│   ├── styles/                      # Additional styles
│   ├── types/                       # TypeScript type definitions
│   └── utils/                       # Utility functions
├── messages/                        # Internationalization messages
├── public/                          # Static assets
├── txt/                            # Documentation and config
├── components.json                  # shadcn/ui configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Project dependencies
├── postcss.config.mjs               # PostCSS configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md
```


## 👾 Quick Start

### Prerequisites

- Node.js 22+ and pnpm 9.7+
- Git version control

### Installation

```bash
# Clone repository
git clone https://github.com/fae-foundation/app.git
cd app

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to view the application.

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Configure environment variables
# .env.local
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
NEXT_PUBLIC_ALCHEMY_ID=kkkkkkkkkkkkkkkkkkkkk

NEXT_PUBLIC_ENVIRONMENT=development

NEXT_PUBLIC_APP_ADDRESS_TESTNET=0xDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD 

LENS_API_KEY_TESTNET=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb 
```

## 🔧 Development Scripts

```bash
# Development
pnpm dev                          # Start development server
```
```bash
pnpm build                        # Build production version
pnpm start                        # Start production server
pnpm lint                         # Code linting

# Type checking
pnpm type-check                   # TypeScript type checking

# Code formatting
pnpm format                       # Code formatting
pnpm format:check                 # Check code format
```

## 🌐 Multilingual Support

Arctica currently supports the following languages:

- 🇺🇸 English
- 🇨🇳 Chinese Simplified

Language switching is available in the language selector at the left of the page.

## 🤝 Contributing

We welcome community contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for detailed information on how to get started.

## 🛣️ todo

For detailed todo items, please see [todos.md](./todos.md).

## 📄 License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](./LICENSE) file for details.

## 🕊️ Support & Contact

- 📮 Mail: `faefoundation@protonmail.com`
- 👾 Reports: [Issues](https://github.com/fae-foundation/app/issues)
- 💬 Discussion: [Discussions](https://github.com/orgs/fae-foundation/discussions)


⭐ If this project helps you, please give us a Star!

**Made with 🩵 by the FAE Foundation**