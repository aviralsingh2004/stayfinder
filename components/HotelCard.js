function HotelCard({ hotel, onViewDetails, onToggleFavorite, isFavorite }) {
    return (
        <div className="hotel-card">
            <img src={hotel.image} alt={hotel.name} className="hotel-image" />
            <div className="hotel-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="hotel-name">{hotel.name}</h2>
                    <button 
                        className="favorite-btn"
                        onClick={() => onToggleFavorite(hotel)}
                    >
                        {isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
                <div className="hotel-location">📍 {hotel.location}</div>
                <div className="hotel-rating">{"⭐".repeat(Math.floor(hotel.rating))} {hotel.rating}</div>
                <div className="hotel-price">{hotel.price}</div>
                <button className="view-details-btn" onClick={() => onViewDetails(hotel)}>
                    View Details
                </button>
            </div>
        </div>
    );
} 