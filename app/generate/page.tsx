"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

const occasions = ["Casual Day Out", "Business Meeting", "Date Night", "Wedding Guest", "Job Interview", "Festival", "Party", "Travel"];
const styles = ["Casual", "Formal", "Ethnic", "Fusion", "Party", "Minimalist", "Bohemian"];
const colors = ["Neutral", "Bright", "Pastel", "Earth Tones", "Jewel Tones", "Monochrome"];

export default function GeneratePage() {
  const { user } = useUser();
  const [occasion, setOccasion] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Casual");
  const [selectedColor, setSelectedColor] = useState("Neutral");
  const [customOccasion, setCustomOccasion] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfitResult, setOutfitResult] = useState("");

  const generateOutfit = async () => {
    const finalOccasion = customOccasion || occasion;
    if (!finalOccasion) return;

    setLoading(true);
    try {
      const gender = user?.gender || "unisex";
      const genderText = gender === "male" ? "men" : gender === "female" ? "women" : "anyone";
      
      const prompt = `Generate a complete outfit recommendation for ${genderText} for the following:
      
Occasion: ${finalOccasion}
Style: ${selectedStyle}
Color Preference: ${selectedColor}
${user?.preferences?.length ? `User Style Preferences: ${user.preferences.join(", ")}` : ""}

Please provide:
1. **Complete Outfit** - List each clothing item (top, bottom, footwear, accessories)
2. **Color Coordination** - Explain the color palette
3. **Styling Tips** - 2-3 specific styling tips
4. **Where to Shop** - Suggest types of stores or brands
5. **Confidence Boost** - One line to make them feel great

Keep it practical, fashionable, and culturally appropriate.`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setOutfitResult(data.recommendation || "Unable to generate outfit.");
    } catch (error) {
      console.error(error);
      setOutfitResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const genderText = user?.gender === "male" ? "Men" : user?.gender === "female" ? "Women" : "You";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              🤖 AI Outfit Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Describe your occasion and preferences. Our AI will create the perfect outfit for {genderText.toLowerCase()}.
            </p>
          </div>

          <div className="space-y-6">
            {/* Custom Occasion Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Describe your occasion or vibe
              </label>
              <input
                type="text"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="e.g., Casual brunch with friends, Diwali celebration, Business meeting..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Quick Occasion Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Or select an occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => { setOccasion(occ); setCustomOccasion(""); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      occasion === occ && !customOccasion
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Select Style
              </label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedStyle === style
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Color Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedColor === color
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateOutfit}
              disabled={(!occasion && !customOccasion) || loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI Agents Working...
                </span>
              ) : (
                `🎨 Generate Outfit for ${genderText}`
              )}
            </button>
          </div>
        </div>

        {/* Loading Animation */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-pulse space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-300">🔍 Analyzing your preferences...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Wardrobe Agent → User Context Agent → Cultural Agent → Outfit Generator
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {outfitResult && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> Your AI-Generated Outfit
              <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                user?.gender === "male" ? "bg-blue-100 text-blue-700" :
                user?.gender === "female" ? "bg-pink-100 text-pink-700" :
                "bg-purple-100 text-purple-700"
              }`}>
                {user?.gender === "male" ? "Men" : user?.gender === "female" ? "Women" : "Unisex"}
              </span>
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {outfitResult}
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                ❤️ Save Outfit
              </button>
              <button onClick={generateOutfit} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                🔄 Regenerate
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                📤 Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
