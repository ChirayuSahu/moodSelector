"use client";

import { useState } from "react";
import MoodSelector from "@/components/MoodSelector";
import AiPrompt from "@/components/AiPrompt";
import SpotifyPlaylist from "@/components/SpotifyPlaylist";
import Particles from "@/components/Particles/Particles";

export default function Home() {
  const [mood, setMood] = useState<string>("neutral");
  const [backgroundColor, setBackgroundColor] = useState<string>("bg-background");
  const [textColor, setTextColor] = useState<string>("text-foreground");
  const [speed, setSpeed] = useState<number>(0.2);

  const handleMoodChange = (newMood: string, bgColor: string, txtColor: string, speed: number) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setSpeed(speed);
  };

  const handleAiMoodChange = (newMood: string, bgColor: string, txtColor: string, speed: number) => {
    setMood(newMood);
    setBackgroundColor(bgColor);
    setTextColor(txtColor);
    setSpeed(speed)
  };


  return (
    <> 
      <div className={`min-h-screen ${backgroundColor} transition-colors duration-500 z-10`}>
        <div className="max-w-4xl mx-auto p-8 relative z-10">
          <h1 className={`text-4xl font-bold mb-8 ${textColor} text-center`}>
            Mood-Based UI
          </h1>

          <div className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Select Your Mood</h2>
            <MoodSelector currentMood={mood} onMoodChange={handleMoodChange} />
          </div>

          <div className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Or Let AI Detect Your Mood</h2>
            <AiPrompt onAiMoodChange={handleAiMoodChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`p-6 rounded-lg border ${textColor} border-border`}>
              <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Current Mood: <span className="capitalize">{mood}</span></h2>
              <p className={`${textColor}`}>
                The UI adapts to your mood, changing colors to match how you feel.
                Try selecting different moods or let AI analyze your text to set the mood automatically.
              </p>
            </div>

            <SpotifyPlaylist mood={mood} />
          </div>
        </div>
      </div>
      <div className="fixed inset-0">
        <Particles
          particleColors={['#000000', '#FFFFFF']}
          particleCount={500}
          particleSpread={10}
          speed={speed}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={true}
        />
      </div>
    </>
  );
}