<div align="center">

# 🎉 Invite Me NFT

### Transform Your Event Invitations Into Digital Collectibles

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

**NFT-based event invitation platform built on Base (Coinbase L2)**

</div>

---

## 📋 About

Invite Me NFT is a revolutionary platform that transforms traditional event invitations into beautiful, verifiable digital collectibles on the blockchain. Each invitation is a unique NFT that tracks RSVP status and attendance, creating lasting memories for hosts and guests alike.

### Key Features

- 🎨 **Beautiful NFT Invites** — Customizable artwork stored on IPFS
- 🔗 **On-Chain Verification** — All RSVPs and check-ins verified on Base
- 📱 **Gasless UX** — Users never see gas fees via embedded wallets
- 📧 **Multi-Channel Delivery** — Email and SMS invite delivery
- 📲 **QR Check-In** — Instant venue check-in with QR scanning
- 📊 **Real-Time Analytics** — Live RSVP tracking dashboard

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Blockchain** | Base (Coinbase L2) |
| **Smart Contracts** | Solidity + Hardhat |
| **Backend** | Node.js + Express + TypeScript |
| **Frontend** | Next.js 14 + TypeScript + Tailwind |
| **Database** | MongoDB |
| **Wallet** | Privy (embedded wallets) |
| **Storage** | IPFS via Pinata |
| **Email** | Resend |
| **Hosting** | Vercel + AWS |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/StylereTech/invite-me-nft.git
cd invite-me-nft
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your values

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your values

npm install
npm run dev
```

API runs at [http://localhost:3001](http://localhost:3001)

### Smart Contracts Setup

```bash
cd contracts
cp .env.example .env
# Add your private key for deployments

npm install
npx hardhat compile
npx hardhat test
```

---

## 📁 Project Structure

```
invite-me-nft/
├── frontend/                 # Next.js 14 application
│   ├── app/                 # App router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── create-event/   # Create event flow
│   │   ├── events/         # Event listing
│   │   ├── invite/[id]/   # Invite view
│   │   └── scanner/        # QR scanner
│   ├── components/          # Reusable UI components
│   └── lib/                 # Utilities
│
├── server/                   # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # MongoDB models
│   │   ├── middleware/     # Auth middleware
│   │   └── services/       # Business logic
│   └── .env.example        # Environment template
│
├── contracts/               # Solidity contracts
│   ├── contracts/
│   │   ├── InviteMeNFT.sol
│   │   └── InviteMeFactory.sol
│   ├── test/               # Contract tests
│   └── hardhat.config.ts
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── CONSUMER-JOURNEY.md
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` — Register new user
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/auth/me` — Get current user

### Events
- `GET /api/v1/events` — List events
- `POST /api/v1/events` — Create event
- `GET /api/v1/events/:id` — Get event
- `PUT /api/v1/events/:id` — Update event
- `GET /api/v1/events/:id/invites` — Get invites
- `POST /api/v1/events/:id/mint-invites` — Mint invites

### Invites
- `GET /api/v1/invites/:tokenId` — Get invite
- `POST /api/v1/invites/:tokenId/rsvp` — RSVP
- `POST /api/v1/invites/:tokenId/checkin` — Check in

See [API.md](docs/API.md) for full documentation.

---

## 📱 User Flows

### Host Creates Event
1. Sign up / Connect wallet
2. Create event (name, date, venue, capacity)
3. Upload custom invite artwork
4. Add guest list (emails)
5. Mint NFT invites
6. Send via email/SMS

### Guest RSVPs
1. Receive invite (email/SMS)
2. Click magic link
3. View beautiful NFT invite
4. Connect wallet (or auto-created)
5. RSVP on-chain
6. Get QR code for check-in

### Event Day
1. Guest shows QR at entry
2. Venue scans QR
3. `checkIn()` called on-chain
4. Attendance verified instantly

---

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

**Backend** (`.env`):
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/invite-me-nft
JWT_SECRET=your-secret-key
```

**Contracts** (`.env`):
```
BASE_SEPOLIA_RPC_URL=your-rpc-url
PRIVATE_KEY=your-private-key
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ by [StylereTech](https://github.com/StylereTech)**

*Powered by [Base](https://base.org)*

</div>
