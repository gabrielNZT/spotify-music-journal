function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-lg p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Your music, your way
          </h1>
          <p className="text-xl mb-6 text-white/90">
            Organize your favorite tracks, add personal notes, and create custom categories. 
            All synced with your Spotify library.
          </p>
          <button className="bg-spotify-light text-spotify-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Get started
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Jump back in</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Liked Songs", count: "127 songs", color: "bg-gradient-to-br from-purple-700 to-blue-800" },
            { name: "Recently Added", count: "12 songs", color: "bg-gradient-to-br from-green-700 to-blue-700" },
            { name: "My Categories", count: "8 categories", color: "bg-gradient-to-br from-red-700 to-pink-700" }
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-spotify-surface-elevated rounded-lg p-4 hover:bg-spotify-surface-highlight transition-colors">
                <div className={`w-16 h-16 ${item.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-spotify-text-secondary">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recently played</h2>
          <button className="text-sm font-semibold text-spotify-text-secondary hover:text-spotify-text-primary">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="bg-spotify-surface-elevated rounded-lg p-4 hover:bg-spotify-surface-highlight transition-colors">
                <div className="aspect-square bg-spotify-surface-highlight rounded-lg mb-4"></div>
                <h3 className="font-semibold text-sm mb-1 truncate">Track Name {item}</h3>
                <p className="text-xs text-spotify-text-secondary truncate">Artist Name</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Categories */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your categories</h2>
          <button className="text-sm font-semibold text-spotify-text-secondary hover:text-spotify-text-primary">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {["Workout", "Chill Vibes", "Focus Music", "Party Hits"].map((category) => (
            <div key={category} className="bg-spotify-surface-elevated rounded-lg p-6 hover:bg-spotify-surface-highlight transition-colors cursor-pointer">
              <h3 className="font-bold mb-2">{category}</h3>
              <p className="text-sm text-spotify-text-secondary">12 songs</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
