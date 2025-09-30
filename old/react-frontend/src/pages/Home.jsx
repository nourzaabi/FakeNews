"use client"

import { useState } from "react"
import { FileText, LinkIcon, Type, Upload, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function Home() {
  const [inputType, setInputType] = useState("text")
  const [textInput, setTextInput] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ]
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Please upload a PDF, Word document, or text file")
        setFile(null)
      }
    }
  }

  const analyzeContent = async () => {
    setError("")
    setResult(null)
    setLoading(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      let response

      if (inputType === "text") {
        if (!textInput.trim()) {
          throw new Error("Please enter some text to analyze")
        }
        response = await fetch("/api/predict/text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
        })
      } else if (inputType === "file") {
        if (!file) {
          throw new Error("Please select a file to analyze")
        }
        const formData = new FormData()
        formData.append("file", file)
        response = await fetch("/api/predict/file", {
          method: "POST",
          body: formData,
        })
      } else if (inputType === "url") {
        if (!urlInput.trim()) {
          throw new Error("Please enter a URL to analyze")
        }
        response = await fetch("/api/predict/url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput }),
        })
      }

      clearInterval(progressInterval)
      setProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
      clearInterval(progressInterval)
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const getResultIcon = () => {
    if (!result) return null
    if (result.prediction === "REAL") {
      return <CheckCircle className="w-12 h-12 text-green-600" />
    }
    return <XCircle className="w-12 h-12 text-red-600" />
  }

  const getResultColor = () => {
    if (!result) return ""
    return result.prediction === "REAL" ? "border-green-500" : "border-red-500"
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">
          Verify the authenticity of news articles using AI
        </h1>
        <p className="text-lg text-muted-foreground text-pretty">
          Paste your news article, upload a document, or provide a link below
        </p>
      </div>

      {/* Input Type Tabs */}
      <div className="flex gap-2 mb-6 bg-card p-2 rounded-lg border border-border">
        <button
          onClick={() => setInputType("text")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            inputType === "text"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-secondary"
          }`}
        >
          <Type className="w-5 h-5" />
          <span className="hidden sm:inline">Text</span>
        </button>
        <button
          onClick={() => setInputType("file")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            inputType === "file"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-secondary"
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="hidden sm:inline">File</span>
        </button>
        <button
          onClick={() => setInputType("url")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
            inputType === "url"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-primary hover:bg-secondary"
          }`}
        >
          <LinkIcon className="w-5 h-5" />
          <span className="hidden sm:inline">URL</span>
        </button>
      </div>

      {/* Input Area */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm hover:shadow-md transition-shadow">
        {inputType === "text" && (
          <div className="animate-fade-in">
            <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
              Enter news article text
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your news article here..."
              className="w-full h-48 px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
            />
          </div>
        )}

        {inputType === "file" && (
          <div className="animate-fade-in">
            <label htmlFor="file-input" className="block text-sm font-medium text-foreground mb-2">
              Upload document (PDF, Word, or Text)
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-input"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-input rounded-lg cursor-pointer bg-background hover:bg-secondary/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT</p>
                  {file && <p className="mt-2 text-sm text-primary font-medium">{file.name}</p>}
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}

        {inputType === "url" && (
          <div className="animate-fade-in">
            <label htmlFor="url-input" className="block text-sm font-medium text-foreground mb-2">
              Enter article URL
            </label>
            <input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
        )}

        <button
          onClick={analyzeContent}
          disabled={loading}
          className="w-full mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze Content"
          )}
        </button>

        {loading && (
          <div className="mt-4 animate-fade-in">
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">Processing your content...</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className={`bg-card rounded-lg border-2 ${getResultColor()} p-6 shadow-lg animate-fade-in`}>
          <div className="flex items-center gap-4 mb-6">
            {getResultIcon()}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {result.prediction === "REAL" ? "Likely Authentic" : "Potentially Fake"}
              </h2>
              <p className="text-muted-foreground">Analysis complete</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-foreground">Confidence Score</span>
                <span className="text-sm font-bold text-foreground">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    result.prediction === "REAL" ? "bg-green-600" : "bg-red-600"
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>

            {result.counter_argument && (
              <div className="bg-secondary/50 rounded-md p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Counter-Argument Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.counter_argument}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-4 border-t border-border">
              <p>
                This analysis is powered by AI and should be used as a guide. Always verify information from multiple
                trusted sources.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
