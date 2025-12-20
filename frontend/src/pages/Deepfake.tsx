import React, { useState } from "react";
import axios from "axios";
import {
    AlertCircle,
    CheckCircle2,
    Loader2,
    Upload,
    Video,
    Image as ImageIcon,
    Info,
    ShieldCheck,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

export default function Deepfake() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prediction, setPrediction] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        // Type checking
        const isImage = selected.type.startsWith("image/");
        const isVideo = selected.type.startsWith("video/");

        if (!isImage && !isVideo) {
            setError("Invalid file. Please upload an image or video.");
            return;
        }

        setFile(selected);
        setError("");
        setPrediction("");

        // Create preview
        if (isImage) {
            const objectUrl = URL.createObjectURL(selected);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        setError("");

        if (!file)
            return setError("Please upload an image or video.");

        setIsLoading(true);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? prev : prev + 5));
        }, 200);

        try {
            const fd = new FormData();
            fd.append("file", file);

            const response = await axios.post(`${API_URL}/predict-deepfake`, fd);

            clearInterval(interval);
            setProgress(100);

            if (response.data.error) {
                setError(response.data.error);
            } else {
                setPrediction(response.data.prediction);
                setConfidence(response.data.confidence);
            }

        } catch (err) {
            clearInterval(interval);
            console.log(err);
            setError("Backend unreachable or error processing file.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setProgress(0), 1000);
        }
    };

    const getExplanation = () => {
        if (prediction === "Fake") {
            return "Our model has detected signs indicating this content might be manipulated (Deepfake).";
        }
        return "No obvious signs of manipulation were detected by the model.";
    };

    return (
        <div className="min-h-screen bg-[#fcf8ef] animate-fade-in">
            <div className="container mx-auto px-4 py-10 max-w-4xl">

                <header className="text-center mb-10">
                    <h1 className="text-5xl font-bold text-[#111] flex justify-center items-center gap-2 animate-slide-down">
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                        Deepfake Detector
                        <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </h1>
                    <p className="text-gray-600 mt-3">
                        Advanced AI to identify manipulated images and videos.
                    </p>
                </header>

                <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-8 shadow-sm animate-zoom-in">
                    <h2 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
                        <Info className="w-5 h-5" /> Supported Formats
                    </h2>
                    <p className="text-sm text-blue-900 leading-relaxed">
                        Upload an image (<b>JPG, PNG, WEBP</b>) or a video (<b>MP4, AVI, MOV</b>).
                        <br />
                        Our model analyzes visual artifacts and inconsistencies to distinguish real content from deepfakes.
                    </p>
                </div>

                {/* INPUT BOX */}
                <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        {file ? (
                            <div className="flex flex-col items-center">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="max-h-64 rounded shadow-md mb-4" />
                                ) : (
                                    <Video className="w-16 h-16 text-gray-400 mb-4" />
                                )}
                                <p className="font-semibold text-lg">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-lg font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">Images or Videos</p>
                            </div>
                        )}
                    </div>
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
                    disabled={isLoading || !file}
                    className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Analyze Content"}
                </button>

                {/* LOADING BAR */}
                {isLoading && (
                    <div className="w-full h-2 bg-gray-200 mt-3 rounded-full overflow-hidden animate-fade-in">
                        <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                )}

                {/* RESULT */}
                {prediction && (
                    <div className="mt-10 p-6 bg-white border border-gray-300 rounded-xl shadow-xl animate-slide-up">
                        <h3 className="text-xl font-semibold mb-4">Analysis Result</h3>

                        <div className="flex items-center gap-3 mb-2">
                            {prediction === "Fake" ? (
                                <AlertCircle className="text-red-600 w-6 h-6" />
                            ) : (
                                <CheckCircle2 className="text-green-600 w-6 h-6" />
                            )}
                            <span className="font-bold text-lg">{prediction} Content</span>
                            <span className="text-gray-600">Confidence: {confidence}%</span>
                        </div>

                        <p className="mt-2 text-gray-700">{getExplanation()}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
