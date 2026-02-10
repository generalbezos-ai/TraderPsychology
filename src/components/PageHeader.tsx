interface PageHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, eyebrow, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300/90">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-balance text-slate-100 md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
