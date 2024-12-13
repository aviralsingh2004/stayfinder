function Modal({ hotel, onClose }) {
    if (!hotel) return null;

    const [bookingData, setBookingData] = React.useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: 'standard'
    });

    const handleBooking = (e) => {
        e.preventDefault();
        // Simulate booking API call
        console.log('Booking details:', { hotel: hotel.name, ...bookingData });
        alert('Booking successful! Check your email for confirmation.');
        onClose();
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>{hotel.name}</h2>
                <img src={hotel.image} alt={hotel.name} style={{width: '100%', borderRadius: '8px', marginBottom: '15px'}} />
                <p><strong>Location:</strong> 📍 {hotel.location}</p>
                <p><strong>Price:</strong> {hotel.price}</p>
                <p><strong>Rating:</strong> {hotel.rating} ⭐</p>
                <p><strong>Description:</strong> {hotel.description}</p>
                <p><strong>Amenities:</strong></p>
                <ul className="amenities-list">
                    {hotel.amenities.map((amenity, index) => (
                        <li key={index}>✓ {amenity}</li>
                    ))}
                </ul>

                <form className="booking-form" onSubmit={handleBooking}>
                    <h3>Book Now</h3>
                    <input
                        type="date"
                        placeholder="Check-in Date"
                        value={bookingData.checkIn}
                        onChange={e => setBookingData({...bookingData, checkIn: e.target.value})}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Check-out Date"
                        value={bookingData.checkOut}
                        onChange={e => setBookingData({...bookingData, checkOut: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Number of Guests"
                        min="1"
                        value={bookingData.guests}
                        onChange={e => setBookingData({...bookingData, guests: e.target.value})}
                        required
                    />
                    <select
                        value={bookingData.roomType}
                        onChange={e => setBookingData({...bookingData, roomType: e.target.value})}
                        required
                    >
                        <option value="standard">Standard Room</option>
                        <option value="deluxe">Deluxe Room</option>
                        <option value="suite">Suite</option>
                    </select>
                    <button type="submit" className="book-now-btn">Book Now</button>
                </form>
            </div>
        </div>
    );
} 