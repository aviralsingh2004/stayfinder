const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function getAIRecommendations(userPreferences) {
    try {
        if (!GROQ_API_KEY) {
            throw new Error('GROQ API key is not configured');
        }

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{
                    role: "system",
                    content: "You are a hotel recommendation expert. Analyze user preferences and suggest hotels."
                }, {
                    role: "user",
                    content: `Please recommend hotels based on these preferences: ${JSON.stringify(userPreferences)}`
                }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        throw new Error('Failed to get hotel recommendations');
    }
}

// Add AI-powered preference matching
function matchHotelsToPreferences(hotels, preferences) {
    const preferenceScores = hotels.map(hotel => {
        let score = 0;
        
        // Match tags
        preferences.tags?.forEach(tag => {
            if (hotel.tags.includes(tag)) score += 2;
        });
        
        // Match price range
        if (preferences.maxPrice) {
            const hotelPrice = parseInt(hotel.price.replace(/[^0-9]/g, ''));
            if (hotelPrice <= preferences.maxPrice) score += 1;
        }
        
        // Match amenities
        preferences.amenities?.forEach(amenity => {
            if (hotel.amenities.includes(amenity)) score += 1;
        });

        return {
            hotel,
            score
        };
    });

    return preferenceScores
        .sort((a, b) => b.score - a.score)
        .map(item => item.hotel);
} 