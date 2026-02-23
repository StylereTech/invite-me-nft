'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, MapPin, Users, Image, ArrowRight, Loader2, 
  Upload, FileText, X, Plus, Trash2 
} from 'lucide-react'

interface Guest {
  name: string
  email: string
  phone?: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [csvFileName, setCsvFileName] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    capacity: 50,
    isPrivate: false,
    artwork: '',
    description: '',
  })

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      const parsed: Guest[] = []

      // Skip header if present
      const start = lines[0]?.toLowerCase().includes('name') ? 1 : 0

      for (let i = start; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
        if (cols[0] && cols[1]) {
          parsed.push({
            name: cols[0],
            email: cols[1],
            phone: cols[2] || undefined,
          })
        }
      }

      setGuests(prev => [...prev, ...parsed])
    }
    reader.readAsText(file)
  }

  const addManualGuest = () => {
    setGuests(prev => [...prev, { name: '', email: '' }])
  }

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    setGuests(prev => prev.map((g, i) => i === index ? { ...g, [field]: value } : g))
  }

  const removeGuest = (index: number) => {
    setGuests(prev => prev.filter((_, i) => i !== index))
  }

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
            Create Your <span className="accent-text">Event</span>
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
              className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell your guests what the event is about..."
              rows={3}
              className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-6">
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="card p-6">
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-sky-400" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="123 Main St, New York, NY"
              className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Capacity */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Guest Capacity
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min={1}
              max={10000}
              className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Guest List Upload */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              Guest List
            </label>

            {/* CSV Upload */}
            <div 
              className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-sky-500/50 transition-colors cursor-pointer mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleCsvUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              {csvFileName ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span className="text-sky-400">{csvFileName}</span>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCsvFileName(null); }}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-400 text-sm">Upload CSV file</p>
                  <p className="text-gray-500 text-xs mt-1">Format: Name, Email, Phone (optional)</p>
                </>
              )}
            </div>

            {/* Manual Guest Entries */}
            {guests.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500 grid grid-cols-12 gap-2 px-1">
                  <span className="col-span-4">Name</span>
                  <span className="col-span-5">Email</span>
                  <span className="col-span-2">Phone</span>
                  <span className="col-span-1"></span>
                </div>
                {guests.map((guest, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => updateGuest(i, 'name', e.target.value)}
                      placeholder="Name"
                      className="col-span-4 bg-dark-700 border border-white/10 rounded px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => updateGuest(i, 'email', e.target.value)}
                      placeholder="Email"
                      className="col-span-5 bg-dark-700 border border-white/10 rounded px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={guest.phone || ''}
                      onChange={(e) => updateGuest(i, 'phone', e.target.value)}
                      placeholder="Phone"
                      className="col-span-2 bg-dark-700 border border-white/10 rounded px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeGuest(i)}
                      className="col-span-1 flex items-center justify-center text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={addManualGuest}
              className="text-sky-400 text-sm flex items-center gap-1 hover:text-sky-300"
            >
              <Plus className="w-4 h-4" /> Add guest manually
            </button>

            {guests.length > 0 && (
              <p className="text-gray-500 text-xs mt-3">
                {guests.length} guest{guests.length !== 1 ? 's' : ''} added
              </p>
            )}
          </div>

          {/* Artwork */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Image className="w-4 h-4 text-sky-400" />
              Invite Artwork (IPFS URL)
            </label>
            <input
              type="url"
              value={formData.artwork}
              onChange={(e) => setFormData({ ...formData, artwork: e.target.value })}
              placeholder="https://ipfs.io/ipfs/..."
              className="w-full bg-dark-700 border border-white/20 rounded-lg px-4 py-3 focus:border-sky-500 focus:outline-none transition-colors"
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
                className="w-5 h-5 rounded border-white/20 bg-dark-700 text-sky-500 focus:ring-sky-500"
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
