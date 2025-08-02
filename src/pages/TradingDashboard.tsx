import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Menu, History, Settings as SettingsIcon, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Trade {
  id: string;
  type: "call" | "put";
  amount: number;
  startTime: number;
  result?: "win" | "loss";
  payout?: number;
}

const TradingDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "Demo Trader";
  
  const [balance, setBalance] = useState(1000000000); // Start with $1B
  const [tradeAmount, setTradeAmount] = useState("100");
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [price, setPrice] = useState(1.2345);
  const [candlesticks, setCandlesticks] = useState<Array<{time: string, price: number, type: 'bull' | 'bear'}>>([]);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  // Price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.001;
      const newPrice = Math.max(0.1, price + change);
      setPrice(newPrice);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      
      setCandlesticks(prev => {
        const newCandle = { 
          time: timeString, 
          price: newPrice, 
          type: change > 0 ? 'bull' as const : 'bear' as const 
        };
        const newData = [...prev, newCandle];
        return newData.slice(-50); // Keep last 50 data points
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [price]);

  const startTrade = (type: "call" | "put") => {
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid trade amount",
        variant: "destructive"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance", 
        description: "Your trade amount exceeds your available balance",
        variant: "destructive"
      });
      return;
    }

    const trade: Trade = {
      id: Date.now().toString(),
      type,
      amount,
      startTime: Date.now()
    };

    setActiveTrade(trade);
    setCountdown(5);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          finishTrade(trade);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    toast({
      title: `${type.toUpperCase()} Trade Started!`,
      description: `$${amount.toLocaleString()} - 5 seconds remaining`,
      className: "glow-effect"
    });
  };

  const finishTrade = (trade: Trade) => {
    const isWin = Math.random() > 0.4; // 60% win rate
    const payout = isWin ? trade.amount * 0.8 : -trade.amount;
    
    const completedTrade = {
      ...trade,
      result: isWin ? "win" as const : "loss" as const,
      payout
    };

    // Save to localStorage for trade history
    const existingTrades = JSON.parse(localStorage.getItem("tradeHistory") || "[]");
    localStorage.setItem("tradeHistory", JSON.stringify([completedTrade, ...existingTrades].slice(0, 100)));

    if (isWin) {
      setBalance(prev => prev + payout);
    } else {
      setBalance(prev => Math.max(0, prev + payout));
    }
    
    const resultClass = isWin ? "success-glow" : "loss-glow";
    const resultMessage = isWin 
      ? `You Won! +$${payout.toLocaleString()} profit`
      : `You Lost! $${Math.abs(payout).toLocaleString()}`;

    toast({
      title: isWin ? "🎉 YOU WON!" : "💸 YOU LOST",
      description: resultMessage,
      className: resultClass
    });

    setActiveTrade(null);
    setCountdown(0);
  };

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount.replace(/[,$]/g, ""));
    if (!isNaN(amount) && amount > 0) {
      setBalance(prev => prev + amount);
      setRechargeAmount("");
      setIsRechargeOpen(false);
      toast({
        title: "Balance Recharged!",
        description: `Added $${amount.toLocaleString()} to your demo account`,
        className: "success-glow"
      });
    }
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isTrading = activeTrade !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">InfinityX Markets™</h1>
            <span className="text-sm text-muted-foreground">Demo</span>
          </div>

          {/* Center - Balance */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className="balance-display text-2xl">
              {formatBalance(balance)}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <Dialog open={isRechargeOpen} onOpenChange={setIsRechargeOpen}>
              <DialogTrigger asChild>
                <Button className="glow-effect">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Recharge
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recharge Balance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter amount (e.g., 1000000000)"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleRecharge()}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => setRechargeAmount("1000000")}>$1M</Button>
                    <Button variant="outline" onClick={() => setRechargeAmount("1000000000")}>$1B</Button>
                    <Button variant="outline" onClick={() => setRechargeAmount("1000000000000")}>$1T</Button>
                  </div>
                  <Button onClick={handleRecharge} className="w-full">
                    Recharge Balance
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={() => navigate("/history")}
              className="glow-effect"
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
              className="glow-effect"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="glow-effect"
            >
              Exit Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Side - Live Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-96 bg-chart-bg">
            {/* Chart Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-bold text-foreground">EUR/USD</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">1m</Button>
                  <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">5m</Button>
                  <Button variant="outline" size="sm">15m</Button>
                  <Button variant="outline" size="sm">1H</Button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono text-primary">
                  {price.toFixed(5)}
                </div>
                <div className="text-sm text-success">+0.05%</div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-64 overflow-hidden">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-10 grid-rows-8 h-full w-full">
                  {Array.from({ length: 80 }).map((_, i) => (
                    <div key={i} className="border border-chart-grid"></div>
                  ))}
                </div>
              </div>
              
              {/* Price Line */}
              <div 
                className="absolute w-full h-0.5 bg-primary z-10"
                style={{ top: `${50 + (1.2345 - price) * 10000}%` }}
              />

              {/* Candlesticks */}
              <div className="relative z-10 h-full flex items-end justify-center space-x-1 overflow-hidden">
                {candlesticks.map((candle, index) => (
                  <div
                    key={index}
                    className={`w-2 rounded-sm transition-all duration-300 ${
                      candle.type === 'bull' ? 'bg-success' : 'bg-destructive'
                    }`}
                    style={{
                      height: `${Math.min(90, Math.max(5, Math.abs((candle.price - 1.23) * 2000)))}%`,
                      opacity: Math.max(0.3, 1 - (candlesticks.length - index) * 0.02)
                    }}
                    title={`${candle.time}: ${candle.price.toFixed(5)}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - Trade Controls */}
        <div className="space-y-6">
          <Card className="p-6 glow-effect">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Trade Control Panel
            </h3>

            <div className="space-y-6">
              {/* Trade Amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enter Amount ($)
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  disabled={isTrading}
                  className="text-center text-lg"
                />
              </div>

              {/* Countdown Display */}
              {isTrading && (
                <div className="text-center py-4">
                  <div className="text-6xl font-bold text-primary countdown-animation mb-2">
                    {countdown}
                  </div>
                  <div className="text-lg text-foreground mb-1">
                    Trade ends in: {countdown}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {activeTrade?.type.toUpperCase()} - ${activeTrade?.amount.toLocaleString()}
                  </div>
                </div>
              )}

              {/* Trade Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => startTrade("call")}
                  disabled={isTrading}
                  className="call-button trade-button flex items-center justify-center gap-2 h-16"
                  size="lg"
                >
                  <ArrowUp className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-lg font-bold">CALL</div>
                    <div className="text-xs opacity-80">⬆️ UP</div>
                  </div>
                </Button>

                <Button
                  onClick={() => startTrade("put")}
                  disabled={isTrading}
                  className="put-button trade-button flex items-center justify-center gap-2 h-16"
                  size="lg"
                >
                  <ArrowDown className="w-8 h-8" />
                  <div className="text-left">
                    <div className="text-lg font-bold">PUT</div>
                    <div className="text-xs opacity-80">⬇️ DOWN</div>
                  </div>
                </Button>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {["10", "100", "1000", "10000"].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setTradeAmount(amount)}
                    disabled={isTrading}
                    className="text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              {!isTrading && (
                <div className="text-center text-xs text-muted-foreground space-y-1">
                  <p>Each trade runs for exactly 5 seconds</p>
                  <p>Win: +80% profit | Loss: -100% amount</p>
                  <p>Welcome, {username}!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;