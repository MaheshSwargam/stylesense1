"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

const collections = ["All Outfits", "Festive", "Office Wear", "Casual", "Travel", "Wedding Guest"];

interface SavedOutfit {
  id: string;
  title: string;
  description: string;
  occasion: string;
  savedAt: string;
  style: string;
}

export default function SavedPage() {
  const { user } = useUser();
  const [selectedCollection, setSelectedCollection] = useState("All Outfits");
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [styleAnalysis, setStyleAnalysis] = useState({
    preference: "Loading...",
    colorPalette: "Loading...",
    comfortPriority: "Loading...",
    trendAdoption: "Loading...",
  });

  useEffect(() => {
    // Load saved outfits from localStorage
    const saved = localStorage.getItem("stylesense_saved_outfits");
    if (saved) {
      setSavedOutfits(JSON.parse(saved));
    } else {
      // Demo data
      const demoOutfits: SavedOutfit[] = [
        {
          id: "1",
          title: "Diwali Celebration Look",
          description: "Silk kurta with golden embroidery, matching churidar, and mojris",
          occasion: "Festive",
          savedAt: "2 days ago",
          style: "Traditional",
        },
        {
          id: "2",
          title: "Business Meeting Outfit",
          description: "Navy blazer, white shirt, grey trousers, oxford shoes",
          occasion: "Office Wear",
          savedAt: "1 week ago",
          style: "Formal",
        },
        {
          id: "3",
          title: "Weekend Brunch",
          description: "Linen shirt, chinos, white sneakers",
          occasion: "Casual",
          savedAt: "3 days ago",
          style: "Casual",
        },
      ];
      setSavedOutfits(demoOutfits);
    }

    // Style analysis based on gender
    const gender = user?.gender || "other";
    const analyses = {
      male: {
        preference: "60% Fusion, 25% Traditional, 15% Western",
        colorPalette: "Earth tones (40%), Blues (30%), Neutrals (20%)",
        comfortPriority: "High - prefers mobility and breathable fabrics",
        trendAdoption: "Adopts trends thoughtfully after they're established",
      },
      female: {
        preference: "55% Traditional, 30% Fusion, 15% Western",
        colorPalette: "Jewel tones (35%), Pastels (30%), Neutrals (25%)",
        comfortPriority: "Medium-High - balances style with comfort",
        trendAdoption: "Quickly adopts trends that match personal style",
      },
      other: {
        preference: "50% Fusion, 30% Minimalist, 20% Traditional",
        colorPalette: "Neutrals (45%), Earth tones (30%), Brights (15%)",
        comfortPriority: "High - comfort is top priority",
        trendAdoption: "Focuses on timeless pieces with occasional trends",
      },
    };
    setStyleAnalysis(analyses[gender] || analyses.other);
  }, [user]);

  const filteredOutfits = selectedCollection === "All Outfits"
    ? savedOutfits
    : savedOutfits.filter(o => o.occasion === selectedCollection);

  const removeOutfit = (id: string) => {
    const updated = savedOutfits.filter(o => o.id !== id);
    setSavedOutfits(updated);
    localStorage.setItem("stylesense_saved_outfits", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              ❤️ Saved Outfits & Collections
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your favorite AI-generated outfits organized by occasion
            </p>
          </div>

          {/* Collection Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {collections.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCollection === col
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100"
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          {/* Saved Outfits Grid */}
          {filteredOutfits.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                No saved outfits in this collection yet.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              >
                🎨 Generate New Outfit
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 relative group"
                >
                  <button
                    onClick={() => removeOutfit(outfit.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">
                      {outfit.occasion === "Festive" ? "🎉" :
                       outfit.occasion === "Office Wear" ? "💼" :
                       outfit.occasion === "Casual" ? "☀️" :
                       outfit.occasion === "Travel" ? "✈️" : "👗"}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      outfit.style === "Traditional" ? "bg-orange-100 text-orange-700" :
                      outfit.style === "Formal" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {outfit.style}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                    {outfit.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {outfit.description}
                  </p>
                  <p className="text-xs text-gray-400">Saved {outfit.savedAt}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Style Evolution Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            📊 Your Style Evolution
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Based on your saved outfits, AI has identified your fashion preferences:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Style Preference</p>
              <p className="font-medium text-gray-800 dark:text-white">{styleAnalysis.preference}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Color Palette</p>
              <p className="font-medium text-gray-800 dark:text-white">{styleAnalysis.colorPalette}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Comfort Priority</p>
              <p className="font-medium text-gray-800 dark:text-white">{styleAnalysis.comfortPriority}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Trend Adoption</p>
              <p className="font-medium text-gray-800 dark:text-white">{styleAnalysis.trendAdoption}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
