import clsx from 'clsx'

interface SectionCardProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export default function SectionCard({ title, subtitle, actions, className, children }: SectionCardProps) {
  return (
    <section className={clsx('card page-section p-5 md:p-6', className)}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-700/30 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100 md:text-xl">{title}</h2>
          {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}
