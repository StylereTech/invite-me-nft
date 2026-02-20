'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { Calendar, MapPin, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

// Mock data
const mockInvite = {
  tokenId: '12345',
  event: {
    name: "John's Birthday Party",
    date: new Date('2026-07-15T19:00:00Z'),
    location: '123 Main St, New York, NY'
  },
  status: 'pending',
  rsvpDate: null,
  checkInDate: null
}

export default function InvitePage() {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isRsvping, setIsRsvping] = useState(false)
  const [invite, setInvite] = useState<typeof mockInvite | null>(null)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setInvite(mockInvite)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleRsvp = async (accepted: boolean) => {
    setIsRsvping(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setInvite({
      ...invite!,
      status: accepted ? 'accepted' : 'declined',
      rsvpDate: new Date()
    })
    setIsRsvping(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invite Not Found</h1>
          <p className="text-gray-400">This invite doesn't exist or has been revoked.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Event Card */}
        <div className="card overflow-hidden mb-6">
          {/* Artwork Header */}
          <div className="h-48 bg-gradient-to-br from-gold-500/20 to-gold-600/5 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-2">🎉</div>
              <div className="text-gold-500 font-semibold">You're Invited!</div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{invite.event.name}</h1>
            
            <div className="space-y-3 text-gray-300 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gold-500" />
                <span>{format(invite.event.date, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold-500" />
                <span>{format(invite.event.date, 'h:mm a')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gold-500" />
                <span>{invite.event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RSVP Section */}
        {invite.status === 'pending' ? (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Will you attend?</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleRsvp(true)}
                disabled={isRsvping}
                className="flex-1 btn-primary py-4 flex items-center justify-center gap-2"
              >
                {isRsvping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Accept
                  </>
                )}
              </button>
              <button
                onClick={() => handleRsvp(false)}
                disabled={isRsvping}
                className="flex-1 btn-secondary py-4 flex items-center justify-center gap-2"
              >
                {isRsvping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Decline
                  </>
                )}
              </button>
            </div>
          </div>
        ) : invite.status === 'accepted' ? (
          <div className="card p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-green-400">You're Going!</h2>
              <p className="text-gray-400">See you at the event</p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg inline-block mx-auto">
              <QRCodeSVG 
                value={invite.tokenId}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Show this QR code at the entrance for check-in
            </p>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-red-400">Can't Make It</h2>
            <p className="text-gray-400">We've noted your response</p>
          </div>
        )}
      </div>
    </div>
  )
}
