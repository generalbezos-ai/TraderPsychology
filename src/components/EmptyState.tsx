import { Sparkles } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="surface-subtle rounded-2xl border-dashed p-6 text-center">
      <Sparkles className="mx-auto mb-2 text-violet-300" size={18} aria-hidden="true" />
      <p className="font-semibold text-slate-100">{title}</p>
      <p className="mt-1 text-sm text-slate-300">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
