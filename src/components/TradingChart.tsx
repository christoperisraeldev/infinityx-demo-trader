import { useEffect, useState } from "react";

export const TradingChart = () => {
  const [price, setPrice] = useState(1.2345);
  const [candlesticks, setCandlesticks] = useState<Array<{time: string, price: number}>>([]);

  useEffect(() => {
    // Simulate price movement
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.001;
      setPrice(prev => Math.max(0.1, prev + change));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      setCandlesticks(prev => {
        const newData = [...prev, { time: timeString, price: price + change }];
        return newData.slice(-20); // Keep last 20 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="bg-chart-bg rounded-xl p-6 h-96 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="border border-chart-grid"></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">EUR/USD</h3>
          <div className="text-right">
            <div className="text-2xl font-mono text-primary">
              {price.toFixed(5)}
            </div>
            <div className="text-sm text-success">+0.05%</div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-center space-x-1">
          {candlesticks.map((candle, index) => (
            <div
              key={index}
              className="bg-primary w-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              style={{
                height: `${Math.min(100, Math.max(10, (candle.price - 1.2) * 1000))}%`
              }}
              title={`${candle.time}: ${candle.price.toFixed(5)}`}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground">
          <span>1m</span>
          <span>5m</span>
          <span className="text-primary font-semibold">15m</span>
          <span>1h</span>
          <span>1d</span>
        </div>
      </div>
    </div>
  );
};