'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Users, QrCode, CheckCircle, ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: 'Beautiful NFT Invites',
      description: 'Create stunning, customizable NFT invitations that your guests will treasure forever.'
    },
    {
      icon: Users,
      title: 'Seamless RSVP',
      description: 'Track RSVPs in real-time with on-chain verification. No more scattered responses.'
    },
    {
      icon: QrCode,
      title: 'Instant Check-In',
      description: 'QR code scanning for instant event check-in. Know exactly who\'s arrived.'
    },
    {
      icon: CheckCircle,
      title: 'Proof of Attendance',
      description: 'Guests receive a verifiable proof of attendance as a lasting memento.'
    }
  ]

  const steps = [
    { number: '01', title: 'Create Event', description: 'Set up your event with custom details and artwork' },
    { number: '02', title: 'Mint Invites', description: 'Automatically mint NFT invitations for your guests' },
    { number: '03', title: 'Send & Track', description: 'Send via email or SMS and track RSVPs in real-time' },
    { number: '04', title: 'Check In', description: 'Scan QR codes for instant, verified check-in' }
  ]

  if (!mounted) return null

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-gold-500/5 blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ top: '10%', left: '10%' }}
          />
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-gold-500/3 blur-3xl"
            animate={{ 
              x: [0, -80, 0],
              y: [0, 80, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            style={{ bottom: '20%', right: '15%' }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-8">
              🎉 The Future of Event Invitations
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your{' '}
              <span className="gold-text">Event Invitations</span>
              {' '}Into Collectibles
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Create beautiful NFT invitations that live forever on the blockchain. 
              Track RSVPs, verify attendance, and give your guests something truly special.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-event">
                <button className="btn-primary text-lg inline-flex items-center gap-2">
                  Create Your Event
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/events">
                <button className="btn-secondary text-lg">
                  View Demo
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { value: '10K+', label: 'Events Created' },
              { value: '500K+', label: 'NFT Invites' },
              { value: '99.9%', label: 'Uptime' },
              { value: '$0.001', label: 'Gas Fee' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gold-text mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gold-text">Invite Me NFT</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Modern event management meets Web3 innovation. Everything you need to create unforgettable events.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gold-text">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Four simple steps to revolutionize your event invitations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-8xl font-bold text-gold-500/10 absolute -top-4 -left-2">
                  {step.number}
                </div>
                <div className="relative pt-8 pl-4">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gold-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Loved by <span className="gold-text">Event Planners</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Wedding Planner',
                text: 'Invite Me NFT transformed how my clients receive invitations. The blockchain verification is brilliant!'
              },
              {
                name: 'Marcus Johnson',
                role: 'Tech Conference Organizer',
                text: 'The QR check-in saved us hours. We knew exactly who was there in real-time. Game changer.'
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                className="card p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="card p-12 gold-glow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="gold-text">Transform</span> Your Events?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of event planners who are already using Invite Me NFT 
              to create unforgettable experiences.
            </p>
            <Link href="/create-event">
              <button className="btn-primary text-lg inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
