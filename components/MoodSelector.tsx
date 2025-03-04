"use client";

import { Button } from "@/components/ui/button";

interface MoodSelectorProps {
  currentMood: string;
  onMoodChange: (mood: string, bgColor: string, textColor: string, speed: number) => void;
}

export default function MoodSelector({ currentMood, onMoodChange }: MoodSelectorProps) {
  const moods = [
    { name: "happy", bgColor: "bg-yellow-100", textColor: "text-yellow-900", speed: 0.7 },
    { name: "calm", bgColor: "bg-blue-100", textColor: "text-blue-900", speed: 0.3  },
    { name: "energetic", bgColor: "bg-orange-100", textColor: "text-orange-900", speed: 1 },
    { name: "sad", bgColor: "bg-stone-200", textColor: "text-stone-900", speed: 0.1},
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {moods.map((mood) => (
        <Button
          key={mood.name}
          variant={currentMood === mood.name ? "default" : "outline"}
          onClick={() => onMoodChange(mood.name, mood.bgColor, mood.textColor, mood.speed)}
          className="capitalize"
        >
          {mood.name}
        </Button>
      ))}
    </div>
  );
}