"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai"

interface AiPromptProps {
  onAiMoodChange: (mood: string, bgColor: string, textColor: string) => void;
}

export default function AiPrompt({ onAiMoodChange }: AiPromptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [userPrompt, setUserPrompt] = useState("");

  const handleGenerateContent = async () => {
    const newPrompt = `${userPrompt}. Categorize this into at least one of these: Happy, Calm, Energetic, Sad. If the input is irrelevant or lacks emotional context, return "Unknown" instead.`;

    const key = process.env.NEXT_PUBLIC_GEMINI_KEY;
    if (!key) {
      throw new Error("NEXT_PUBLIC_GEMINI_KEY is not defined");
    }

    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(newPrompt);
      const responseText = await result.response.text();
      setResponse(responseText);

      analyzeMood(responseText);

    } catch (error) {
      console.error("Error generating content:", error);
      setResponse("Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMood = (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const moodOptions = [
        { mood: "happy", bgColor: "bg-yellow-100", textColor: "text-yellow-900" },
        { mood: "calm", bgColor: "bg-blue-100", textColor: "text-blue-900" },
        { mood: "energetic", bgColor: "bg-orange-100", textColor: "text-orange-900" },
        { mood: "sad", bgColor: "bg-slate-400", textColor: "text-slate-900" },
        { mood: "neutral", bgColor: "bg-white-400", textColor: "text-white-900" }
      ];

      const lowerText = text.toLowerCase();
      let selectedMood = moodOptions.find(({ mood }) => lowerText.includes(mood)) || moodOptions[0];

      onAiMoodChange(selectedMood.mood, selectedMood.bgColor, selectedMood.textColor);
      
    } catch (error) {
      console.error("Error analyzing mood:", error);
      setError("Failed to analyze mood. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-sm text-muted-foreground">
        Enter a description of your mood or thoughts, and our AI will detect your mood and adjust the UI accordingly.
        Try phrases like "I feel happy today" or "I need to focus on my work".
      </p>
    </div>
  );
}
