'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Image, ArrowRight, Loader2 } from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    isPrivate: false,
    artwork: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push('/events')
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Create Your <span className="gold-text">Event</span>
          </h1>
          <p className="text-gray-400">
            Fill in the details below to create your NFT-powered event invitation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">Event Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John's Birthday Party"
              className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold-500" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
            <div className="card p-6">
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-500" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="123 Main St, New York, NY"
              className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
              required
            />
          </div>

          {/* Capacity */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-500" />
              Guest Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min={1}
              max={1000}
              className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
              required
            />
            <p className="text-gray-500 text-sm mt-2">
              Maximum number of guests you can invite
            </p>
          </div>

          {/* Artwork */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Image className="w-4 h-4 text-gold-500" />
              Invite Artwork (IPFS URL)
            </label>
            <input
              type="url"
              value={formData.artwork}
              onChange={(e) => setFormData({ ...formData, artwork: e.target.value })}
              placeholder="https://ipfs.io/ipfs/..."
              className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 focus:border-gold-500 focus:outline-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              Optional: Link to your custom invite artwork on IPFS
            </p>
          </div>

          {/* Private Event */}
          <div className="card p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                className="w-5 h-5 rounded border-gold-500/20 bg-dark-700 text-gold-500 focus:ring-gold-500"
              />
              <span className="text-sm font-medium">Private Event</span>
            </label>
            <p className="text-gray-500 text-sm mt-2 ml-8">
              Private events require approval for each guest
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Event...
              </>
            ) : (
              <>
                Create Event
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
