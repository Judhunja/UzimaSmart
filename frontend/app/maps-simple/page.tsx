export default function MapsPage() {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          🌍 Interactive Maps
        </h1>
        <p className="text-xl text-green-600 mb-8">
          Kenyan Climate Map (Under Development)
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          🗺️ Maps page loaded successfully
        </div>
        <div className="mt-6 space-y-2">
          <a href="/" className="block text-green-600 hover:text-green-800">
            ← Back to Home
          </a>
          <a href="/test" className="block text-green-600 hover:text-green-800">
            → Go to Test Page
          </a>
        </div>
        <div className="mt-8 text-sm text-green-600">
          <p>The Leaflet map with Kenya county boundaries will be loaded here.</p>
          <p>Currently showing a simple placeholder while debugging connection issues.</p>
        </div>
      </div>
    </div>
  )
}
