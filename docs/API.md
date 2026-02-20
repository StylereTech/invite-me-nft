# Invite Me NFT — API Reference

> **Version:** 1.0  
> **Base URL:** `https://api.inviteme.io/v1` (production)

---

## Authentication

All API requests require authentication via Bearer token.

```bash
Authorization: Bearer <your_token>
```

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "wallet": "0x...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### POST /auth/login

Login with email/password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "wallet": "0x...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET /auth/me

Get current authenticated user.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "wallet": "0x...",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://ipfs.io/...",
    "eventsHosted": ["evt_1", "evt_2"],
    "eventsAttended": ["evt_3"]
  }
}
```

---

## Events

### GET /events

List events (filtered by user).

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter: `upcoming`, `active`, `completed` |
| `host` | string | Filter by host wallet address |
| `limit` | number | Results per page (default: 20) |
| `offset` | number | Pagination offset |

**Response:**
```json
{
  "success": true,
  "events": [
    {
      "id": "evt_123",
      "contractAddress": "0x...",
      "eventId": 1,
      "host": "0x...",
      "name": "John's Birthday Party",
      "date": "2026-07-15T19:00:00Z",
      "location": "123 Main St, NYC",
      "capacity": 50,
      "artwork": "https://ipfs.io/...",
      "status": "upcoming",
      "inviteCount": 45,
      "rsvpCount": 32
    }
  ],
  "total": 1
}
```

### POST /events

Create a new event.

**Request:**
```json
{
  "name": "John's Birthday Party",
  "date": "2026-07-15T19:00:00Z",
  "location": "123 Main St, NYC",
  "capacity": 50,
  "isPrivate": false,
  "artwork": "https://ipfs.io/..."
}
```

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "evt_123",
    "contractAddress": "0x...",
    "eventId": 1,
    "host": "0x...",
    "name": "John's Birthday Party",
    "date": "2026-07-15T19:00:00Z",
    "location": "123 Main St, NYC",
    "capacity": 50,
    "isPrivate": false,
    "artwork": "https://ipfs.io/...",
    "status": "upcoming"
  }
}
```

### GET /events/:id

Get event details.

**Response:**
```json
{
  "success": true,
  "event": {
    "id": "evt_123",
    "contractAddress": "0x...",
    "eventId": 1,
    "host": "0x...",
    "name": "John's Birthday Party",
    "date": "2026-07-15T19:00:00Z",
    "location": "123 Main St, NYC",
    "capacity": 50,
    "artwork": "https://ipfs.io/...",
    "status": "upcoming",
    "createdAt": "2026-02-01T00:00:00Z"
  }
}
```

### PUT /events/:id

Update event details.

**Request:**
```json
{
  "name": "John's Epic Birthday Party",
  "location": "456 Party Lane, NYC"
}
```

### DELETE /events/:id

Delete an event (only by host).

### GET /events/:id/invites

Get all invites for an event.

**Response:**
```json
{
  "success": true,
  "invites": [
    {
      "tokenId": 1,
      "eventId": 1,
      "guest": "0x...",
      "guestEmail": "guest@example.com",
      "status": "accepted",
      "rsvpDate": "2026-02-10T00:00:00Z"
    }
  ]
}
```

### POST /events/:id/mint-invites

Mint NFT invites for guests.

**Request:**
```json
{
  "guests": [
    {
      "email": "guest1@example.com",
      "metadata": "https://ipfs.io/.../1.json"
    },
    {
      "email": "guest2@example.com",
      "metadata": "https://ipfs.io/.../2.json"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "minted": 2,
  "transactionHash": "0x..."
}
```

---

## Invites

### GET /invites/:tokenId

Get invite details.

**Response:**
```json
{
  "success": true,
  "invite": {
    "tokenId": 1,
    "eventId": 1,
    "event": {
      "name": "John's Birthday Party",
      "date": "2026-07-15T19:00:00Z",
      "location": "123 Main St, NYC"
    },
    "guest": "0x...",
    "guestEmail": "guest@example.com",
    "status": "accepted",
    "rsvpDate": "2026-02-10T00:00:00Z",
    "checkInDate": null,
    "metadataURI": "https://ipfs.io/...",
    "qrCode": "https://api.qrserver.com/..."
  }
}
```

### POST /invites/:tokenId/rsvp

RSVP to an invite.

**Request:**
```json
{
  "accepted": true
}
```

**Response:**
```json
{
  "success": true,
  "status": "accepted",
  "transactionHash": "0x..."
}
```

### POST /invites/:tokenId/checkin

Check in at event (venue/host only).

**Request:**
```json
{
  "scannedBy": "0xvenue..."
}
```

**Response:**
```json
{
  "success": true,
  "status": "attended",
  "checkInDate": "2026-07-15T19:30:00Z",
  "transactionHash": "0x..."
}
```

---

## Users

### GET /users/me

Get current user profile.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "wallet": "0x...",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://ipfs.io/...",
    "eventsHosted": ["evt_1", "evt_2"],
    "eventsAttended": ["evt_3"]
  }
}
```

### GET /users/:id/events

Get events hosted by user.

**Response:**
```json
{
  "success": true,
  "events": [...]
}
```

### GET /users/:id/attending

Get events user is attending.

**Response:**
```json
{
  "success": true,
  "events": [...]
}
```

---

## Analytics

### GET /events/:id/analytics

Get event analytics.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "eventId": 1,
    "views": 150,
    "rsvps": 42,
    "accepted": 35,
    "declined": 7,
    "checkIns": 30,
    "transfers": 5,
    "lastUpdated": "2026-07-15T21:00:00Z"
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `CONTRACT_ERROR` | 500 | Blockchain transaction failed |

---

## Webhooks

Configure webhooks for real-time updates.

### Available Events

| Event | Description |
|-------|-------------|
| `event.created` | New event created |
| `invite.minted` | New invite minted |
| `invite.rsvp` | Guest RSVP'd |
| `invite.checkin` | Guest checked in |
| `invite.transferred` | Invite was transferred |

### Webhook Payload

```json
{
  "event": "invite.rsvp",
  "timestamp": "2026-02-10T12:00:00Z",
  "data": {
    "tokenId": 1,
    "eventId": 1,
    "guest": "0x...",
    "status": "accepted"
  }
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth | 10 req/min |
| Events | 60 req/min |
| Invites | 60 req/min |
| Analytics | 30 req/min |

---

> **Base URL for development:** `http://localhost:3001/v1`
