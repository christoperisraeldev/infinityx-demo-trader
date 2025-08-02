import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Trade {
  type: "call" | "put";
  amount: number;
  startTime: number;
}

interface TradeControlsProps {
  balance: number;
  onTradeResult: (amount: number, isWin: boolean) => void;
}

export const TradeControls = ({ balance, onTradeResult }: TradeControlsProps) => {
  const [tradeAmount, setTradeAmount] = useState("100");
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [countdown, setCountdown] = useState(0);

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
      type,
      amount,
      startTime: Date.now()
    };

    setActiveTrade(trade);
    setCountdown(5);

    // Start countdown
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
      description: `$${amount} - 5 seconds remaining`,
      className: "glow-effect"
    });
  };

  const finishTrade = (trade: Trade) => {
    // Random win/loss for demo (60% win rate)
    const isWin = Math.random() > 0.4;
    
    onTradeResult(trade.amount, isWin);
    
    const resultClass = isWin ? "success-glow" : "loss-glow";
    const resultMessage = isWin 
      ? `You Won! +$${(trade.amount * 0.8).toFixed(2)} profit`
      : `You Lost! -$${trade.amount.toFixed(2)}`;

    toast({
      title: isWin ? "🎉 Trade Won!" : "💸 Trade Lost",
      description: resultMessage,
      className: resultClass
    });

    setActiveTrade(null);
    setCountdown(0);
  };

  const isTrading = activeTrade !== null;

  return (
    <Card className="p-6 glow-effect">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">
        Trade Controls
      </h3>

      <div className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
            Trade Amount ($)
          </label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
            disabled={isTrading}
            className="text-center text-lg"
          />
        </div>

        {isTrading && (
          <div className="text-center">
            <div className="text-6xl font-bold text-primary countdown-animation mb-2">
              {countdown}
            </div>
            <div className="text-sm text-muted-foreground">
              {activeTrade?.type.toUpperCase()} trade in progress...
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => startTrade("call")}
            disabled={isTrading}
            className="call-button trade-button flex items-center justify-center gap-2"
            size="lg"
          >
            <ArrowUp className="w-6 h-6" />
            CALL
          </Button>

          <Button
            onClick={() => startTrade("put")}
            disabled={isTrading}
            className="put-button trade-button flex items-center justify-center gap-2"
            size="lg"
          >
            <ArrowDown className="w-6 h-6" />
            PUT
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {["10", "50", "100", "500"].map((amount) => (
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
          <div className="text-center text-xs text-muted-foreground">
            <p>Each trade runs for exactly 5 seconds</p>
            <p>Win: +80% profit | Loss: -100% amount</p>
          </div>
        )}
      </div>
    </Card>
  );
};