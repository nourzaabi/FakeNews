import React from 'react'
import { Shield, Zap, Users, Target, Heart, Lightbulb } from 'lucide-react'

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">About Unmask</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fighting misinformation with the power of artificial intelligence
          </p>
        </div>

        <div className="space-y-12">
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <img src="/team-collaboration-on-ai-technology-with-diverse-p.jpg" alt="Team collaboration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-semibold text-foreground">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              In today's digital age, misinformation spreads faster than ever. Unmask was created to empower people with
              the tools they need to verify news authenticity and make informed decisions. We believe everyone deserves
              access to the truth.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI-powered platform analyzes news articles in seconds, helping you distinguish between credible
              information and fake news. Whether you're a student, journalist, or concerned citizen, Unmask is here to
              help you navigate the complex world of online information.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-700 delay-150 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-semibold text-foreground">What We Do</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Instant Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get real-time predictions on whether an article is fake or authentic
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Confidence Scores</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand how certain our AI is about each prediction
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Counter-Arguments</h3>
                  <p className="text-sm text-muted-foreground">
                    When fake news is detected, we provide context and alternative perspectives
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-300 group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Multiple Input Methods</h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze text, upload documents, or check articles via URL
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-semibold text-foreground">Meet the Team</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Unmask was built by a dedicated team of data scientists passionate about fighting misinformation and
              making AI accessible to everyone.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group">
                <div className="bg-muted/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <img src="/professional-portrait-of-data-scientist-rayen.jpg" alt="Rayen Bouallegue" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">Rayen Bouallegue</h3>
                    <p className="text-sm text-muted-foreground">Model Training & Data Processing</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-muted/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <img src="/professional-portrait-of-data-scientist-sarra.jpg" alt="Sarra Mzali" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">Sarra Mzali</h3>
                    <p className="text-sm text-muted-foreground">Backend Development & Infrastructure</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-muted/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <img src="/professional-portrait-of-data-scientist-nour.jpg" alt="Nour El Houda Zaabi" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">Nour El Houda Zaabi</h3>
                    <p className="text-sm text-muted-foreground">Frontend Development & UX</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="bg-muted/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative w-full h-48">
                    <img src="/professional-portrait-of-data-scientist-mohamed-sl.jpg" alt="Mohamed Slim Chouaib" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1">Mohamed Slim Chouaib</h3>
                    <p className="text-sm text-muted-foreground">Project Lead & Integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-semibold text-foreground">Why Trust Unmask?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Our platform uses state-of-the-art artificial intelligence trained on thousands of verified news articles.
              While no system is perfect, we're constantly improving our models to provide you with the most accurate
              predictions possible.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-muted-foreground italic">
                <strong className="text-foreground">Remember:</strong> Unmask is a tool to assist your judgment, not
                replace it. Always think critically and verify important information from multiple reliable sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
