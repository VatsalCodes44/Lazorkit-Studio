
# ⚡ LazorKit Studio

**The definitive playground, debugger, and UX reference for building passkey-powered, gasless Solana applications using LazorKit.**

LazorKit Studio is a live, interactive environment that demonstrates how modern Web2-grade UX (Face ID, Touch ID, no wallets, no seed phrases) maps deterministically to real Solana transactions — with full execution visibility.

🔗 Live App: https://lazorkit-studio.vatsalmahajan.in  
💻 Source Code: https://github.com/VatsalCodes44/Lazorkit-Studio  
🐦 Author: https://x.com/mahajan_vatsal_

---

## ✨ What is LazorKit Studio?

LazorKit Studio is not just a demo.

It is a developer-first inspection tool that shows:
- how user intent becomes a Solana transaction
- how LazorKit orchestrates signing, sponsorship, and execution
- how passkeys replace wallets
- how gasless UX still results in verifiable on-chain proof


---

## 🔥 Why LazorKit Studio Exists

Most Solana demos answer “can it work?”

LazorKit Studio answers:
- How does it work?
- What exactly was signed?
- Who paid for gas?
- What ran on-chain?
- Why did it succeed or fail?

### Traditional Solana UX vs LazorKit UX

| Traditional Solana | LazorKit Studio |
|--------------------|-----------------|
| Browser wallet popups | Native Face ID / Touch ID |
| Seed phrases | Zero secrets exposed to users |
| User pays gas | Gasless via paymaster |
| Black-box signing | Transparent execution flow |
| Hard to debug | Step-by-step lifecycle |

---

## 🧠 Core Features

### 🔐 Passkey-Based Authentication
- WebAuthn (Face ID / Touch ID)
- No wallet installation
- No seed phrases
- Secure enclave backed keys

### ⚡ Gasless Transactions
- Paymaster-sponsored execution
- Zero SOL required from users
- Identical on-chain guarantees

### 🧭 Transaction Flow Inspector
Transaction is broken into deterministic steps:

1. User intent captured
2. Instruction assembly
3. LazorKit orchestration
4. Gas sponsorship
5. Passkey authorization
6. Validator execution
7. Finalization & proof

### 🧾 On-Chain Proof Snapshot
- Transaction status
- Network
- Signature (copyable)
- Timestamp
- Direct Solana Explorer link

---

## 🧪 Who is this for?

- Developers building Solana dApps with LazorKit
- Protocol teams evaluating passkey UX
- Judges & reviewers validating real on-chain execution
- Designers studying wallet-less crypto UX
- Founders pitching Web2-grade onboarding on Solana

---

## 🏗️ Tech Stack

| Category | Technology |
|--------|------------|
| Framework | React + TypeScript |
| Routing | React Router |
| Styling | Tailwind CSS |
| Wallet SDK | LazorKit |
| Blockchain | Solana |
| Auth | WebAuthn (Passkeys) |
| UX | Gasless Transactions |
| Deployment |AWS S3, CDN |

---

## 📂 Project Structure
```
lazorkit-studio/
├── src/
│   ├── pages/              # App routes (Login, Actions, Debug)
│   ├── components/         # UI components
│   ├── lib/                # Transaction utilities
│   ├── hooks/              # Wallet + state hooks
│   └── styles/             # Tailwind config
├── public/
└── README.md

```


## 🚀 Getting Started (Local)

```bash
git clone https://github.com/VatsalCodes44/Lazorkit-Studio
cd Lazorkit-Studio
npm install
npm run dev
```
Open:
👉 http://localhost:5173

## 🌍 Live Deployment

**Production URL:**  
👉 https://lazorkit-studio.vatsalmahajan.in

The live app runs against Solana Devnet and produces **verifiable on-chain transactions**.

---

## 🎯 Design Philosophy

LazorKit Studio is built around three principles:

### 1️⃣ UX First
If it doesn’t feel like Web2, it’s not good enough.

### 2️⃣ Transparency by Default
Every abstraction is explainable. No magic.

### 3️⃣ Production-Grade Example
This is real code, not pseudo-demos.

---

## 👤 Author

**Vatsal Mahajan**  
B.Tech CSE | Full-Stack & Web3 Engineer  

- GitHub: https://github.com/VatsalCodes44  
- Twitter (X): https://x.com/mahajan_vatsal_

---

## 📜 License

MIT License  
Feel free to fork, learn, build, and extend.
