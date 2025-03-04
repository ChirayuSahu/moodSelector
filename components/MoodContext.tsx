"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface MoodContextType {
  mood: string;
  backgroundColor: string;
  textColor: string;
  setMood: (mood: string, bgColor: string, txtColor: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState("neutral");
  const [backgroundColor, setBackgroundColor] = useState("bg-background");
  const [textColor, setTextColor] = useState("text-foreground");

  const handleSetMood = (newMood: string, bgColor: string, txtColor: string) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
  };

  return (
    <MoodContext.Provider
      value={{
        mood,
        backgroundColor,
        textColor,
        setMood: handleSetMood,
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