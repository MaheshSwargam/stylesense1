"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  color: string;
  description: string;
}

const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];

export default function WardrobePage() {
  const { user } = useUser();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<{
    styleDistribution: string;
    colorAnalysis: string;
    gap: string;
    recommendation: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Tops",
    color: "",
    description: "",
  });

  const addItem = () => {
    if (!newItem.name || !newItem.color) return;
    
    const item: WardrobeItem = {
      id: Date.now().toString(),
      ...newItem,
    };
    setItems([...items, item]);
    setNewItem({ name: "", category: "Tops", color: "", description: "" });
    setShowForm(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getCategoryItems = (category: string) =>
    items.filter((item) => item.category === category);

  const analyzeWardrobe = async () => {
    if (items.length === 0) return;
    setAnalysisLoading(true);
    
    const gender = user?.gender || "unisex";
    const genderText = gender === "male" ? "men" : gender === "female" ? "women" : "anyone";
    const itemsList = items.map(i => `${i.color} ${i.name} (${i.category})`).join(", ");

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze this wardrobe for ${genderText}. Items: ${itemsList}

Provide brief analysis (1-2 sentences each):
1. Style Distribution: What styles dominate?
2. Color Analysis: What colors are present?
3. Gap Detected: What's missing?
4. Recommendation: What should they add next?`
        }),
      });
      const data = await response.json();
      const text = data.recommendation || "";
      
      setAnalysis({
        styleDistribution: text.match(/Style Distribution:?([^\n]+)/i)?.[1]?.trim() || "Mix of casual and formal pieces",
        colorAnalysis: text.match(/Color Analysis:?([^\n]+)/i)?.[1]?.trim() || "Good variety of colors",
        gap: text.match(/Gap Detected:?([^\n]+)/i)?.[1]?.trim() || "Consider adding statement pieces",
        recommendation: text.match(/Recommendation:?([^\n]+)/i)?.[1]?.trim() || "Add versatile basics",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      analyzeWardrobe();
    }
  }, [items.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            My Wardrobe
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add your clothing items to get personalized outfit suggestions
          </p>
        </div>

        {/* Add Item Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
          >
            <span className="text-xl">+</span> Add Clothing Item
          </button>
        </div>

        {/* Add Item Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Add New Item
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item name (e.g., Blue Denim Jacket)"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Color (e.g., Navy Blue)"
                value={newItem.color}
                onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Description (optional)"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={addItem}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wardrobe Grid */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Your wardrobe is empty. Start adding items!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryItems = getCategoryItems(category);
              if (categoryItems.length === 0) return null;
              return (
                <div key={category}>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 relative group"
                      >
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition text-sm"
                        >
                          ×
                        </button>
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          {item.color}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
