import React, { useState } from 'react';

interface Chair {
    id: number;
    isAvailable: boolean;
    isSelected: boolean;
}

const MovieChair: React.FC = () => {
    const [chairs, setChairs] = useState<Chair[]>([
        { id: 1, isAvailable: true, isSelected: false },
        { id: 2, isAvailable: true, isSelected: false },
        { id: 3, isAvailable: false, isSelected: false },
        { id: 4, isAvailable: true, isSelected: false },
        // Add more chairs as needed
    ]);

    const handleChairClick = (id: number) => {
        setChairs(prevChairs =>
            prevChairs.map(chair =>
                chair.id === id
                    ? { ...chair, isSelected: !chair.isSelected }
                    : chair
            )
        );
    };

    return (
        <div className="movie-chair-container">
            <h2>Select Your Chair</h2>
            <div className="chair-grid">
                {chairs.map(chair => (
                    <div
                        key={chair.id}
                        className={`chair ${chair.isAvailable ? 'available' : 'unavailable'} ${chair.isSelected ? 'selected' : ''}`}
                        onClick={() => chair.isAvailable && handleChairClick(chair.id)}
                    >
                        {chair.id}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieChair;