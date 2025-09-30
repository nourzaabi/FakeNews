"use client"

import { useState } from "react"
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground">Have questions or feedback? We'd love to hear from you!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Email Us</h3>
          <p className="text-muted-foreground mb-2">For general inquiries and support</p>
          <a href="mailto:contact@unmask.ai" className="text-primary hover:underline font-medium">
            contact@unmask.ai
          </a>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Feedback</h3>
          <p className="text-muted-foreground mb-2">Help us improve Unmask</p>
          <a href="mailto:feedback@unmask.ai" className="text-primary hover:underline font-medium">
            feedback@unmask.ai
          </a>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

        {submitted ? (
          <div className="text-center py-12 animate-fade-in">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
            <p className="text-muted-foreground">Thank you for contacting us. We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
