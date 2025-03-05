"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface MoodContextType {
  mood: string;
  backgroundColor: string;
  textColor: string;
  userPrompt: string;
  speed: number;
  moodText: string;
  setMood: (mood: string, bgColor: string, txtColor: string, speed: number) => void;
  handleSetMoodforButtons: (mood: string, bgColor: string, txtColor: string, speed: number) => void;
  setUserPrompt: (prompt: string) => void;
  setMoodText: (prompt: string) => void; 
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState("neutral");
  const [backgroundColor, setBackgroundColor] = useState("bg-background");
  const [textColor, setTextColor] = useState("text-foreground");
  const [speed, setSpeed] = useState(0.2);
  const [userPrompt, setUserPrompt] = useState("");
  const [moodText, setMoodText] = useState(`Enter a description of your mood or thoughts, and our AI will detect your mood and adjust the UI accordingly. Try phrases like "I feel happy today" or "I need to focus on my work.`);

  const handleSetMood = (newMood: string, bgColor: string, txtColor: string, speed: number) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setSpeed(speed);
  };

  const handleSetMoodforButtons =(newMood: string, bgColor: string, txtColor: string, speed: number) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setSpeed(speed);
    setUserPrompt("")
    setMoodText(`Enter a description of your mood or thoughts, and our AI will detect your mood and adjust the UI accordingly. Try phrases like "I feel happy today" or "I need to focus on my work.`)
  };

  return (
    <MoodContext.Provider
      value={{
        mood,
        backgroundColor,
        textColor,
        userPrompt,
        speed,
        moodText,
        setMoodText,
        setMood: handleSetMood,
        handleSetMoodforButtons,
        setUserPrompt,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
}