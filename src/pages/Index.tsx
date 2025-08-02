import { useState } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { TradingDashboard } from "@/components/TradingDashboard";

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);

  const handleEnterDemo = (name: string) => {
    setUsername(name);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  if (!username) {
    return <WelcomeScreen onEnterDemo={handleEnterDemo} />;
  }

  return (
    <TradingDashboard 
      username={username} 
      onLogout={handleLogout} 
    />
  );
};

export default Index;
