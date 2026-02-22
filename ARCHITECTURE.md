# Invite Me NFT — Architecture Document

_Last updated: Feb 16, 2026_
_Target launch: June–July 2026_

---

## 1. Vision

A premium digital invitation platform where every invite is a unique NFT. Clients design once, we mint and deliver to every guest — no crypto knowledge required.

**Tagline**: _"Your event. Their keepsake. On the blockchain."_

---

## 2. User Flows

### Flow A: Client (Event Host)

```
1. Sign Up / Login
2. Create Event
   ├── Choose venue (from directory or enter custom)
   ├── Set event details (date, time, dress code, etc.)
   ├── Upload guest list (CSV, Excel, or manual entry)
   │     → Name, Email, Phone (optional)
   └── Upload invitation design
         → Upload mockup image / PDF
         → OR choose from template gallery
         → OR describe it (AI generates design)
3. Review & Customize
   ├── Preview NFT invitation
   ├── Add RSVP options (Yes / No / Plus-one)
   ├── Add event details on back (map, parking, registry)
   └── Choose delivery method (email, SMS, both)
4. Invoice Generated
   ├── Base design fee
   ├── Per-guest minting fee × guest count
   ├── Premium add-ons (animations, music, video)
   └── Total displayed → Pay via Stripe
5. Payment Confirmed → Minting Begins
   ├── Each guest gets unique NFT (tokenId = guestId)
   ├── Delivery: email/SMS with claim link
   └── Client dashboard shows delivery status
```

### Flow B: Guest (Invitee)

```
1. Receive email/SMS: "You're invited to [Event]!"
2. Click claim link → Beautiful landing page
   ├── See invitation (animated NFT)
   ├── Event details (date, venue, map)
   └── RSVP button (Yes / No / Plus-one)
3. Claim NFT (one click — no wallet needed)
   ├── Custodial wallet auto-created (Crossmint)
   ├── NFT minted to their wallet
   └── Optional: connect own wallet (MetaMask, etc.)
4. Event Day
   ├── Show NFT on phone (QR code in email)
   ├── Door scanner verifies NFT ownership
   └── Entry granted ✅
```

### Flow C: Admin (You & Partner)

```
1. Dashboard
   ├── All events, clients, revenue
   ├── Minting queue status
   ├── Guest delivery tracking
   └── Invoice management
2. Design Studio
   ├── Template management
   ├── AI design generation
   └── Client revision tracking
3. Analytics
   ├── Revenue by month
   ├── RSVP rates
   ├── Guest engagement
   └── Popular venues/templates
```

---

## 3. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) + TailwindCSS + shadcn/ui | SSR for SEO, fast, modern |
| **Backend** | Next.js API Routes + Prisma ORM | Unified codebase, type-safe |
| **Database** | PostgreSQL (Neon serverless) | Relational data (events, guests, invoices) |
| **Auth** | NextAuth.js (Google, Email magic link) | Simple, no passwords |
| **Payments** | Stripe Checkout + Webhooks | We know it, it works, handles invoicing |
| **Blockchain** | Polygon PoS (mainnet) | ~$0.01/mint, fast, widely supported |
| **NFT Minting** | Thirdweb SDK | Gasless mints, lazy minting, no-code deploy |
| **Guest Wallets** | Crossmint | Custodial wallets for non-crypto users |
| **File Storage** | AWS S3 / Cloudflare R2 | Invitation images, designs |
| **NFT Metadata** | IPFS via Pinata | Permanent, decentralized storage |
| **Email** | Resend | Beautiful transactional emails |
| **SMS** | Twilio | Guest notifications |
| **Hosting** | Vercel | Zero-config Next.js hosting |
| **Domain** | TBD (invitemenft.com?) | |

---

## 4. Data Model

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client     │────→│   Event      │────→│   Guest      │
│              │     │              │     │              │
│ id           │     │ id           │     │ id           │
│ name         │     │ clientId     │     │ eventId      │
│ email        │     │ title        │     │ name         │
│ phone        │     │ date         │     │ email        │
│ company      │     │ time         │     │ phone        │
│ stripeId     │     │ venue        │     │ rsvpStatus   │
│ createdAt    │     │ venueAddress │     │ plusOnes     │
└─────────────┘     │ dressCode    │     │ nftTokenId   │
                    │ description  │     │ walletAddr   │
                    │ guestCount   │     │ claimedAt    │
                    │ status       │     │ deliveredAt  │
                    │ designUrl    │     │ deliveryMethod│
                    │ templateId   │     │ checkedInAt  │
                    │ invoiceId    │     └─────────────┘
                    │ contractAddr │
                    │ mintStatus   │          ┌─────────────┐
                    │ createdAt    │         │   Invoice    │
                    └─────────────┘         │              │
                                            │ id           │
┌─────────────┐     ┌─────────────┐         │ eventId      │
│  Template    │     │  Venue       │         │ clientId     │
│              │     │              │         │ amount       │
│ id           │     │ id           │         │ designFee    │
│ name         │     │ name         │         │ mintFee      │
│ category     │     │ address      │         │ addOnFees    │
│ previewUrl   │     │ city         │         │ stripePIId   │
│ price        │     │ capacity     │         │ status       │
│ tags         │     │ type         │         │ paidAt       │
└─────────────┘     │ contactEmail │         └─────────────┘
                    │ photos       │
                    └─────────────┘

┌─────────────┐
│  NFTContract │
│              │
│ id           │
│ eventId      │
│ chainId      │
│ contractAddr │
│ totalMinted  │
│ metadataCID  │
│ deployedAt   │
└─────────────┘
```

---

## 5. NFT Architecture

### Smart Contract (ERC-721)
```
InviteMeNFT.sol
├── name: "[Event Name] Invitation"
├── symbol: "INVITE"
├── Each token = one guest invitation
├── Metadata: invitation image, event details, guest name
├── Non-transferable option (soulbound for security)
├── Owner: Invite Me NFT admin wallet
└── Minting: gasless via Thirdweb relayer (we pay gas)
```

### Metadata (stored on IPFS)
```json
{
  "name": "Wedding of Sarah & James — Guest: John Smith",
  "description": "You're invited! Saturday, July 12, 2026 at The Rosewood",
  "image": "ipfs://Qm.../invitation-john-smith.png",
  "attributes": [
    { "trait_type": "Event", "value": "Wedding of Sarah & James" },
    { "trait_type": "Venue", "value": "The Rosewood, Dallas TX" },
    { "trait_type": "Date", "value": "2026-07-12" },
    { "trait_type": "Guest", "value": "John Smith" },
    { "trait_type": "Table", "value": "12" },
    { "trait_type": "RSVP", "value": "Pending" }
  ],
  "external_url": "https://invitemenft.com/event/abc123/guest/john-smith"
}
```

### Minting Cost Analysis
| Chain | Gas per Mint | 100 Guests | 500 Guests |
|-------|-------------|-----------|-----------|
| Ethereum | ~$5.00 | $500 | $2,500 |
| Polygon | ~$0.01 | $1 | $5 |
| Base | ~$0.02 | $2 | $10 |
| **Polygon ✅** | **~$0.01** | **$1** | **$5** |

---

## 6. Pricing Model

### Standard Tiers

| Tier | Guest Count | Design | Per-Guest | Total Range |
|------|------------|--------|-----------|-------------|
| **Starter** | Up to 50 | Template | $0.50 | $20–$50 |
| **Premium** | Up to 200 | Custom design | $1.00 | $100–$500 |
| **Luxury** | Up to 500 | Full custom + animation | $2.00 | $500–$2,000 |
| **Elite** | 500+ | Bespoke + video + music | $5.00+ | $2,000–$10,000 |

### Add-Ons
- Animated invitation (video/motion): +$200
- Background music: +$50
- RSVP tracking dashboard: included
- Event day check-in scanner: +$100
- Physical QR card companion: +$3/guest
- Rush delivery (24h): +50%

### Revenue Split (you + partner)
- TBD — discuss with partner

---

## 7. MVP Scope (v1.0 — Target: June 2026)

### Must Have (Launch)
- [ ] Client signup/login
- [ ] Create event (details + venue)
- [ ] Upload guest list (CSV + manual)
- [ ] Upload invitation design (image)
- [ ] Invoice generation + Stripe payment
- [ ] NFT minting on Polygon (gasless)
- [ ] Guest email delivery with claim link
- [ ] Guest claim page (no wallet needed)
- [ ] RSVP functionality
- [ ] Client dashboard (event status, RSVPs, delivery)
- [ ] Admin dashboard (all events, revenue)

### Nice to Have (v1.1 — July)
- [ ] Template gallery (10+ designs)
- [ ] AI invitation design (describe → generate)
- [ ] SMS delivery option
- [ ] Event day QR check-in scanner
- [ ] Guest plus-one management
- [ ] Venue directory with photos

### Future (v2.0)
- [ ] White-label for event planners
- [ ] Venue partnerships + marketplace
- [ ] Physical+digital combo packs
- [ ] Event NFT photo gallery (post-event memories)
- [ ] Resale/collectible marketplace for special events

---

## 8. Timeline

```
Feb 16 — Mar 15:  Architecture + Design (this doc, wireframes, branding)
Mar 16 — Apr 15:  Backend + Smart Contracts (DB, auth, minting pipeline)
Apr 16 — May 15:  Frontend + Guest Experience (client portal, claim pages)
May 16 — Jun 1:   Integration + Testing (Stripe, minting, email delivery)
Jun 1 — Jun 15:   Beta (invite 5-10 real events, iterate)
Jun 15 — Jul 1:   Polish + Launch prep
Jul 1:             🚀 PUBLIC LAUNCH
```

**Total dev time**: ~4.5 months (plenty of buffer for June/July target)

---

## 9. Competitive Advantage

| Competitor | What They Do | Our Edge |
|-----------|-------------|----------|
| Paperless Post | Digital invites | No NFT, no blockchain verification |
| Eventbrite | Ticketing | Corporate, no personalization |
| Zola | Wedding invites | No NFT, limited to weddings |
| POAP | NFT event tokens | Too crypto-native, ugly, no design |
| **Invite Me NFT** | **Premium NFT invitations** | **Beautiful design + blockchain proof + zero crypto knowledge needed** |

The gap: Nobody is doing **premium, beautiful, personalized NFT invitations** for everyday events (weddings, birthdays, corporate, galas) that work for normal people.

---

## 10. Open Questions for Partner Discussion

1. **Business structure** — LLC? Who handles what?
2. **Domain** — invitemenft.com? inviteme.nft? getinvited.io?
3. **Revenue split** — 50/50? Based on roles?
4. **Initial capital** — Domain, hosting (~$50/mo), Polygon gas wallet ($100 to start)
5. **First clients** — Who do you know planning events in June/July?
6. **Branding** — Colors, logo, vibe (luxury? modern? playful?)

---

_This is a living document. Will update as decisions are made._
