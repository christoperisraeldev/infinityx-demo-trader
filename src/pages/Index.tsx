import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleEnterDemo = () => {
    const name = username.trim() || "Demo Trader";
    navigate("/dashboard", { state: { username: name } });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div 
              key={i} 
              className="border border-primary/20 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + (i % 3)}s` 
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-20 ${
              i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-success' : 'bg-destructive'
            }`}
            style={{
              width: `${20 + (i % 4) * 10}px`,
              height: `${20 + (i % 4) * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <Card className="w-full max-w-md p-8 text-center glow-effect relative z-10 bg-card/95 backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-primary mb-4 tracking-tight">
            InfinityX Markets™
          </h1>
          <h2 className="text-2xl text-foreground mb-4 font-semibold">Demo Trader</h2>
          <p className="text-muted-foreground text-lg">
            Unlimited balance. Real experience. Risk nothing.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-foreground mb-3">
              Enter your trader name
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Your trading name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-lg py-3"
              onKeyPress={(e) => e.key === "Enter" && handleEnterDemo()}
            />
          </div>

          <Button
            onClick={handleEnterDemo}
            className="w-full trade-button bg-primary hover:bg-primary/90 text-lg py-6"
            size="lg"
          >
            Start Trading
          </Button>
        </div>

        <div className="mt-8 space-y-2 text-xs text-muted-foreground">
          <p>✅ No registration required</p>
          <p>✅ Unlimited virtual balance</p>
          <p>✅ Real trading experience</p>
          <p>⚠️ Educational purposes only - No real money involved</p>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            This is a demonstration platform showcasing binary options trading mechanics.
            All trades are simulated and no actual financial risk is involved.
          </p>
        </div>
      </Card>

    </div>
  );
};

export default Index;
