export default function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card p-5"><h2 className="text-lg font-bold mb-3">{title}</h2>{children}</section>
}
