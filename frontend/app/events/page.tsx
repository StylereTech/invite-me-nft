'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Users, Plus, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

// Mock data
const mockEvents = [
  {
    id: '1',
    name: "John's Birthday Party",
    date: new Date('2026-07-15T19:00:00Z'),
    location: '123 Main St, NYC',
    capacity: 50,
    invites: 35,
    rsvps: 28,
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Product Launch Party',
    date: new Date('2026-08-01T18:00:00Z'),
    location: '456 Tech Ave, SF',
    capacity: 100,
    invites: 85,
    rsvps: 62,
    status: 'upcoming'
  }
]

export default function EventsPage() {
  const [events] = useState(mockEvents)

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              My <span className="accent-text">Events</span>
            </h1>
            <p className="text-gray-400">
              Manage your events and track RSVPs
            </p>
          </div>
          <Link href="/create-event">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Event
            </button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-sky-500/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Events Yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first NFT-powered event invitation
            </p>
            <Link href="/create-event">
              <button className="btn-primary inline-flex items-center gap-2">
                Create Event
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card p-6 hover:border-sky-500/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{event.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.status === 'upcoming' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white" />
                    <span>{format(event.date, 'MMM d, yyyy • h:mm a')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white" />
                    <span>{event.rsvps} / {event.capacity} guests</span>
                  </div>
                </div>

                {/* RSVP Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">RSVP Progress</span>
                    <span className="text-white">{Math.round((event.rsvps / event.capacity) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"
                      style={{ width: `${(event.rsvps / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/events/${event.id}`} className="flex-1">
                    <button className="btn-secondary w-full py-2 text-sm">
                      View Details
                    </button>
                  </Link>
                  <Link href={`/events/${event.id}/invites`} className="flex-1">
                    <button className="btn-primary w-full py-2 text-sm">
                      Send Invites
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
