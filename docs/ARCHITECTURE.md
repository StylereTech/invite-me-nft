# Invite Me NFT — Architecture Document

> **Version:** 1.0  
> **Last Updated:** February 2026  
> **Status:** Presentation-Ready for Business Partner

---

## 1. Vision & Overview

### The Problem
Event invitations are broken — paper invites get lost, RSVPs are scattered across emails/SMS/phone calls, and there's no elegant way to verify attendance or preserve memories.

### The Solution
**Invite Me NFT** is an NFT-based event invitation platform that transforms how we send, track, and experience event invites. Each invitation is a unique digital collectible that lives forever on the blockchain.

### The Roadmap

| Phase | Timeline | Features |
|-------|----------|----------|
| **v1** | June-July 2026 | Core invite flow — mint, send, RSVP, check-in |
| **v1.5** | Q3 2026 | Custom invite artwork generator (AI), event templates |
| **v2** | Q4 2026 | Marketplace — buy/sell/transfer invites, ticket resale |
| **v3** | 2027 | AI event planner, social features, loyalty/rewards |

---

## 2. Tech Stack

### Why This Stack?

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Blockchain** | **Base (Coinbase L2)** | Low gas fees (~$0.001-0.01/tx), EVM-compatible, mainstream onramp via Coinbase wallet |
| **Smart Contracts** | **Solidity + Hardhat** | Industry standard, robust testing, native ERC-721 support |
| **Backend** | **Node.js + Express + TypeScript** | Consistent with existing infrastructure, strong typing |
| **Frontend** | **Next.js 14 + TypeScript + Tailwind** | Server-side rendering, SEO-friendly, rapid UI development |
| **Database** | **MongoDB** | Flexible schema for event metadata, user profiles, analytics |
| **Wallet** | **Privy** | Embedded wallets (gasless UX), email/social login, no MetaMask required |
| **Payments** | **Stripe + Crypto** | Fiat onramp via Stripe, native ETH/USDC on Base |
| **Storage** | **IPFS via Pinata** | Decentralized storage for NFT metadata + artwork |
| **Email** | **Resend** | Developer-friendly email delivery, high deliverability |
| **Auth** | **Privy** | Email/social login → auto-create wallet behind the scenes |
| **Hosting** | **Vercel + AWS** | Frontend on Vercel, backend on AWS/Railway |

---

## 3. Smart Contract Architecture

### Contract Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    InviteMeFactory.sol                          │
│  (Deploys new event contracts or manages event mappings)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      InviteMeNFT.sol                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │   Events    │  │   Invites   │  │      ERC-721 Core       ││
│  │  Mapping    │  │   Mapping   │  │  mint, transfer, owner  ││
│  └─────────────┘  └─────────────┘  └─────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### InviteMeNFT.sol — Core Functions

```solidity
// Event Structure
struct Event {
    string name;
    uint256 date;
    string location;
    uint256 maxCapacity;
    address host;
    bool isPrivate;
    bool isActive;
}

// Invite/Token Structure
struct Invite {
    uint256 eventId;
    address guest;
    Status status; // pending, accepted, declined, attended
    uint256 rsvpDate;
    uint256 checkInDate;
    string metadataURI;
}

enum Status { Pending, Accepted, Declined, Attended }
```

#### Key Functions

| Function | Description | Access |
|----------|-------------|--------|
| `createEvent(...)` | Host creates new event with details | Host only |
| `mintInvite(eventId, recipient, metadata)` | Host mints NFT invite for guest | Host only |
| `rsvp(tokenId, accepted)` | Guest accepts/declines invitation | Guest only |
| `checkIn(tokenId)` | Venue verifies attendance (QR scan) | Venue/Host |
| `transferInvite(tokenId, newRecipient)` | Transfer/gift invite | Token Owner |
| `getEventDetails(eventId)` | Read event info | Public |
| `getInviteDetails(tokenId)` | Read invite info | Public |

### Gasless UX (Account Abstraction)

- **Paymaster Integration**: Base supports ERC-4337 account abstraction
- Platform sponsors gas fees for guests — they never see MetaMask or gas
- Embedded wallets via Privy handle signing seamlessly

---

## 4. User Flows

### Flow 1: Host Creates Event

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐    ┌───────────┐
│   Sign   │───▶│  Create      │───▶│   Set       │───▶│   Mint     │───▶│   Send    │
│   Up     │    │  Event       │    │   Invite    │    │   NFT      │    │   Invites │
└──────────┘    └──────────────┘    │   List      │    └────────────┘    └───────────┘
                                    └─────────────┘
```

1. User signs up (email or social)
2. Creates event: name, date, venue, capacity, artwork
3. Uploads guest list (email addresses)
4. Mints NFT invites for each guest
5. Sends via email/SMS with magic link

### Flow 2: Guest Receives & RSVP

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐    ┌───────────┐
│  Receive │───▶│   View       │───▶│  Connect    │───▶│   RSVP     │───▶│   Get QR  │
│  Invite  │    │   NFT        │    │  Wallet     │    │   On-Chain │    │   Code    │
└──────────┘    └──────────────┘    └─────────────┘    └────────────┘    └───────────┘
```

1. Guest receives email/SMS with invite link
2. Views beautiful NFT invite artwork
3. Connects wallet (or auto-created via Privy)
4. RSVP accepted/declined on-chain
5. Receives QR code for check-in

### Flow 3: Event Day Check-In

```
┌──────────┐    ┌──────────────┐    ┌─────────────┐    ┌────────────┐
│  Guest   │───▶│   Venue      │───▶│  checkIn()  │───▶│  Attendance│
│  Shows   │    │   Scans QR   │    │  Called     │    │  Verified  │
│  QR      │    └──────────────┘    └─────────────┘    └────────────┘
└──────────┘
```

1. Guest shows QR code at entry
2. Venue scans with scanner app
3. `checkIn()` function called on-chain
4. Attendance verified instantly
5. POAP-style proof of attendance minted

---

## 5. Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  wallet: "0x...",           // Wallet address
  email: "user@example.com",
  name: "John Doe",
  avatar: "https://ipfs.io/...",
  eventsHosted: [eventId, ...],
  eventsAttended: [eventId, ...],
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection

```javascript
{
  _id: ObjectId,
  contractAddress: "0x...",     // Contract managing this event
  eventId: 1,                   // ID within contract
  host: "0x...",                // Host wallet address
  name: "John's Birthday Party",
  date: "2026-07-15T19:00:00Z",
  location: "123 Main St, NYC",
  capacity: 50,
  artwork: "https://ipfs.io/...",  // IPFS URL for invite design
  invites: [inviteId, ...],
  status: "upcoming" | "active" | "completed",
  createdAt: Date,
  updatedAt: Date
}
```

### Invite Collection

```javascript
{
  _id: ObjectId,
  tokenId: 1,
  eventId: 1,
  guest: "0x...",                    // Guest wallet
  guestEmail: "guest@example.com",    // For non-crypto guests
  status: "pending" | "accepted" | "declined" | "attended",
  rsvpDate: Date,
  checkInDate: Date,
  metadataURI: "https://ipfs.io/...",
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection

```javascript
{
  _id: ObjectId,
  eventId: 1,
  views: 150,
  rsvps: 42,
  accepted: 35,
  declined: 7,
  checkIns: 30,
  transfers: 5,
  lastUpdated: Date
}
```

---

## 6. API Routes

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List all events (filtered) |
| POST | `/events` | Create new event |
| GET | `/events/:id` | Get event details |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |
| GET | `/events/:id/invites` | Get all invites for event |
| POST | `/events/:id/mint-invites` | Mint NFT invites for guests |

### Invites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invites/:tokenId` | Get invite details |
| POST | `/invites/:tokenId/rsvp` | RSVP to invite |
| POST | `/invites/:tokenId/checkin` | Check in at event |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| GET | `/users/:id/events` | Get user's hosted events |
| GET | `/users/:id/attending` | Get events user is attending |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events/:id/analytics` | Get event analytics |

---

## 7. Key Features (v1)

### ✅ Gasless UX
- Users never see gas fees
- Platform sponsors transactions via Paymaster
- Embedded wallets via Privy

### ✅ Multi-Channel Delivery
- Email invites via Resend
- SMS via Twilio
- Magic links for non-crypto users

### ✅ Beautiful NFT Artwork
- Customizable invite templates
- AI-generated artwork (v1.5)
- IPFS storage for permanence

### ✅ QR Code Check-In
- Generate QR codes for each invite
- Venue scanner app
- Instant on-chain verification

### ✅ Real-Time Dashboard
- Live RSVP tracking
- Capacity management
- Attendance analytics

### ✅ Mobile-Responsive (PWA)
- Works on iOS and Android
- Installable web app
- Push notifications

---

## 8. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Smart Contract Vulnerabilities | Audit before mainnet deployment |
| Rate Limiting | Implement mint limits per host |
| Wallet Phishing | Wallet abstraction + transaction simulation |
| IPFS Data Loss | Pinata redundancy + backup pinning |
| Frontend Attacks | CSP headers, CSRF tokens, input validation |

---

## 9. Cost Estimates

| Component | Cost |
|-----------|------|
| **Base L2 Gas** | ~$0.001-0.01 per transaction (negligible) |
| **IPFS Storage** | ~$0.15/GB/month (Pinata) |
| **Vercel** | Free tier |
| **MongoDB Atlas** | Free tier |
| **AWS/Railway** | ~$20/month |
| **Resend** | Free tier (10k emails) |
| **Total Monthly** | **~$25-50/month** |

---

## 10. Project Structure

```
invite-me-nft/
├── frontend/                 # Next.js 14 application
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── create-event/    # Create event flow
│   │   ├── events/          # Event listing
│   │   ├── invite/[id]/    # Invite view
│   │   └── scanner/         # QR scanner
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities, API clients
│   └── tailwind.config.ts  # Tailwind configuration
│
├── server/                   # Express + TypeScript backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # MongoDB models
│   │   ├── middleware/     # Auth, validation
│   │   └── services/       # Business logic
│   └── package.json
│
├── contracts/               # Solidity smart contracts
│   ├── contracts/
│   │   ├── InviteMeNFT.sol
│   │   └── InviteMeFactory.sol
│   ├── test/               # Contract tests
│   └── hardhat.config.ts   # Hardhat configuration
│
└── docs/                   # Documentation
    ├── ARCHITECTURE.md
    ├── API.md
    └── CONSUMER-JOURNEY.md
```

---

## 11. Next Steps

1. **Initialize project** — Set up repositories, CI/CD
2. **Smart contracts** — Deploy to Base Sepolia testnet
3. **Backend API** — Build core endpoints
4. **Frontend MVP** — Landing page + create event flow
5. **Integration** — Connect frontend to contracts
6. **Testing** — End-to-end user flows
7. **Audit** — Security review before mainnet

---

> **Built with ❤️ by StylereTech**
