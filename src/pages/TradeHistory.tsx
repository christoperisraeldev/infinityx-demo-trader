import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TradeRecord {
  id: string;
  type: "call" | "put";
  amount: number;
  startTime: number;
  result: "win" | "loss";
  payout: number;
}

const TradeHistory = () => {
  const navigate = useNavigate();
  const [trades, setTrades] = useState<TradeRecord[]>([]);

  useEffect(() => {
    const storedTrades = localStorage.getItem("tradeHistory");
    if (storedTrades) {
      setTrades(JSON.parse(storedTrades));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("tradeHistory");
    setTrades([]);
    toast({
      title: "History Cleared",
      description: "All trade history has been removed",
      className: "success-glow"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTotalProfit = () => {
    return trades.reduce((total, trade) => total + trade.payout, 0);
  };

  const getWinRate = () => {
    if (trades.length === 0) return 0;
    const wins = trades.filter(trade => trade.result === "win").length;
    return (wins / trades.length) * 100;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="glow-effect"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Trading
          </Button>
          <h1 className="text-3xl font-bold text-primary">Trade History</h1>
        </div>

        <Button
          onClick={clearHistory}
          variant="destructive"
          className="glow-effect"
          disabled={trades.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 glow-effect">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{trades.length}</div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </div>
        </Card>

        <Card className="p-4 glow-effect">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {trades.filter(t => t.result === "win").length}
            </div>
            <div className="text-sm text-muted-foreground">Wins</div>
          </div>
        </Card>

        <Card className="p-4 glow-effect">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">
              {trades.filter(t => t.result === "loss").length}
            </div>
            <div className="text-sm text-muted-foreground">Losses</div>
          </div>
        </Card>

        <Card className="p-4 glow-effect">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {getWinRate().toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
        </Card>
      </div>

      {/* Total Profit/Loss */}
      <Card className="p-4 mb-6 glow-effect">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Total Profit/Loss</div>
          <div className={`text-4xl font-bold ${getTotalProfit() >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(getTotalProfit())}
          </div>
        </div>
      </Card>

      {/* Trade History Table */}
      <Card className="glow-effect">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Trades</h2>
          
          {trades.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">No trades yet</div>
              <Button
                onClick={() => navigate("/dashboard")}
                className="glow-effect"
              >
                Start Trading
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-mono text-sm">
                        {formatDateTime(trade.startTime)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {trade.type === "call" ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span className="font-semibold uppercase">
                            {trade.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatCurrency(trade.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            trade.result === "win"
                              ? "bg-success/20 text-success"
                              : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {trade.result.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        <span
                          className={
                            trade.payout >= 0 ? "text-success" : "text-destructive"
                          }
                        >
                          {trade.payout >= 0 ? "+" : ""}
                          {formatCurrency(trade.payout)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradeHistory;