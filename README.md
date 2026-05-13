<p align="center">
  <h1 align="center">💳 CakraPay - Fintech Dashboard</h1>
</p>

<p align="center">
  <strong>A premium Fintech Dashboard for managing wallets, transactions, and user roles.</strong>
</p>

<p align="center">
  <a href="https://cakrapay-vocagame.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE%20DEMO-VISIT%20SITE-blueviolet?style=for-the-badge" alt="Live Demo">
  </a>
  <img src="https://img.shields.io/badge/LICENSE-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,git" />
  </a>
</p>

---

<p align="center">
  Built with the modern stack for <strong>Vocagame</strong>.<br/>
  Focusing on clean architecture, tactile UX, and a robust testing suite.
</p>

A premium, high-performance Fintech Dashboard built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. This project was developed as a technical home test for **Vocagame**, focusing on clean architecture, advanced UX interactions, and a comprehensive testing suite.

## ✨ Features

- **Multi-Wallet Management**: View and manage multiple currency wallets (USD, IDR, EUR, etc.).
- **Transaction History**: Real-time transaction tracking with status indicators.
- **Admin Panel**: Global overview of all wallets and transactions with administrative controls.
- **Role Switching**: Seamlessly switch between different user identities for testing and management.
- **Modern UI**: Clean, responsive design with dark mode support and smooth animations.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🛠️ Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/WisnuCakraa/cakrapay.git
cd cakrapay
```

### 2. Install Dependencies
```bash
yarn install
# or
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
You can use `.env.example` as a template.

### 4. Run the Development Server
```bash
yarn dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js app router pages and layouts.
- `components/`: Reusable UI and feature-specific components.
- `hooks/`: Custom React hooks for data fetching and logic.
- `services/`: API service layers.
- `store/`: Global state management using Zustand.
- `lib/`: Utility functions and shared constants.

## 📝 License

Distributed under the MIT License.
