import clsx from 'clsx'

interface Props {
  phase: string
  seconds: number
  variant?: 'focus' | 'calm' | 'emergency'
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  focus: 'border-cyan-300/60 bg-cyan-500/15 text-cyan-100',
  calm: 'border-violet-300/60 bg-violet-500/15 text-violet-100',
  emergency: 'border-red-300/70 bg-red-500/20 text-red-100',
}

export default function BreathingCircle({ phase, seconds, variant = 'focus' }: Props) {
  return (
    <div className="relative mx-auto my-4 size-48">
      <div className={clsx('absolute inset-0 rounded-full breathing-ring', variant === 'emergency' ? 'ring-fast' : 'ring-slow')} />
      <div
        className={clsx(
          'absolute inset-5 rounded-full border flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(59,130,246,0.18)]',
          variantClasses[variant],
        )}
      >
        <p className="text-sm tracking-wide uppercase opacity-90">{phase}</p>
        <p className="text-4xl font-bold">{seconds}</p>
      </div>
    </div>
  )
}
