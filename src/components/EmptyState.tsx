import { Sparkles } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-600/70 bg-slate-950/30 p-5 text-center">
      <Sparkles className="mx-auto mb-2 text-violet-300" size={18} aria-hidden="true" />
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
