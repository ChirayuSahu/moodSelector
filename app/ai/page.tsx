"use client"

import React from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState } from 'react';

const AI = () => {

    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userPrompt, setUserPrompt] = useState('Explain how AI works'); // Default prompt

    const handleGenerateContent = async () => {

        const newPrompt = `${userPrompt}. Categorize this into atleast only of these: Happy, Calm, Energetic, Sad`

        const key = process.env.NEXT_PUBLIC_GEMINI_KEY;

        if (!key) {
            throw new Error("NEXT_PUBLIC_GEMINI_KEY is not defined");
        }

        setIsLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const result = await model.generateContent(newPrompt); // Use user's prompt
            setResponse(result.response.text());
        } catch (error) {
            console.error("Error generating content:", error);
            setResponse("Failed to generate content.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <div>
                <label htmlFor="prompt">Enter your prompt:</label>
                <textarea
                    id="prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={4}
                    cols={50}
                    placeholder="Enter your prompt here..."
                />
            </div>
            <button onClick={handleGenerateContent} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Content'}
            </button>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
}

export default AI