interface PageHeaderProps {
  title: string
  subtitle: string
  eyebrow?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, eyebrow, action }: PageHeaderProps) {
  return (
    <header className="page-header page-section">
      <div>
        {eyebrow ? <p className="badge">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-slate-100 md:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  )
}
