"use client";

import MoodSelector from "@/components/MoodSelector";
import AiPrompt from "@/components/AiPrompt";
import SpotifyPlaylist from "@/components/SpotifyPlaylist";
import Particles from "@/components/Particles/Particles";
import { Card } from "@/components/ui/card";
import TextPressure from "@/components/TextPressure/TextPressure";
import { MoodProvider, useMood } from "@/components/MoodContext";

function HomeContent() {
  const { mood, backgroundColor, textColor, speed } = useMood(); // No need for setMood

  return (
    <div className={`min-h-screen ${backgroundColor} transition-colors duration-500 z-10`}>
      <div className="max-w-4xl mx-auto p-8 relative z-10">
        <div className="relative mb-8">
          <TextPressure
            text="AI Mood Selector"
            flex={true}
            alpha={false}
            stroke={false}
            width={false}
            weight={true}
            italic={true}
            textColor="#000000"
            minFontSize={36}
            scale={false}
          />
        </div>

        <div className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Select Your Mood</h2>
          <MoodSelector />
        </div>

        <div className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Or Let AI Detect Your Mood</h2>
          <AiPrompt />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`p-6 rounded-lg border ${textColor} border-border`}>
            <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>
              Current Mood: <span className="capitalize">{mood}</span>
            </h2>
            <p className={`${textColor}`}>
              The UI adapts to your mood, changing colors to match how you feel.
              Try selecting different moods or let AI analyze your text to set the mood automatically.
            </p>
          </Card>
          <SpotifyPlaylist mood={mood} />
        </div>
      </div>

      <div className="fixed inset-0">
        <Particles
          particleColors={["#000000", "#FFFFFF"]}
          particleCount={500}
          particleSpread={10}
          speed={speed}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={true}
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MoodProvider>
      <HomeContent />
    </MoodProvider>
  );
}
