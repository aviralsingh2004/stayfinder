function HotelApp() {
    const [selectedHotel, setSelectedHotel] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [favorites, setFavorites] = useLocalStorage('favorites', []);
    const [priceFilter, setPriceFilter] = React.useState('all');
    const [showFavorites, setShowFavorites] = React.useState(false);
    const [sortBy, setSortBy] = React.useState('default');
    const [userPreferences, setUserPreferences] = React.useState({
        tags: [],
        maxPrice: null,
        amenities: []
    });
    const [aiRecommendations, setAiRecommendations] = React.useState([]);

    const toggleFavorite = (hotel) => {
        if (favorites.find(f => f.id === hotel.id)) {
            setFavorites(favorites.filter(f => f.id !== hotel.id));
        } else {
            setFavorites([...favorites, hotel]);
        }
    };

    const filteredHotels = hotelData.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesPrice = priceFilter === 'all' ? true :
            priceFilter === 'low' ? parseInt(hotel.price.slice(1)) <= 200 :
            priceFilter === 'high' ? parseInt(hotel.price.slice(1)) > 200 : true;

        return matchesSearch && matchesPrice;
    });

    const sortHotels = (hotels) => {
        switch(sortBy) {
            case 'price-low':
                return [...hotels].sort((a, b) => 
                    parseInt(a.price.slice(1)) - parseInt(b.price.slice(1)));
            case 'price-high':
                return [...hotels].sort((a, b) => 
                    parseInt(b.price.slice(1)) - parseInt(a.price.slice(1)));
            case 'rating':
                return [...hotels].sort((a, b) => b.rating - a.rating);
            default:
                return hotels;
        }
    };

    const displayedHotels = sortHotels(showFavorites ? favorites : filteredHotels);

    const getRecommendations = async () => {
        const recommendations = await getAIRecommendations(userPreferences);
        if (recommendations) {
            const matchedHotels = matchHotelsToPreferences(hotelData, userPreferences);
            setAiRecommendations(matchedHotels);
        }
    };

    const PreferenceSelector = () => (
        <div className="preference-section">
            <h3>Customize Your Experience</h3>
            <div className="preference-tags">
                {["luxury", "business", "nature", "beach", "city-center", "eco-friendly"].map(tag => (
                    <button
                        key={tag}
                        className={`tag-btn ${userPreferences.tags.includes(tag) ? 'active' : ''}`}
                        onClick={() => {
                            const newTags = userPreferences.tags.includes(tag)
                                ? userPreferences.tags.filter(t => t !== tag)
                                : [...userPreferences.tags, tag];
                            setUserPreferences({...userPreferences, tags: newTags});
                        }}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            <button 
                className="get-recommendations-btn"
                onClick={getRecommendations}
            >
                Get AI Recommendations
            </button>
        </div>
    );

    return (
        <div>
            <header className="header">
                <h1>StayFinder</h1>
                <p>Discover Your Perfect Stay - AI-Powered Hotel Recommendations</p>
            </header>

            <div className="hotel-app">
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search hotels by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-section">
                    <button 
                        className={`filter-btn ${!showFavorites ? 'active' : ''}`}
                        onClick={() => setShowFavorites(false)}
                    >
                        All Hotels
                    </button>
                    <button 
                        className={`filter-btn ${showFavorites ? 'active' : ''}`}
                        onClick={() => setShowFavorites(true)}
                    >
                        Favorites ({favorites.length})
                    </button>
                    <button 
                        className={`filter-btn ${priceFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('all')}
                    >
                        All Prices
                    </button>
                    <button 
                        className={`filter-btn ${priceFilter === 'low' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('low')}
                    >
                        Under $200
                    </button>
                    <button 
                        className={`filter-btn ${priceFilter === 'high' ? 'active' : ''}`}
                        onClick={() => setPriceFilter('high')}
                    >
                        Over $200
                    </button>
                </div>

                <div className="sort-section">
                    <button 
                        className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
                        onClick={() => setSortBy('default')}
                    >
                        Default
                    </button>
                    <button 
                        className={`sort-btn ${sortBy === 'price-low' ? 'active' : ''}`}
                        onClick={() => setSortBy('price-low')}
                    >
                        Price: Low to High
                    </button>
                    <button 
                        className={`sort-btn ${sortBy === 'price-high' ? 'active' : ''}`}
                        onClick={() => setSortBy('price-high')}
                    >
                        Price: High to Low
                    </button>
                    <button 
                        className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                        onClick={() => setSortBy('rating')}
                    >
                        Highest Rated
                    </button>
                </div>

                <PreferenceSelector />

                {aiRecommendations.length > 0 && (
                    <div className="recommendations-section">
                        <h2>AI Recommended Hotels</h2>
                        <div className="hotel-grid">
                            {aiRecommendations.map(hotel => (
                                <HotelCard 
                                    key={hotel.id} 
                                    hotel={hotel} 
                                    onViewDetails={setSelectedHotel}
                                    onToggleFavorite={toggleFavorite}
                                    isFavorite={favorites.some(f => f.id === hotel.id)}
                                    isRecommended={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="hotel-grid">
                    {displayedHotels.map(hotel => (
                        <HotelCard 
                            key={hotel.id} 
                            hotel={hotel} 
                            onViewDetails={setSelectedHotel}
                            onToggleFavorite={toggleFavorite}
                            isFavorite={favorites.some(f => f.id === hotel.id)}
                        />
                    ))}
                </div>
                <Modal 
                    hotel={selectedHotel} 
                    onClose={() => setSelectedHotel(null)}
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<HotelApp />);