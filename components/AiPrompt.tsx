"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card } from "./ui/card";

interface AiPromptProps {
  onAiMoodChange: (mood: string, bgColor: string, textColor: string, speed: number, field: string) => void;
}

export default function AiPrompt({ onAiMoodChange }: AiPromptProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [moodText, setMoodText] = useState(`Enter a description of your mood or thoughts, and our AI will detect your mood and adjust the UI accordingly. Try phrases like "I feel happy today" or "I need to focus on my work.`);

  const handleGenerateContent = async () => {
    const newPrompt = `${userPrompt}. Categorize this into ONLY ONE of these: Happy, Calm, Energetic, or Sad. Choose the most appropriate category based on the dominant emotion. Return the response in the following STRICT JSON format: { "mood": "selected_mood", "textForMood": "description_of_mood" }. Where description can be supportive for the user under 20 words. STRICTLY Do not include any additional text, explanations, or Markdown code blocks. Only Return RAW JSON. If the input is irrelevant or lacks emotional context, return "Unknown" instead. `;
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
    let cleanedResponse = responseText.trim();

    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7).trim(); 
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3).trim(); 
    }


    let responseJson;
    try {
      responseJson = JSON.parse(cleanedResponse);
    } catch (error) {

      const jsonMatch = cleanedResponse.match(/\{.*\}/); 
      if (jsonMatch) {
        responseJson = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid JSON response from Gemini");
      }
    }

    if (!responseJson.mood || !responseJson.textForMood) {
      throw new Error("Invalid JSON structure from Gemini");
    }


    const { mood, textForMood } = responseJson;

    console.log(responseText)

      setResponse(responseText);
      setMoodText(textForMood);

      analyzeMood(mood);


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
        { mood: "happy", bgColor: "bg-yellow-100", textColor: "text-yellow-900", speed: 0.7, field: "" },
        { mood: "calm", bgColor: "bg-blue-100", textColor: "text-blue-900", speed: 0.3, field: "" },
        { mood: "energetic", bgColor: "bg-orange-100", textColor: "text-orange-900", speed: 1, field: "" },
        { mood: "sad", bgColor: "bg-stone-200", textColor: "text-stone-900", speed: 0.1, field: "" },
        { mood: "neutral", bgColor: "bg-white-100", textColor: "text-white-900", speed: 0.2, field: "" }

      ];

      const lowerText = text.toLowerCase();
      let selectedMood = moodOptions.find(({ mood }) => lowerText.includes(mood)) || moodOptions[4];

      onAiMoodChange(selectedMood.mood, selectedMood.bgColor, selectedMood.textColor, selectedMood.speed, selectedMood.field);

      console.log("Detected mood:", selectedMood.mood, ",from text:", text);
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
      <Card className={`p-6 text-sm text-muted-foreground`}>
        {moodText}
      </Card>
    </div>
  );
}