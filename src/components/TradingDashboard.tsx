import { useState } from "react";
import { TradingChart } from "./TradingChart";
import { BalancePanel } from "./BalancePanel";
import { TradeControls } from "./TradeControls";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface TradingDashboardProps {
  username: string;
  onLogout: () => void;
}

export const TradingDashboard = ({ username, onLogout }: TradingDashboardProps) => {
  const [balance, setBalance] = useState(1000000); // Start with $1M

  const handleRecharge = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const handleTradeResult = (amount: number, isWin: boolean) => {
    if (isWin) {
      // Add 80% profit
      setBalance(prev => prev + (amount * 0.8));
    } else {
      // Deduct full amount
      setBalance(prev => Math.max(0, prev - amount));
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            InfinityX Markets™
          </h1>
          <p className="text-muted-foreground">Welcome back, {username}</p>
        </div>
        
        <Button
          onClick={onLogout}
          variant="outline"
          className="glow-effect"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Exit Demo
        </Button>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Area - Takes up most space */}
        <div className="lg:col-span-2">
          <TradingChart />
        </div>

        {/* Right Sidebar - Balance and Controls */}
        <div className="lg:col-span-2 space-y-6">
          <BalancePanel 
            balance={balance}
            onRecharge={handleRecharge}
          />
          
          <TradeControls 
            balance={balance}
            onTradeResult={handleTradeResult}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>InfinityX Markets™ Demo Platform - Educational purposes only</p>
        <p>No real money involved • Unlimited virtual balance • Risk-free trading</p>
      </div>
    </div>
  );
};