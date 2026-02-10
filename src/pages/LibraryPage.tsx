import { useState } from 'react'
import SectionCard from '../components/SectionCard'
import { libraryTracks, mindsetQuotes } from '../lib/sampleData'
import { useAppState } from '../lib/state'

const categories = ['All', 'Breathwork', 'Visualization', 'Self-Talk', 'Recovery'] as const

export default function LibraryPage() {
  const { state, toggleFavoriteTrack } = useAppState()
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')

  const tracks =
    activeCategory === 'All' ? libraryTracks : libraryTracks.filter((t) => t.category === activeCategory)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mental Library</h1>

      <SectionCard title="Categories">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 rounded ${activeCategory === category ? 'bg-violet-600' : 'bg-slate-800'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Audio Players">
          <ul className="space-y-2">
            {tracks.map((track) => {
              const favorite = state.favoriteLibraryIds.includes(track.id)
              return (
                <li key={track.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 p-2">
                  <div>
                    <p>{track.title}</p>
                    <p className="text-xs text-slate-400">
                      {track.category} • {track.lengthMin}m • {track.narrator}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-cyan-300">Play</button>
                    <button className="text-amber-300" onClick={() => toggleFavoriteTrack(track.id)}>
                      {favorite ? '★' : '☆'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>

        <SectionCard title="Mindset Vault">
          <ul className="space-y-2 text-slate-200">
            {mindsetQuotes.map((quote) => (
              <li key={quote}>“{quote}”</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
