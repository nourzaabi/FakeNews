export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            If you have any questions, suggestions, or feedback about the Fake News Detection App, we'd love to hear
            from you!
          </p>

          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Get in Touch</h2>
              <p className="text-muted-foreground">
                Feel free to reach out to us through any of the following channels:
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">@</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-muted-foreground">contact@fakenewsdetection.app</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">#</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">GitHub</h3>
                  <p className="text-muted-foreground">github.com/fakenews-detection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold">?</span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Support</h3>
                  <p className="text-muted-foreground">
                    For technical issues, please check our documentation or open an issue on GitHub
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-3">Contribute</h2>
            <p className="text-muted-foreground leading-relaxed">
              This is an open-source project and we welcome contributions! Whether you're interested in improving the AI
              model, enhancing the user interface, or fixing bugs, your help is appreciated. Visit our GitHub repository
              to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
