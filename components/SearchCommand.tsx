'use client';

import { useEffect, useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchStocks } from '@/lib/actions/finnhub.actions';

export default function SearchCommand({
  renderAs = 'button',
  label = 'Add stock',
  initialStocks,
}: SearchCommandProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const query = searchTerm.trim();
    if (!query && initialStocks.length > 0) {
      setStocks(initialStocks);
      setSearchError(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSearchError(false);
    const timeout = window.setTimeout(
      async () => {
        try {
          const results = await searchStocks(query || undefined);
          if (!cancelled) setStocks(results);
        } catch {
          if (!cancelled) {
            setStocks([]);
            setSearchError(true);
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      query ? 300 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [open, searchTerm, initialStocks]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
    setSearchError(false);
  };

  return (
    <>
      {renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <Command>
          <div className="search-field">
            <CommandInput
              value={searchTerm}
              onValueChange={setSearchTerm}
              placeholder="Search stocks..."
              className="search-input"
            />
            {loading && <Loader2 className="search-loader" />}
          </div>
          <CommandList className="search-list">
            {loading ? (
              <CommandEmpty className="search-list-empty">
                Loading stocks...
              </CommandEmpty>
            ) : searchError ? (
              <CommandEmpty className="search-list-empty">
                Could not load stocks. Please try again.
              </CommandEmpty>
            ) : displayStocks.length === 0 ? (
              <CommandEmpty className="search-list-indicator">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </CommandEmpty>
            ) : (
              <>
                <div className="search-count">
                  {isSearchMode ? 'Search results' : 'Popular stocks'}
                  {` `}({displayStocks.length})
                </div>
                {displayStocks.map((stock) => (
                  <CommandItem
                    key={stock.symbol}
                    value={`${stock.name} ${stock.symbol} ${stock.exchange} ${stock.type}`}
                    onSelect={() => {
                      handleSelectStock();
                      router.push(`/stocks/${stock.symbol}`);
                    }}
                    className="search-item"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
