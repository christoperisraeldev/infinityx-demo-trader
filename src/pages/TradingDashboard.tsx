import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, Menu, History, Settings as SettingsIcon, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TradingViewWidget from 'react-tradingview-widget';

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
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

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
          <Card className="p-6 bg-chart-bg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">EUR/USD Live Chart</h2>
            </div>
            <div className="h-[500px] w-full">
              <TradingViewWidget
                symbol="FX:EURUSD"
                theme="dark"
                locale="en"
                autosize
                hide_side_toolbar={false}
                allow_symbol_change={true}
                interval="5"
                toolbar_bg="hsl(var(--card))"
                enable_publishing={false}
                hide_top_toolbar={false}
                save_image={false}
                container_id="tradingview_chart"
                style="1"
              />
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