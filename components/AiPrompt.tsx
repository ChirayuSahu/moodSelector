"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Card } from "./ui/card";
import { useMood } from "./MoodContext";

export default function AiPrompt() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { userPrompt, setUserPrompt, setMood, moodText, setMoodText } = useMood(); // ✅ Ensure setMoodText is used

  const handleGenerateContent = async () => {
    if (!userPrompt.trim()) return;

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!apiKey) {
      console.error("NEXT_PUBLIC_GEMINI_KEY is not defined");
      setError("AI service is unavailable. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError("");

    const newPrompt = `${userPrompt}. Categorize this into ONLY ONE of these: Happy, Calm, Energetic, or Sad. Choose the most appropriate category based on the dominant emotion. Return the response in the following STRICT JSON format: { "mood": "selected_mood", "textForMood": "description_of_mood" }. Where description can be supportive for the user under 20 words. Do not include any extra text, explanations, or Markdown code blocks. If the input is irrelevant, return { "mood": "Unknown", "textForMood": "Unable to determine mood." }`;

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(newPrompt);
      let responseText = await result.response.text();
      responseText = responseText.trim();

      const jsonMatch = responseText.match(/\{.*\}/);
      if (!jsonMatch) throw new Error("Invalid response format from AI");

      const responseJson = JSON.parse(jsonMatch[0]);

      if (!responseJson.mood || !responseJson.textForMood) {
        throw new Error("Invalid JSON structure from AI");
      }

      const { mood, textForMood } = responseJson;

      console.log("AI Response:", responseText);

      setMoodText(textForMood); // ✅ Store AI-generated mood text globally
      analyzeMood(mood.toLowerCase().trim());
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate mood. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMood = (mood: string) => {
    const moodOptions = {
      happy: { bgColor: "bg-yellow-100", textColor: "text-yellow-900", speed: 0.7 },
      calm: { bgColor: "bg-blue-100", textColor: "text-blue-900", speed: 0.3 },
      energetic: { bgColor: "bg-orange-100", textColor: "text-orange-900", speed: 1 },
      sad: { bgColor: "bg-stone-200", textColor: "text-stone-900", speed: 0.1 },
      unknown: { bgColor: "bg-gray-100", textColor: "text-gray-900", speed: 0.2 },
    };

    const selectedMood = moodOptions[mood as keyof typeof moodOptions] || moodOptions.unknown;

    setMood(mood, selectedMood.bgColor, selectedMood.textColor, selectedMood.speed);
    console.log("Detected mood:", mood);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleGenerateContent();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Describe how you're feeling..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1"
          disabled={isLoading}
        />
        <Button onClick={handleGenerateContent} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Card className={`p-6 text-sm ${error ? "text-red-500" : "text-muted-foreground"}`}>
        {moodText} {/* ✅ This should now display AI-generated text */}
      </Card>
    </div>
  );
}
