"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Music, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpotifyPlaylistProps {
  mood: string;
}

export default function SpotifyPlaylist({ mood }: SpotifyPlaylistProps) {
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Map moods to Spotify playlist genres/keywords
  const moodToPlaylistMap: Record<string, { name: string, id: string, description: string }> = {
    happy: {
      name: "Happy Hits",
      id: "37i9dQZF1DXdPec7aLTmlC",
      description: "Upbeat songs to boost your mood and make you smile."
    },
    calm: {
      name: "Peaceful Piano",
      id: "37i9dQZF1DX4sWSpwq3LiO",
      description: "Peaceful piano to help you relax and unwind."
    },
    energetic: {
      name: "Workout Beats",
      id: "37i9dQZF1DX76Wlfdnj7AP",
      description: "High-energy tracks to fuel your workout or boost your energy."
    },
    focused: {
      name: "Sad Songs",
      id: "37i9dQZF1DX7qK8ma5wgG1",
      description: "Instrumental music to help you concentrate and stay focused."
    },
    neutral: {
      name: "Today's Top Hits",
      id: "37i9dQZF1DXcBWIGoYBM5M",
      description: "The most popular tracks right now."
    }
  };

  const generatePlaylist = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const currentMoodPlaylist = moodToPlaylistMap[mood] || moodToPlaylistMap.neutral;

      setPlaylist({...currentMoodPlaylist});
      
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setPlaylist(null);
  }, [mood]);

  const openSpotifyPlaylist = () => {
    const playlistId = moodToPlaylistMap[mood]?.id || moodToPlaylistMap.neutral.id;
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Music className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Spotify Mood Playlist</h3>
      </div>
      
      {!playlist && !loading && (
        <div className="text-center py-6">
          <p className="mb-4">Generate a Spotify playlist based on your current mood: <span className="font-semibold capitalize">{mood}</span></p>
          <Button onClick={generatePlaylist}>
            Generate Playlist
          </Button>
        </div>
      )}
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Finding the perfect tracks for your mood...</p>
        </div>
      )}
      
      {playlist && !loading && (
        <div>
          <div className="mb-4">
            <h4 className="text-lg font-medium">{playlist.name}</h4>
            <p className="text-muted-foreground">{playlist.description}</p>
          </div>
          
          <Button variant="outline" onClick={openSpotifyPlaylist} className="w-full flex items-center justify-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in Spotify
          </Button>
        </div>
      )}
    </Card>
  );
}
