export default function BreathingCircle({ phase, seconds }: { phase: string; seconds: number }) {
  return (
    <div className="relative mx-auto my-4 w-48 h-48">
      <div className="absolute inset-0 rounded-full border border-cyan-300/40 pulse-ring" />
      <div className="absolute inset-5 rounded-full bg-cyan-500/15 border border-cyan-300/60 flex flex-col items-center justify-center text-center">
        <p className="text-cyan-200 font-semibold">{phase}</p>
        <p className="text-4xl font-bold">{seconds}</p>
      </div>
    </div>
  )
}
