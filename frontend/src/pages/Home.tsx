import React, { useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  LinkIcon,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";

type InputType = "text" | "file" | "link";

const API_URL = "http://127.0.0.1:5000";

export default function Home() {
  const [inputType, setInputType] = useState<InputType>("text");
  const [article, setArticle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [counterArgument, setCounterArgument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  // --------------------------
  // HANDLERS
  // --------------------------

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value);
    setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(selected.type)) {
      setError("Invalid file. Use PDF, Word, or TXT.");
      return;
    }

    setFile(selected);
    setError("");
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    setError("");
  };

  // --------------------------
  // SUBMISSION
  // --------------------------

  const handleSubmit = async () => {
    setError("");

    if (inputType === "text" && !article.trim())
      return setError("Please enter a news article.");
    if (inputType === "file" && !file)
      return setError("Please upload a document.");
    if (inputType === "link" && !link.trim())
      return setError("Please enter a valid URL.");

    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 8));
    }, 180);

    try {
      let response;

      if (inputType === "text") {
        response = await axios.post(`${API_URL}/predict`, { article });
      } else if (inputType === "file") {
        const fd = new FormData();
        if (file) fd.append("file", file);
        response = await axios.post(`${API_URL}/predict-file`, fd);
      } else {
        response = await axios.post(`${API_URL}/predict-url`, { url: link });
      }

      clearInterval(interval);
      setProgress(100);

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
      setCounterArgument(response.data.counterArgument || "");
    } catch (err) {
      clearInterval(interval);
      console.log(err);
      setError("FastAPI backend unreachable. Please start the server.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setProgress(0), 700);
    }
  };

  // --------------------------
  // CONFIDENCE TEXT
  // --------------------------

  const getExplanation = () => {
    if (confidence >= 90) return "The model is highly confident.";
    if (confidence >= 70) return "The model has good confidence.";
    if (confidence >= 50) return "Moderate confidence. Double-check the sources.";
    return "Low confidence. Please verify using credible sources.";
  };

  // --------------------------
  // RENDER
  // --------------------------

  return (
    <div className="min-h-screen bg-[#fcf8ef] animate-fade-in">
      <div className="container mx-auto px-4 py-10 max-w-4xl">

        {/* PAGE TITLE */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#111] flex justify-center items-center gap-2 animate-slide-down">
            <Sparkles className="w-8 h-8 text-yellow-600" />
            Unmask the Truth
            <Sparkles className="w-8 h-8 text-yellow-600" />
          </h1>
          <p className="text-gray-600 mt-3">
            AI-powered fake news detection trained on political & societal news.
          </p>
        </header>

        {/* DATASET GUIDANCE CARD */}
        <div className="bg-yellow-50 border border-yellow-300 p-5 rounded-xl mb-8 shadow-sm animate-zoom-in">
          <h2 className="flex items-center gap-2 font-semibold text-yellow-900 mb-2">
            <Info className="w-5 h-5" /> What kind of news can this AI analyze?
          </h2>

          <p className="text-sm text-yellow-900 leading-relaxed">
            This model was trained on <b>127,000+ political and societal news</b>
            from U.S. media. It works best with:
            <br /><br />
            ✔ Government, elections, public policies  
            ✔ Trump / Obama / Clinton news  
            ✔ FBI, CIA, White House, U.S. agencies  
            ✔ Social issues & public administration  
            <br /><br />
            🚫 Not recommended:
            astronomy, medicine, science fiction, extreme hoaxes, sports.
          </p>
        </div>

        {/* INPUT SELECTOR */}
        <div className="flex gap-2 bg-gray-200 p-1 rounded-lg shadow-inner">
          {[
            { type: "text", label: "Text", icon: FileText },
            { type: "file", label: "File", icon: Upload },
            { type: "link", label: "Link", icon: LinkIcon },
          ].map((btn) => (
            <button
              key={btn.type}
              onClick={() => setInputType(btn.type as InputType)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${
                inputType === btn.type
                  ? "bg-white shadow-lg font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>

        {/* INPUT BOX */}
        <div className="mt-6 space-y-4 animate-fade-in">
          {inputType === "text" && (
            <textarea
              value={article}
              onChange={handleChange}
              placeholder="Paste a political or societal article here..."
              rows={8}
              className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-black bg-white"
            />
          )}

          {inputType === "file" && (
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="w-full p-4 border rounded-xl shadow-sm bg-white"
            />
          )}

          {inputType === "link" && (
            <input
              type="url"
              value={link}
              onChange={handleLinkChange}
              placeholder="https://news-website/article"
              className="w-full p-4 border rounded-xl shadow-sm bg-white"
            />
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2 animate-shake">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full mt-6 py-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-900 transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Check Article"}
        </button>

        {/* LOADING BAR */}
        {isLoading && (
          <div className="w-full h-2 bg-gray-200 mt-3 rounded-full overflow-hidden animate-fade-in">
            <div
              className="h-full bg-black transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* RESULT */}
        {prediction && (
          <div className="mt-10 p-6 bg-white border border-gray-300 rounded-xl shadow-xl animate-slide-up">
            <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>

            <div className="flex items-center gap-3 mb-2">
              {prediction === "Fake News" ? (
                <AlertCircle className="text-red-600 w-6 h-6" />
              ) : (
                <CheckCircle2 className="text-green-600 w-6 h-6" />
              )}
              <span className="font-bold">{prediction}</span>
              <span className="text-gray-600">Confidence: {confidence}%</span>
            </div>

            <p className="mt-2 text-gray-700">{getExplanation()}</p>

            {prediction === "Fake News" && counterArgument && (
              <p className="mt-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
                {counterArgument}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
