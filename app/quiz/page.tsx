"use client";

import { useState } from "react";

const questions = [
  {
    id: 1,
    question: "How would you describe your ideal weekend outfit?",
    options: [
      { text: "Jeans and a comfortable tee", style: "casual" },
      { text: "A flowy dress or tailored pants", style: "classic" },
      { text: "Athleisure or activewear", style: "sporty" },
      { text: "Bold patterns and unique pieces", style: "trendy" },
    ],
  },
  {
    id: 2,
    question: "Which colors dominate your wardrobe?",
    options: [
      { text: "Neutrals (black, white, beige, gray)", style: "minimalist" },
      { text: "Earth tones (brown, olive, rust)", style: "bohemian" },
      { text: "Bright and bold colors", style: "trendy" },
      { text: "Navy, white, and classic colors", style: "classic" },
    ],
  },
  {
    id: 3,
    question: "What's your go-to accessory?",
    options: [
      { text: "A classic watch or simple jewelry", style: "classic" },
      { text: "Statement earrings or layered necklaces", style: "bohemian" },
      { text: "Baseball cap or sneakers", style: "sporty" },
      { text: "Trendy sunglasses or a designer bag", style: "trendy" },
    ],
  },
  {
    id: 4,
    question: "How do you feel about prints and patterns?",
    options: [
      { text: "I prefer solid colors", style: "minimalist" },
      { text: "Love florals and nature-inspired prints", style: "bohemian" },
      { text: "Classic stripes and plaids are my thing", style: "classic" },
      { text: "I love bold, eye-catching patterns", style: "trendy" },
    ],
  },
  {
    id: 5,
    question: "What's most important when choosing an outfit?",
    options: [
      { text: "Comfort above all", style: "casual" },
      { text: "Looking polished and put-together", style: "classic" },
      { text: "Expressing my unique personality", style: "bohemian" },
      { text: "Being on-trend and fashion-forward", style: "trendy" },
    ],
  },
];

const styleDescriptions: Record<string, { title: string; description: string; tips: string[] }> = {
  minimalist: {
    title: "Minimalist",
    description: "You appreciate clean lines, quality over quantity, and a capsule wardrobe approach.",
    tips: [
      "Invest in high-quality basics",
      "Stick to a neutral color palette",
      "Focus on perfect fit and tailoring",
      "Choose timeless pieces over trends",
    ],
  },
  classic: {
    title: "Classic & Elegant",
    description: "You gravitate towards timeless pieces and sophisticated silhouettes that never go out of style.",
    tips: [
      "Build around wardrobe staples like blazers and trousers",
      "Invest in quality leather accessories",
      "Opt for structured bags and classic pumps",
      "Keep jewelry refined and understated",
    ],
  },
  bohemian: {
    title: "Bohemian & Free-Spirited",
    description: "You love expressing yourself through eclectic, artistic, and nature-inspired fashion choices.",
    tips: [
      "Layer different textures and patterns",
      "Incorporate vintage and handmade pieces",
      "Embrace flowy silhouettes and natural fabrics",
      "Accessorize with meaningful jewelry",
    ],
  },
  trendy: {
    title: "Trendy & Fashion-Forward",
    description: "You stay ahead of the curve and love experimenting with the latest fashion trends.",
    tips: [
      "Mix high-end pieces with affordable finds",
      "Don't be afraid to take risks",
      "Follow fashion influencers for inspiration",
      "Rotate trendy pieces seasonally",
    ],
  },
  sporty: {
    title: "Sporty & Active",
    description: "You value comfort and functionality while still looking stylish and put-together.",
    tips: [
      "Invest in quality athleisure brands",
      "Choose versatile pieces that transition well",
      "Keep sneakers clean and on-trend",
      "Mix athletic wear with casual pieces",
    ],
  },
  casual: {
    title: "Casual & Relaxed",
    description: "You prioritize comfort and effortless style in your everyday outfits.",
    tips: [
      "Find the perfect-fitting jeans",
      "Stock up on quality t-shirts and sweaters",
      "Invest in comfortable yet stylish footwear",
      "Layer for versatility",
    ],
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const handleAnswer = (style: string) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      getPersonalizedAdvice(newAnswers);
    }
  };

  const getStyleResult = () => {
    const styleCounts: Record<string, number> = {};
    answers.forEach((style) => {
      styleCounts[style] = (styleCounts[style] || 0) + 1;
    });
    return Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const getPersonalizedAdvice = async (finalAnswers: string[]) => {
    setLoadingAdvice(true);
    const dominantStyle = Object.entries(
      finalAnswers.reduce((acc: Record<string, number>, style) => {
        acc[style] = (acc[style] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0][0];

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Based on a style quiz, this person's dominant fashion style is "${dominantStyle}". 
          Give them 3-4 personalized shopping recommendations and specific items they should look for to enhance their wardrobe. 
          Be specific with item suggestions and brands if appropriate. Keep it concise and actionable.`,
        }),
      });
      const data = await response.json();
      setAiAdvice(data.recommendation || "");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAdvice(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setAiAdvice("");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Style Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover your fashion personality in 5 questions
          </p>
        </div>

        {!showResult ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              {questions[currentQuestion].question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.style)}
                  className="w-full p-4 text-left rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-gray-700 dark:text-gray-200"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Result Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Your Style: {styleDescriptions[getStyleResult()]?.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {styleDescriptions[getStyleResult()]?.description}
              </p>

              <div className="text-left bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
                  Style Tips for You:
                </h3>
                <ul className="space-y-2">
                  {styleDescriptions[getStyleResult()]?.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-purple-700 dark:text-purple-300 flex items-start gap-2"
                    >
                      <span className="text-pink-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition"
              >
                Take Quiz Again
              </button>
            </div>

            {/* AI Personalized Advice */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🛍️</span> Personalized Shopping Tips
              </h3>
              {loadingAdvice ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
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
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {aiAdvice}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
