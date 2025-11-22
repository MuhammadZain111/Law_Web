export default function ContactHero() {
    return (
      <section className="relative bg-primary py-20 md:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.25_0_0)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.25_0_0)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
  
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
  
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium text-primary-foreground">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Platform Support
            </div>
  
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
              Get in Touch with Law Sphere
            </h1>
  
            <p className="text-lg text-primary-foreground/90 md:text-xl text-pretty">
              Connect lawyers with clients seamlessly. Our support team is here to help you navigate the platform,
              resolve issues, and make the most of LegalConnect.
            </p>
  
          </div>
        </div>
      </section>
    )
  }
  