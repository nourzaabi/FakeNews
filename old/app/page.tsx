"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { AlertCircle, CheckCircle2, Loader2, Upload, LinkIcon, FileText, Sparkles, TrendingUp } from "lucide-react"

type InputType = "text" | "file" | "link"

export default function Home() {
  const [inputType, setInputType] = useState<InputType>("text")
  const [article, setArticle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [link, setLink] = useState("")
  const [prediction, setPrediction] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [counterArgument, setCounterArgument] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value)
    if (error) setError("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        if (error) setError("")
      } else {
        setError("Please upload a valid file (PDF, Word, or Text)")
      }
    }
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
    if (error) setError("")
  }

  const handleSubmit = async () => {
    if (inputType === "text" && !article.trim()) {
      setError("Please paste a news article to check.")
      return
    }
    if (inputType === "file" && !file) {
      setError("Please upload a file to check.")
      return
    }
    if (inputType === "link" && !link.trim()) {
      setError("Please enter a URL to check.")
      return
    }

    setIsLoading(true)
    setError("")
    setPrediction("")
    setProgress(0)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + 10
      })
    }, 200)

    try {
      let response
      if (inputType === "text") {
        response = await axios.post("http://localhost:5000/predict", { article })
      } else if (inputType === "file") {
        const formData = new FormData()
        formData.append("file", file!)
        response = await axios.post("http://localhost:5000/predict-file", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        response = await axios.post("http://localhost:5000/predict-url", { url: link })
      }

      clearInterval(progressInterval)
      setProgress(100)

      setPrediction(response.data.prediction)
      setConfidence(response.data.confidence)
      if (response.data.prediction === "Fake News") {
        setCounterArgument(response.data.counterArgument)
      } else {
        setCounterArgument("")
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error("Error:", error)
      setError(
        "An error occurred while processing your request. Please ensure the backend server is running and try again.",
      )
    } finally {
      setIsLoading(false)
      setTimeout(() => setProgress(0), 500)
    }
  }

  const getExplanation = () => {
    if (confidence >= 90) {
      return "The model is highly confident in this prediction."
    } else if (confidence >= 70) {
      return "The model has good confidence in this prediction."
    } else if (confidence >= 50) {
      return "The model has moderate confidence. Consider verifying with additional sources."
    } else {
      return "The model has low confidence. Please verify with multiple reliable sources."
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Unmask the Truth</h1>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg md:text-xl">Verify the authenticity of news articles using AI</p>
          <div className="flex justify-center gap-8 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Fast Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">AI-Powered</span>
            </div>
          </div>
        </header>

        <main className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setInputType("text")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all duration-300 ${
                inputType === "text"
                  ? "bg-background text-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <FileText className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setInputType("file")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all duration-300 ${
                inputType === "file"
                  ? "bg-background text-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <Upload className="w-4 h-4" />
              File
            </button>
            <button
              onClick={() => setInputType("link")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-medium transition-all duration-300 ${
                inputType === "link"
                  ? "bg-background text-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Link
            </button>
          </div>

          <div className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-500">
            {inputType === "text" && (
              <>
                <label htmlFor="article" className="text-sm font-medium text-foreground">
                  Paste your news article below
                </label>
                <textarea
                  id="article"
                  className="w-full p-4 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-300 hover:shadow-md"
                  rows={8}
                  placeholder="Paste the news article here to check its authenticity..."
                  value={article}
                  onChange={handleChange}
                />
              </>
            )}

            {inputType === "file" && (
              <>
                <label htmlFor="file" className="text-sm font-medium text-foreground">
                  Upload a document (PDF, Word, or Text)
                </label>
                <div className="relative">
                  <input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-border rounded-lg bg-card hover:bg-accent hover:border-primary cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mb-3 group-hover:text-primary transition-colors duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium text-foreground mb-1">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                    <span className="text-xs text-muted-foreground">PDF, Word, or Text files</span>
                  </label>
                </div>
              </>
            )}

            {inputType === "link" && (
              <>
                <label htmlFor="link" className="text-sm font-medium text-foreground">
                  Enter article URL
                </label>
                <input
                  id="link"
                  type="url"
                  className="w-full p-4 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="https://example.com/article"
                  value={link}
                  onChange={handleLinkChange}
                />
              </>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 border border-destructive/50 bg-destructive/10 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? "Analyzing..." : "Check Article"}
          </button>

          {isLoading && (
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden animate-in fade-in duration-300">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {prediction && (
            <div className="mt-8 p-6 border border-border rounded-lg bg-card space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-lg transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Prediction Result</h3>
                <div className="flex items-center gap-2 mb-3 animate-in zoom-in duration-500">
                  {prediction === "Fake News" ? (
                    <AlertCircle className="w-5 h-5 text-destructive animate-pulse" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 animate-bounce" />
                  )}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      prediction === "Fake News"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-green-500/10 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {prediction}
                  </span>
                  <span className="text-muted-foreground text-sm">Confidence: {confidence}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ease-out ${
                      prediction === "Fake News" ? "bg-destructive" : "bg-green-500"
                    }`}
                    style={{ width: `${confidence}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{getExplanation()}</p>
              </div>

              {prediction === "Fake News" && counterArgument && (
                <div className="pt-4 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                  <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors duration-300">
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Counter Argument
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{counterArgument}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">Unmask - Powered by AI to fight misinformation</p>
        </footer>
      </div>
    </div>
  )
}
