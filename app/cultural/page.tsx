"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

const regions = [
  { id: "north", name: "North India", icon: "🏔️", description: "Punjab, Delhi, UP styles" },
  { id: "south", name: "South India", icon: "🌴", description: "Kerala, Tamil Nadu, Karnataka" },
  { id: "west", name: "West India", icon: "🏜️", description: "Gujarat, Rajasthan, Maharashtra" },
  { id: "east", name: "East India", icon: "🌾", description: "Bengal, Odisha, Assam" },
  { id: "northeast", name: "Northeast", icon: "⛰️", description: "Seven Sisters states" },
  { id: "fusion", name: "Fusion", icon: "✨", description: "Modern Indo-Western" },
];

export default function CulturalPage() {
  const { user } = useUser();
  const [selectedRegion, setSelectedRegion] = useState("north");
  const [loading, setLoading] = useState(false);
  const [culturalOutfit, setCulturalOutfit] = useState("");

  const generateCulturalOutfit = async () => {
    setLoading(true);
    const region = regions.find(r => r.id === selectedRegion);
    const gender = user?.gender || "unisex";
    const genderText = gender === "male" ? "men" : gender === "female" ? "women" : "anyone";

    try {
      const prompt = `Generate a traditional/cultural outfit recommendation from ${region?.name} for ${genderText}.

Region: ${region?.name} (${region?.description})

Please provide:
1. **Traditional Outfit** - Specific regional attire with names
2. **Fabric & Colors** - Traditional fabrics and color significance
3. **Accessories** - Regional jewelry, footwear, headwear
4. **Occasions** - When to wear this outfit
5. **Modern Twist** - How to make it contemporary
6. **Cultural Significance** - Brief cultural context

Be specific about regional traditions and culturally appropriate.`;

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setCulturalOutfit(data.recommendation || "Unable to generate.");
    } catch (error) {
      console.error(error);
      setCulturalOutfit("Something went wrong. Please try again.");
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
              🌍 Cultural Intelligence
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Explore traditional and fusion styles from different Indian regions with AI-powered cultural appropriateness.
            </p>
          </div>

          {/* Region Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
              Select Region
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    selectedRegion === region.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-purple-300"
                  }`}
                >
                  <span className="text-2xl">{region.icon}</span>
                  <h3 className="font-semibold text-gray-800 dark:text-white mt-2">{region.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{region.description}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateCulturalOutfit}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-pink-700 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Cultural Outfit...
              </span>
            ) : (
              `🎭 Generate ${regions.find(r => r.id === selectedRegion)?.name} Outfit`
            )}
          </button>
        </div>

        {/* Result */}
        {culturalOutfit && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">{regions.find(r => r.id === selectedRegion)?.icon}</span>
              {regions.find(r => r.id === selectedRegion)?.name} Traditional Outfit
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {culturalOutfit}
              </p>
            </div>
          </div>
        )}

        {/* Cultural Intelligence Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            🏛️ Cultural Intelligence Agent Notes
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Our AI ensures outfits respect regional traditions while maintaining modern wearability:
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span><strong>Color symbolism:</strong> Different colors have different meanings across regions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span><strong>Fabric appropriateness:</strong> Recommends breathable fabrics for coastal regions, warmer fabrics for northern winters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span><strong>Modesty norms:</strong> Adjusts coverage based on regional cultural expectations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500">•</span>
              <span><strong>Accessory pairing:</strong> Suggests culturally appropriate jewelry and footwear</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
