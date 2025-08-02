import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface WelcomeScreenProps {
  onEnterDemo: (username: string) => void;
}

export const WelcomeScreen = ({ onEnterDemo }: WelcomeScreenProps) => {
  const [username, setUsername] = useState("");

  const handleEnterDemo = () => {
    const name = username.trim() || "Demo Trader";
    onEnterDemo(name);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center glow-effect">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            InfinityX Markets™
          </h1>
          <h2 className="text-xl text-foreground mb-4">Demo Trader</h2>
          <p className="text-muted-foreground">
            Unlimited balance. Real experience. Risk nothing.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Demo Username or Nickname
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your demo name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
              onKeyPress={(e) => e.key === "Enter" && handleEnterDemo()}
            />
          </div>

          <Button
            onClick={handleEnterDemo}
            className="w-full trade-button bg-primary hover:bg-primary/90"
            size="lg"
          >
            Enter Demo Mode
          </Button>
        </div>

        <div className="mt-8 text-xs text-muted-foreground">
          <p>This is a demonstration platform for educational purposes only.</p>
          <p>No real money is involved in this demo.</p>
        </div>
      </Card>
    </div>
  );
};