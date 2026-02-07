"use client";

import { useState } from "react";

const occasions = [
  "Casual Day Out",
  "Business Meeting",
  "Date Night",
  "Wedding Guest",
  "Job Interview",
  "Beach Day",
  "Workout",
  "Party",
];

const seasons = ["Spring", "Summer", "Fall", "Winter"];

export default function OutfitsPage() {
  const [occasion, setOccasion] = useState("");
  const [season, setSeason] = useState("");
  const [style, setStyle] = useState("");
  const [outfitIdeas, setOutfitIdeas] = useState("");
  const [loading, setLoading] = useState(false);

  const getOutfitIdeas = async () => {
    if (!occasion) return;

    setLoading(true);
    try {
      const prompt = `Give me 3 complete outfit ideas for a ${occasion.toLowerCase()}${
        season ? ` in ${season.toLowerCase()}` : ""
      }${style ? `. Style preference: ${style}` : ""}. 
      
      For each outfit:
      1. List specific clothing items (top, bottom, shoes, accessories)
      2. Suggest colors that work well together
      3. Add a styling tip
      
      Keep it practical and fashionable.`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setOutfitIdeas(data.recommendation || "Unable to generate ideas.");
    } catch (error) {
      console.error(error);
      setOutfitIdeas("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Outfit Ideas
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Get AI-powered outfit suggestions for any occasion
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-6">
            {/* Occasion Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                What&apos;s the occasion?
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setOccasion(occ)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      occasion === occ
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Season Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Season (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeason(season === s ? "" : s)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      season === s
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Style preference (optional)
              </label>
              <input
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="e.g., minimalist, bohemian, streetwear, elegant..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={getOutfitIdeas}
              disabled={!occasion || loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating Ideas...
                </span>
              ) : (
                "Get Outfit Ideas"
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {outfitIdeas && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">👗</span> Your Outfit Ideas
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {outfitIdeas}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
