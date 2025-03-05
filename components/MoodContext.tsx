"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface MoodContextType {
  mood: string;
  backgroundColor: string;
  textColor: string;
  field: string;
  speed: number;
  setMood: (mood: string, bgColor: string, txtColor: string, speed: number, field: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState("neutral");
  const [backgroundColor, setBackgroundColor] = useState("bg-background");
  const [textColor, setTextColor] = useState("text-foreground");
  const [speed, setSpeed] = useState(0.2);
  const [field, setField] = useState("");
  
  const handleSetMood = (newMood: string, bgColor: string, txtColor: string, speed: number, field: string) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setSpeed(speed);
    setField(field);
  };

  return (
    <MoodContext.Provider
      value={{
        mood,
        backgroundColor,
        textColor,
        field,
        speed,
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