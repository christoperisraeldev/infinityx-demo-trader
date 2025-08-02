import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface BalancePanelProps {
  balance: number;
  onRecharge: (amount: number) => void;
}

export const BalancePanel = ({ balance, onRecharge }: BalancePanelProps) => {
  const [rechargeAmount, setRechargeAmount] = useState("");

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount.replace(/[,$]/g, ""));
    if (!isNaN(amount) && amount > 0) {
      onRecharge(amount);
      setRechargeAmount("");
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="p-6 glow-effect">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Demo Balance</h3>
        <div className="balance-display">
          {formatBalance(balance)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="recharge" className="block text-sm font-medium text-foreground mb-2">
            Recharge Amount
          </label>
          <Input
            id="recharge"
            type="text"
            placeholder="Enter amount (e.g., 1000000)"
            value={rechargeAmount}
            onChange={(e) => setRechargeAmount(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleRecharge()}
            className="text-center text-lg"
          />
        </div>

        <Button
          onClick={handleRecharge}
          className="w-full trade-button bg-primary hover:bg-primary/90"
          disabled={!rechargeAmount.trim()}
        >
          Recharge
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRechargeAmount("1000000")}
            className="text-xs"
          >
            $1M
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRechargeAmount("1000000000")}
            className="text-xs"
          >
            $1B
          </Button>
        </div>
      </div>
    </Card>
  );
};