export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-12 md:py-24 space-y-8">
      <h2 className="text-3xl font-bold tracking-tighter text-center">How It Works</h2>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4">
          <div className="text-lg font-semibold">1. Connect</div>
          <p className="text-muted-foreground">
            Securely connect to your PostgreSQL databases with SSL encryption and SSH tunneling support.
          </p>
        </div>
        <div className="space-y-4">
          <div className="text-lg font-semibold">2. Write Queries</div>
          <p className="text-muted-foreground">
            Leverage the intuitive interface to write and execute PostgreSQL queries efficiently.
          </p>
        </div>
        <div className="space-y-4">
          <div className="text-lg font-semibold">3. Manage Data</div>
          <p className="text-muted-foreground">
            Edit table data directly with full support for PostgreSQL data types, save queries, and export results.
          </p>
        </div>
      </div>
    </section>
  )
}

