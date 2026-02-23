'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3, Users, CheckCircle, XCircle, Clock, Send, 
  TrendingUp, Calendar, ArrowRight, Mail, Eye
} from 'lucide-react'

// Mock dashboard data
const mockStats = {
  totalEvents: 3,
  totalInvites: 120,
  totalRsvps: 89,
  acceptedRate: 78,
  checkIns: 45,
  pendingDelivery: 8,
}

const mockEvents = [
  {
    id: '1',
    name: "John's Birthday Party",
    date: '2026-07-15',
    guests: 50,
    accepted: 38,
    declined: 5,
    pending: 7,
    checkedIn: 0,
    delivered: 48,
    failed: 2,
  },
  {
    id: '2',
    name: 'Product Launch Party',
    date: '2026-08-01',
    guests: 100,
    accepted: 62,
    declined: 12,
    pending: 26,
    checkedIn: 0,
    delivered: 95,
    failed: 5,
  },
  {
    id: '3',
    name: 'Summer Gala 2026',
    date: '2026-09-20',
    guests: 200,
    accepted: 0,
    declined: 0,
    pending: 200,
    checkedIn: 0,
    delivered: 0,
    failed: 0,
  },
]

const mockRecentGuests = [
  { name: 'Alice Chen', email: 'alice@example.com', event: "John's Birthday", status: 'accepted', deliveredAt: '2 hours ago' },
  { name: 'Bob Martinez', email: 'bob@example.com', event: "John's Birthday", status: 'declined', deliveredAt: '3 hours ago' },
  { name: 'Carol Davis', email: 'carol@example.com', event: 'Product Launch', status: 'pending', deliveredAt: '5 hours ago' },
  { name: 'Dan Wilson', email: 'dan@example.com', event: 'Product Launch', status: 'accepted', deliveredAt: '1 day ago' },
  { name: 'Eva Brown', email: 'eva@example.com', event: "John's Birthday", status: 'accepted', deliveredAt: '1 day ago' },
]

export default function DashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const stats = [
    { label: 'Total Events', value: mockStats.totalEvents, icon: Calendar, color: 'text-sky-400' },
    { label: 'Invites Sent', value: mockStats.totalInvites, icon: Send, color: 'text-blue-400' },
    { label: 'RSVPs Received', value: mockStats.totalRsvps, icon: Users, color: 'text-green-400' },
    { label: 'Acceptance Rate', value: `${mockStats.acceptedRate}%`, icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Check-Ins', value: mockStats.checkIns, icon: CheckCircle, color: 'text-purple-400' },
    { label: 'Pending Delivery', value: mockStats.pendingDelivery, icon: Clock, color: 'text-yellow-400' },
  ]

  const statusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/20 text-green-400'
      case 'declined': return 'bg-red-500/20 text-red-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'attended': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="accent-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">Overview of all your events and invitations</p>
          </div>
          <Link href="/create-event">
            <button className="btn-primary flex items-center gap-2">
              Create Event <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-gray-400 text-xs">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Events with RSVP Counts */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-400" />
              Event RSVP Breakdown
            </h2>
            {mockEvents.map((event) => (
              <div key={event.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{event.name}</h3>
                    <span className="text-gray-500 text-sm">{event.date} · {event.guests} guests</span>
                  </div>
                  <Link href={`/events/${event.id}`}>
                    <button className="text-sky-400 text-sm hover:underline flex items-center gap-1">
                      View <Eye className="w-3 h-3" />
                    </button>
                  </Link>
                </div>

                {/* RSVP Bars */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-green-400 w-16">Accepted</span>
                    <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(event.accepted / event.guests) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{event.accepted}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-red-400 w-16">Declined</span>
                    <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(event.declined / event.guests) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{event.declined}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-yellow-400 w-16">Pending</span>
                    <div className="flex-1 h-3 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(event.pending / event.guests) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{event.pending}</span>
                  </div>
                </div>

                {/* Delivery Status */}
                <div className="flex gap-4 pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-sky-400" />
                    <span className="text-gray-400">Delivered: <strong className="text-white">{event.delivered}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-red-400" />
                    <span className="text-gray-400">Failed: <strong className="text-white">{event.failed}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-purple-400" />
                    <span className="text-gray-400">Checked In: <strong className="text-white">{event.checkedIn}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Guest Activity */}
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-sky-400" />
              Recent Guest Activity
            </h2>
            <div className="card divide-y divide-white/5">
              {mockRecentGuests.map((guest, i) => (
                <div key={i} className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="font-medium text-sm">{guest.name}</div>
                      <div className="text-gray-500 text-xs">{guest.email}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor(guest.status)}`}>
                      {guest.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{guest.event}</span>
                    <span>{guest.deliveredAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
