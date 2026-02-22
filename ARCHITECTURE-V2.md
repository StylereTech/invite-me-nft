# Invite Me NFT — Full Platform Architecture v2

_Updated: Feb 16, 2026_
_Target launch: June–July 2026_

---

## Vision (Expanded)

Not just NFT invitations — a **full AI-powered event planning platform** with:
1. **AI Event Planner** — conversational planning from vibe to execution
2. **Vendor Marketplace** — discover, book, pay vendors
3. **NFT Invitations** — the signature product, blockchain-verified
4. **Vendor Academy** — training + certification ecosystem
5. **Collaborative Event Hub** — guests, hosts, vendors all in one place
6. **Day-of Execution** — real-time checklists, vendor check-ins
7. **Post-Event** — feedback, photos, tipping

---

## Consumer Journey

### Phase 1: Onboarding & Discovery
```
User opens app → AI mascot greets ("Sparky the Genie")
  → "What kind of event?" (Birthday, Anniversary, Baby Shower, Social, Corporate...)
  → "What's the vibe?" (free-form text OR mood icons 🎉✨🕺)
  → AI analyzes input, cross-references trends
```

### Phase 2: AI-Generated Event Blueprint
```
User answers: budget, date, location, guest count
  → AI generates custom dashboard:
     ├── Theme Suggestion: "Totally 80s Retro Arcade Party"
     │   └── Mood board (AI-generated images, color palettes, decor ideas)
     ├── Budget Breakdown (real-time tracking)
     │   ├── Venue: $X
     │   ├── Catering: $Y
     │   ├── Entertainment: $Z
     │   └── Decor: $W
     └── Checklist & Timeline
         ├── 4 weeks: Book venue
         ├── 3 weeks: Order invitations (NFTs!)
         ├── 2 weeks: Confirm vendors
         ├── 1 week: Finalize menu
         └── Day before: Pick up supplies
```
User can edit anything, ask AI for alternatives ("Show me cheaper catering options")

### Phase 3: Vendor Discovery & Booking
```
AI curates recommended vendors from marketplace
  → Filters: distance, price, rating, availability
  → Vendor profiles: photos, reviews, certification badges
  → "Top Pick" AI recommendations
  → Book: select → see availability → deposit via Stripe
  → Auto: confirmation emails + calendar invites
```

### Phase 4: NFT Invitations (Our Signature)
```
Within the event hub:
  → Upload guest list (CSV/Excel/manual)
  → Choose invitation design (template, upload, or AI-generated)
  → Preview NFT invitation
  → Invoice generated → Pay via Stripe
  → NFTs minted on Polygon → Delivered to guests (email/SMS)
  → Guests claim with one click (no wallet needed)
```

### Phase 5: Collaborative Event Hub
```
Private event page (shareable link):
  ├── RSVP tracking + meal preferences
  ├── Gift registry / "contribute to party fund"
  ├── Photo sharing (during + after event)
  ├── Group chat for planning coordination
  └── Guest add-on bookings (photo booth, etc.)
```

### Phase 6: Real-Time AI Support (Continuous)
```
AI stays active throughout planning:
  ├── Budget alerts: "You've spent 80% — try these swaps"
  ├── Weather updates (outdoor events) + contingency plans
  ├── Vendor reminders: "Confirm cake order by Friday!"
  ├── Last-minute ideas: "Add a DIY cocktail station for $50"
  └── Chat anytime: "What's a good icebreaker for a 40th?"
```

### Phase 7: Event Day Execution
```
Day-of checklist with timers:
  ├── 10:00 AM — Venue setup begins
  ├── 2:00 PM — Caterer arrives
  ├── 6:00 PM — Guests arrive
  ├── Vendors check in via app ("on site" ✅)
  ├── Host gets real-time notifications
  └── NFT = entry ticket (scan at door)
```

### Phase 8: Post-Event
```
AI auto-sends:
  ├── Feedback survey → rate vendors
  ├── Thank-you note template for guests
  ├── Photo album (auto-generated from guest uploads)
  ├── Host can tip vendors through app
  └── Vendors get performance summary + improvement tips
```

---

## Vendor Journey

```
1. Sign up → Complete profile (photos, services, pricing)
2. Join Vendor Academy (free tier)
   ├── Courses: "How to Get 5-Star Reviews", "Marketing Pro", etc.
   └── Earn certification badges (displayed on profile)
3. Get booked → Build reputation
   ├── High performers get featured placements
   └── Access analytics: conversion rates, earnings, demographics
4. Community forum → Network + learn
5. Premium tier → Advanced analytics, priority support
```

---

## Revenue Model (7 Streams)

| Stream | Description | Est. Revenue |
|--------|-------------|-------------|
| **1. Booking Commission** | 10-15% per vendor booking | Primary revenue |
| **2. NFT Minting Fees** | $0.50-$5.00 per guest invitation | Per-event |
| **3. Vendor Subscriptions** | Free / Pro ($29/mo) / Premium ($99/mo) | Recurring MRR |
| **4. Academy Course Fees** | $19-$99 per course or $29/mo subscription | Recurring |
| **5. Sponsored Listings** | Vendors pay for top placement | Ad revenue |
| **6. Premium Event Features** | AI design, video invites, day-of tools | Upsell |
| **7. Data Insights** | Anonymized trend reports to event brands | B2B |

---

## Tech Stack

### Frontend
| Component | Technology |
|-----------|-----------|
| **Mobile App** | React Native (Expo) — iOS + Android |
| **Web App** | Next.js 14 (App Router) + TailwindCSS + shadcn/ui |
| **Design System** | Shared component library |

### Backend
| Component | Technology |
|-----------|-----------|
| **API** | Next.js API Routes + tRPC (type-safe) |
| **Database** | PostgreSQL (Neon serverless) + Prisma ORM |
| **Auth** | NextAuth.js (Google, Apple, Email magic link) |
| **Real-time** | Socket.IO or Pusher (chat, notifications) |
| **File Storage** | Cloudflare R2 (cheaper than S3) |
| **Search** | Algolia (vendor search + filtering) |

### AI Services
| Service | Provider |
|---------|---------|
| **Conversational Planning** | OpenAI GPT-4o |
| **Mood Boards / Visuals** | gpt-image-1 (AI-generated) |
| **Vendor Matching** | Custom recommendation engine (collaborative filtering) |
| **Content Generation** | GPT-4o (thank-you notes, descriptions) |

### Blockchain & Payments
| Component | Technology |
|-----------|-----------|
| **Blockchain** | Polygon PoS (mainnet) |
| **NFT Minting** | Thirdweb SDK (gasless, lazy minting) |
| **Guest Wallets** | Crossmint (custodial, no crypto needed) |
| **NFT Metadata** | IPFS via Pinata |
| **Payments** | Stripe Connect (marketplace payouts to vendors) |
| **Invoicing** | Stripe Invoicing API |

### Vendor Academy (LMS)
| Component | Technology |
|-----------|-----------|
| **Course Platform** | Custom built OR Teachable API (headless) |
| **Video Hosting** | Mux or Cloudflare Stream |
| **Certificates** | Auto-generated PDF + on-chain badge (optional) |

---

## Data Model (Expanded)

```
USERS
├── Client (event host)
├── Guest (invitee)
├── Vendor (service provider)
└── Admin (us)

CORE ENTITIES
├── Event
│   ├── id, clientId, title, type, date, time
│   ├── venue (venueId or custom address)
│   ├── theme, vibe, description
│   ├── budget (total, spent, remaining)
│   ├── status (draft, planning, invites_sent, day_of, completed)
│   ├── guestCount, rsvpCount
│   └── aiPlanId (link to AI-generated blueprint)
│
├── Guest
│   ├── id, eventId, name, email, phone
│   ├── rsvpStatus (pending, yes, no, maybe)
│   ├── plusOnes, mealPreference
│   ├── nftTokenId, walletAddress, claimedAt
│   └── checkedInAt
│
├── Vendor
│   ├── id, name, email, phone, company
│   ├── category (catering, photography, DJ, decor, venue...)
│   ├── location, serviceRadius
│   ├── pricing (hourly/flat/custom)
│   ├── rating, reviewCount
│   ├── badges[] (academy certifications)
│   ├── photos[], portfolio
│   ├── availability (calendar)
│   ├── subscriptionTier (free, pro, premium)
│   └── stripeConnectId
│
├── Booking
│   ├── id, eventId, vendorId, clientId
│   ├── service, date, time
│   ├── amount, deposit, commission
│   ├── status (pending, confirmed, completed, cancelled)
│   └── stripePaymentId
│
├── Invoice
│   ├── id, eventId, clientId
│   ├── lineItems[] (design fee, minting fee, vendor deposits)
│   ├── total, status (draft, sent, paid, overdue)
│   └── stripeInvoiceId
│
├── NFTContract
│   ├── id, eventId, chainId, contractAddress
│   ├── totalMinted, metadataCID
│   └── deployedAt
│
├── AIPlan (AI-generated event blueprint)
│   ├── id, eventId
│   ├── theme, moodBoard (image URLs)
│   ├── budgetBreakdown {}
│   ├── checklist []
│   ├── vendorRecommendations []
│   └── generatedAt
│
├── Course (Vendor Academy)
│   ├── id, title, description, category
│   ├── lessons[], duration
│   ├── price (0 = free)
│   ├── badgeId (certification earned)
│   └── enrollmentCount
│
└── Review
    ├── id, bookingId, vendorId, clientId
    ├── rating (1-5), text
    ├── photos[]
    └── vendorResponse
```

---

## MVP Scope (June 2026 Launch)

### 🔴 Phase 1: Core (March)
- [ ] Next.js project setup + auth (Google, email)
- [ ] PostgreSQL schema + Prisma
- [ ] Client: create event (details, date, venue)
- [ ] Upload guest list (CSV + manual)
- [ ] Basic vendor profiles (seeded, not marketplace yet)

### 🟡 Phase 2: AI + Invitations (April)
- [ ] AI event planner (GPT-4o conversational flow)
- [ ] AI mood board generation (gpt-image-1)
- [ ] Invitation design (upload or template)
- [ ] NFT minting pipeline (Polygon + Thirdweb)
- [ ] Guest claim page (Crossmint custodial wallet)
- [ ] Email delivery (Resend)

### 🟢 Phase 3: Marketplace + Payments (May)
- [ ] Vendor signup + profile builder
- [ ] Vendor search + filtering
- [ ] Booking flow + Stripe Connect
- [ ] Invoice generation + payment
- [ ] Commission tracking
- [ ] RSVP system

### 🔵 Phase 4: Polish + Launch (June)
- [ ] Collaborative event hub (chat, photos, registry)
- [ ] Day-of checklist + vendor check-in
- [ ] Post-event feedback + photo album
- [ ] Mobile responsive (web-first, React Native later)
- [ ] Beta with 5-10 real events
- [ ] Public launch July 1

### Future (v2.0+)
- [ ] React Native mobile app
- [ ] Vendor Academy (courses, badges, certificates)
- [ ] Sponsored listings
- [ ] Data insights product
- [ ] International expansion
- [ ] White-label for event planning companies

---

## Competitive Landscape

| Platform | Focus | Our Edge |
|----------|-------|----------|
| Eventbrite | Ticketing | No planning, no AI, corporate |
| The Knot / Zola | Weddings only | Limited to one event type |
| Paperless Post | Digital invites | No NFT, no vendor marketplace, no AI |
| Bark / Thumbtack | Vendor leads | No event planning, no invitations |
| POAP | NFT event tokens | Too crypto-native, no design, no planning |
| **Invite Me NFT** | **Full AI event platform** | **AI planner + vendor marketplace + NFT invites + academy — all in one** |

Nobody has all 4: **AI planning + vendor marketplace + NFT invitations + execution tools**.

---

## Key Metrics to Track

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| Events created | 500+ |
| Vendors onboarded | 200+ |
| NFT invitations minted | 10,000+ |
| Average booking value | $500+ |
| Vendor retention (monthly) | 80%+ |
| App rating | 4.5+ stars |
| MRR (subscriptions + commissions) | $10K+ |

---

## Cost Estimate (MVP Build)

| Item | Monthly Cost |
|------|-------------|
| Vercel Pro | $20 |
| Neon PostgreSQL | $25 |
| OpenAI API (GPT-4o) | $50-200 |
| Pinata IPFS | $20 |
| Polygon gas wallet | $10 |
| Resend email | $0 (free tier) |
| Cloudflare R2 | $5 |
| Domain + misc | $20 |
| **Total** | **~$150-300/mo** |

Development: You + 007 (me) = $0 additional dev cost.

---

## Open Questions

1. **Business name**: "Invite Me NFT" or something broader since it's a full platform now?
2. **Domain**: invitemenft.com? sparkevents.com? 
3. **AI mascot**: "Sparky the Genie" — lock this in?
4. **Mobile vs Web first**: Recommend web-first (faster to ship), mobile v2
5. **Vendor Academy at launch?**: Recommend Phase 2 — launch without it, add post-launch
6. **Legal**: Terms of service, vendor agreements, refund policy
7. **First market**: Dallas only? Or national from day 1?

---

_Jefe — review with your partner. This is the full blueprint. I can start coding Phase 1 whenever you give the green light._
