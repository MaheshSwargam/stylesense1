"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

const occasions = ["Casual", "Formal", "Wedding", "Festival", "Office", "Date Night", "Party"];

export default function EvaluatePage() {
  const { user } = useUser();
  const [outfitDescription, setOutfitDescription] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("Casual");
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    educational: string;
  } | null>(null);

  const evaluateOutfit = async () => {
    if (!outfitDescription.trim()) return;

    setLoading(true);
    const gender = user?.gender || "unisex";
    const genderText = gender === "male" ? "men" : gender === "female" ? "women" : "anyone";

    try {
      const prompt = `Evaluate this outfit for ${genderText} attending a ${selectedOccasion.toLowerCase()} occasion:

"${outfitDescription}"

Please provide a structured evaluation in this EXACT format:

SCORE: [Give a score out of 10]

STRENGTHS:
- [Strength 1]
- [Strength 2]
- [Strength 3]

IMPROVEMENTS:
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

SUGGESTIONS:
- [Specific suggestion 1]
- [Specific suggestion 2]
- [Specific suggestion 3]

EDUCATIONAL INSIGHT:
[One paragraph about fashion principles demonstrated or needed]

Be specific, constructive, and encouraging.`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const text = data.recommendation || "";

      // Parse the response
      const scoreMatch = text.match(/SCORE:\s*(\d+(?:\.\d+)?)/i);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 7.5;

      const extractList = (section: string) => {
        const regex = new RegExp(`${section}:([\\s\\S]*?)(?=(?:STRENGTHS|IMPROVEMENTS|SUGGESTIONS|EDUCATIONAL|$))`, 'i');
        const match = text.match(regex);
        if (match) {
          return match[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
        }
        return [];
      };

      const educationalMatch = text.match(/EDUCATIONAL INSIGHT:([\\s\\S]*?)$/i);

      setEvaluation({
        score: Math.min(10, Math.max(0, score)),
        strengths: extractList('STRENGTHS').slice(0, 4),
        improvements: extractList('IMPROVEMENTS').slice(0, 4),
        suggestions: extractList('SUGGESTIONS').slice(0, 4),
        educational: educationalMatch ? educationalMatch[1].trim() : "Great effort! Keep experimenting with different styles.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              ⭐ Outfit Evaluator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Describe your outfit and get AI-powered feedback with improvement suggestions.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Describe your outfit
              </label>
              <textarea
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
                placeholder="e.g., I'm wearing a navy blue blazer with a white button-down shirt, khaki chinos, brown leather belt, and oxford shoes..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedOccasion === occ
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={evaluateOutfit}
              disabled={!outfitDescription.trim() || loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Evaluating...
                </span>
              ) : (
                "⭐ Evaluate Outfit with AI"
              )}
            </button>
          </div>
        </div>

        {/* Evaluation Result */}
        {evaluation && !loading && (
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
                <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-purple-600">{evaluation.score.toFixed(1)}</span>
                  <span className="text-gray-500">/10</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Style Score</h3>
            </div>

            {/* Strengths, Improvements, Suggestions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                  ✅ Strengths
                </h3>
                <ul className="space-y-2">
                  {evaluation.strengths.map((s, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center gap-2">
                  ⚠️ Improvements
                </h3>
                <ul className="space-y-2">
                  {evaluation.improvements.map((s, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-yellow-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                  💡 Suggestions
                </h3>
                <ul className="space-y-2">
                  {evaluation.suggestions.map((s, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-blue-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Educational Insight */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-l-4 border-purple-500">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                🎓 Educational Insight
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{evaluation.educational}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
