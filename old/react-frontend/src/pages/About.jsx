import { Shield, Users, Target, Zap } from "lucide-react"

export default function About() {
  const teamMembers = [
    {
      name: "Rayen Bouallegue",
      role: "Lead Data Scientist",
      image: "/team-rayen.jpg",
      description: "Specializes in NLP and deep learning models",
    },
    {
      name: "Sarra Mzali",
      role: "ML Engineer",
      image: "/team-sarra.jpg",
      description: "Expert in model deployment and optimization",
    },
    {
      name: "Nour El Houda Zaabi",
      role: "AI Researcher",
      image: "/team-nour.jpg",
      description: "Focuses on AI ethics and bias detection",
    },
    {
      name: "Mohamed Slim Chouaib",
      role: "Full Stack Developer",
      image: "/team-mohamed.jpg",
      description: "Builds scalable AI-powered applications",
    },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">About Unmask</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
          Empowering people to distinguish truth from misinformation using cutting-edge AI technology
        </p>
      </div>

      {/* Hero Image */}
      <div className="mb-16 rounded-xl overflow-hidden shadow-xl">
        <img
          src="/team-collaboration-on-ai-technology-with-diverse-p.jpg"
          alt="Team collaboration"
          className="w-full h-64 md:h-96 object-cover"
        />
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-card rounded-lg border border-border p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            In an era of information overload, we're committed to helping people make informed decisions by providing
            instant, AI-powered verification of news content. We believe everyone deserves access to truth.
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground leading-relaxed">
            Unmask uses advanced machine learning models trained on millions of articles to analyze content patterns,
            language use, and credibility indicators. Our AI provides you with confidence scores and detailed
            explanations.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary/30 rounded-xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">Why Choose Unmask?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">Get results in seconds, not hours</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Highly Accurate</h3>
            <p className="text-sm text-muted-foreground">Trained on millions of verified articles</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">User Friendly</h3>
            <p className="text-sm text-muted-foreground">Simple interface, powerful results</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-4">Meet Our Team</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A passionate group of data scientists, engineers, and researchers dedicated to fighting misinformation
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.05] group"
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Unmask the Truth?</h2>
        <p className="text-lg mb-6 opacity-90">
          Start verifying news articles today and join thousands of users fighting misinformation
        </p>
        <a
          href="/"
          className="inline-block bg-primary-foreground text-primary px-8 py-3 rounded-md font-medium hover:opacity-90 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
        >
          Try It Now
        </a>
      </div>
    </main>
  )
}
