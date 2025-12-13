// CONTACT PAGE — UNMASK Fake News AI
// Version optimisée + branding + animations + cohérente avec votre plateforme

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">

        <h1 className="text-4xl font-bold text-foreground mb-6 animate-in fade-in duration-700">
          Contact the Unmask Team
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed mb-6 animate-in fade-in slide-in-from-bottom-2 delay-150">
          Have questions about our Fake News Detection AI?  
          Want to collaborate or report an issue? We're here to help.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            Get in Touch
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">@</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email</h3>
                <p className="text-muted-foreground">unmask.support@fakenews.ai</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">#</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">GitHub</h3>
                <p className="text-muted-foreground">github.com/unmask-fake-news</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold">?</span>
              </div>
              <div>
                <h3 className="font-medium text-foreground">Support & Documentation</h3>
                <p className="text-muted-foreground">
                  Find guides, API documentation, and troubleshooting tips in our knowledge center.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mt-8 shadow-md animate-in fade-in slide-in-from-bottom-4 delay-300">
          <h2 className="text-xl font-semibold text-foreground mb-3">Contribute</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unmask is an academic + open-source AI project.  
            Contributions to improve the model, UI, or backend are welcome!
          </p>
        </div>
      </div>
    </div>
  )
}
