'use client';

import { useState } from 'react';
import { Star, Trash2 } from 'lucide-react';

export default function WatchlistButton({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = 'button',
  onWatchlistChange,
}: WatchlistButtonProps) {
  const [isAdded, setIsAdded] = useState(isInWatchlist);

  const toggleWatchlist = () => {
    const nextIsAdded = !isAdded;
    setIsAdded(nextIsAdded);
    onWatchlistChange?.(symbol, nextIsAdded);
  };

  if (type === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleWatchlist}
        aria-label={`${isAdded ? 'Remove' : 'Add'} ${company} ${isAdded ? 'from' : 'to'} watchlist`}
        className="watchlist-icon-btn"
      >
        {showTrashIcon && isAdded ? (
          <Trash2 className="watchlist-icon" />
        ) : (
          <Star className="watchlist-icon" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleWatchlist}
      className={`watchlist-btn ${isAdded ? 'watchlist-remove' : ''}`}
      aria-pressed={isAdded}
    >
      {isAdded ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
}
