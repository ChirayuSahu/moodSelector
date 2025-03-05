"use client";

import { Button } from "@/components/ui/button";
import { useMood } from "@/components/MoodContext";

export default function MoodSelector() {
  const { mood, handleSetMoodforButtons } = useMood();

  const moods = [
    { name: "happy", bgColor: "bg-yellow-100", textColor: "text-yellow-900", speed: 0.7 },
    { name: "calm", bgColor: "bg-blue-100", textColor: "text-blue-900", speed: 0.3 },
    { name: "energetic", bgColor: "bg-orange-100", textColor: "text-orange-900", speed: 1 },
    { name: "sad", bgColor: "bg-stone-200", textColor: "text-stone-900", speed: 0.1 },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {moods.map(({ name, bgColor, textColor, speed }) => (
        <Button
          key={name}
          variant={mood === name ? "default" : "outline"}
          onClick={() => handleSetMoodforButtons(name, bgColor, textColor, speed)}
          className="capitalize"
        >
          {name}
        </Button>
      ))}
    </div>
  );
}
