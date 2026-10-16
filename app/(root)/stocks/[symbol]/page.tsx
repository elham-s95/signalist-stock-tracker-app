import TradingViewWidget from '@/components/TradingViewWidget';
import WatchlistButton from '@/components/WatchlistButton';
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from '@/lib/constants';

type StockDetailsProps = {
  params: Promise<{ symbol: string }>;
};

const scriptUrl = 'https://s3.tradingview.com/external-embedding/embed-widget-';

export default async function StockDetails({ params }: StockDetailsProps) {
  const { symbol: routeSymbol } = await params;
  const symbol = routeSymbol.toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="grid min-w-0 content-start gap-8">
        <TradingViewWidget
          scriptUrl={`${scriptUrl}symbol-info.js`}
          config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
          height={170}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}advanced-chart.js`}
          config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
          height={600}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}advanced-chart.js`}
          config={BASELINE_WIDGET_CONFIG(symbol)}
          height={600}
        />
      </section>

      <section className="grid min-w-0 content-start gap-8">
        <WatchlistButton
          symbol={symbol}
          company={symbol}
          isInWatchlist={false}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}technical-analysis.js`}
          config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
          height={400}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}symbol-profile.js`}
          config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
          height={440}
        />
        <TradingViewWidget
          scriptUrl={`${scriptUrl}financials.js`}
          config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
          height={464}
        />
      </section>
    </div>
  );
}
