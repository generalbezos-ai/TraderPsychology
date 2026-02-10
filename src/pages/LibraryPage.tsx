import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import SectionCard from '../components/SectionCard'
import { libraryTracks, mindsetQuotes } from '../lib/sampleData'
import { useAppState } from '../lib/state'

const categories = ['All', 'Breathwork', 'Visualization', 'Self-Talk', 'Recovery'] as const
const ambientPresets = ['Focus Rain', 'Deep Space', 'Cafe Lo-Fi'] as const

export default function LibraryPage() {
  const { state, toggleFavoriteTrack } = useAppState()
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>('All')
  const [nowPlaying, setNowPlaying] = useState<string | null>(null)
  const [volume, setVolume] = useState(65)
  const [ambient, setAmbient] = useState<(typeof ambientPresets)[number]>('Focus Rain')

  const tracks =
    activeCategory === 'All' ? libraryTracks : libraryTracks.filter((t) => t.category === activeCategory)

  const playingTrack = useMemo(() => libraryTracks.find((t) => t.id === nowPlaying), [nowPlaying])

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Mental Conditioning"
        title="Mindset library"
        subtitle="Structured audio to regulate state, sharpen attention, and stay coachable."
      />

      <SectionCard title="Audio player">
        <p className="text-sm text-slate-300">{playingTrack ? `Now playing: ${playingTrack.title}` : 'Select a track to play'}</p>
        <div className="mt-2 grid md:grid-cols-3 gap-2">
          <label className="text-xs text-slate-400">Master volume {volume}%
            <input type="range" className="w-full" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
          </label>
          <label className="text-xs text-slate-400">Ambient preset
            <select className="app-input mt-1" value={ambient} onChange={(e) => setAmbient(e.target.value as (typeof ambientPresets)[number])}>
              {ambientPresets.map((preset) => <option key={preset}>{preset}</option>)}
            </select>
          </label>
          <div className="text-xs text-slate-400 rounded-lg border border-slate-700/50 p-2">Offline-ready: recently played tracks are cached when service worker is active.</div>
        </div>
      </SectionCard>

      <SectionCard title="Categories">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`app-button ${activeCategory === category ? 'app-button-primary' : 'app-button-muted'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Audio Tracks">
          {tracks.length === 0 ? (
            <EmptyState title="No tracks in this category" description="Try another category or add fresh content to expand your toolkit." />
          ) : (
            <ul className="space-y-2">
              {tracks.map((track) => {
                const favorite = state.favoriteLibraryIds.includes(track.id)
                return (
                  <li key={track.id} className="flex items-center justify-between rounded-lg border border-slate-700/50 p-3">
                    <div>
                      <p>{track.title}</p>
                      <p className="text-xs text-slate-400">
                        {track.category} • {track.lengthMin}m • {track.narrator}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="app-button app-button-muted" onClick={() => setNowPlaying(track.id)} aria-label={`Play ${track.title}`}>Play</button>
                      <button className="app-button app-button-muted" aria-label={`Toggle favorite for ${track.title}`} onClick={() => toggleFavoriteTrack(track.id)}>
                        {favorite ? '★' : '☆'}
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
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
