'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, CheckCircle, XCircle, Loader2, QrCode } from 'lucide-react'

export default function ScannerPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)

  useEffect(() => {
    // Check if camera is available
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(() => {
        setHasCamera(true)
        startCamera()
      })
      .catch(() => {
        setHasCamera(false)
      })

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
    }
  }

  const simulateScan = async () => {
    setIsProcessing(true)
    setResult(null)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Random success/fail for demo
    const success = Math.random() > 0.3
    setResult({
      success,
      message: success 
        ? 'Guest checked in successfully!'
        : 'Invalid invite or already checked in'
    })
    
    setIsProcessing(false)
  }

  const resetScanner = () => {
    setScannedCode(null)
    setResult(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Check-In <span className="gold-text">Scanner</span>
          </h1>
          <p className="text-gray-400">
            Scan guest QR codes to verify attendance
          </p>
        </div>

        {/* Camera View */}
        <div className="card overflow-hidden mb-6">
          <div className="relative aspect-square bg-dark-700">
            {hasCamera ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Camera not available</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Use manual entry below
                  </p>
                </div>
              </div>
            )}

            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-gold-500/50 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gold-500 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gold-500 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gold-500 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gold-500 rounded-br-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold-500" />
            Manual Entry
          </h3>
          <input
            type="text"
            placeholder="Enter invite token ID"
            value={scannedCode || ''}
            onChange={(e) => setScannedCode(e.target.value)}
            className="w-full bg-dark-700 border border-gold-500/20 rounded-lg px-4 py-3 mb-4 focus:border-gold-500 focus:outline-none"
          />
          <button
            onClick={simulateScan}
            disabled={!scannedCode || isProcessing}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Checking In...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Check In Guest
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className={`card p-6 ${result.success ? 'border-green-500/30' : 'border-red-500/30'}`}>
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                result.success ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${
                result.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {result.success ? 'Check-In Successful!' : 'Check-In Failed'}
              </h3>
              <p className="text-gray-400 mb-4">{result.message}</p>
              <button
                onClick={resetScanner}
                className="btn-secondary"
              >
                Scan Next Guest
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">24</div>
            <div className="text-gray-500 text-sm">Checked In</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">35</div>
            <div className="text-gray-500 text-sm">Expected</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gold-500">68%</div>
            <div className="text-gray-500 text-sm">Arrival Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
