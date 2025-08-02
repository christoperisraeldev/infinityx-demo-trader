import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppSettings {
  chartType: "candlestick" | "line";
  animationsEnabled: boolean;
  soundEnabled: boolean;
  autoRecharge: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AppSettings>({
    chartType: "candlestick",
    animationsEnabled: true,
    soundEnabled: false,
    autoRecharge: false,
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem("appSettings");
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("appSettings", JSON.stringify(newSettings));
    
    toast({
      title: "Settings Updated",
      description: `${key} has been updated`,
      className: "success-glow"
    });
  };

  const resetDemoAccount = () => {
    // Clear trade history
    localStorage.removeItem("tradeHistory");
    
    // Reset settings to default
    const defaultSettings: AppSettings = {
      chartType: "candlestick",
      animationsEnabled: true,
      soundEnabled: false,
      autoRecharge: false,
    };
    setSettings(defaultSettings);
    localStorage.setItem("appSettings", JSON.stringify(defaultSettings));
    
    toast({
      title: "Demo Account Reset",
      description: "All data has been cleared and settings reset to default",
      className: "success-glow"
    });
  };

  const clearAllData = () => {
    localStorage.clear();
    setSettings({
      chartType: "candlestick",
      animationsEnabled: true,
      soundEnabled: false,
      autoRecharge: false,
    });
    
    toast({
      title: "All Data Cleared",
      description: "All application data has been removed",
      className: "loss-glow"
    });
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
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Chart Settings */}
        <Card className="p-6 glow-effect">
          <h2 className="text-xl font-bold text-foreground mb-4">Chart Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Chart Type</div>
                <div className="text-sm text-muted-foreground">
                  Choose between candlestick or line chart
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={settings.chartType === "candlestick" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("chartType", "candlestick")}
                >
                  Candlestick
                </Button>
                <Button
                  variant={settings.chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("chartType", "line")}
                >
                  Line
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Animations</div>
                <div className="text-sm text-muted-foreground">
                  Enable or disable chart animations
                </div>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => updateSetting("animationsEnabled", checked)}
              />
            </div>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="p-6 glow-effect">
          <h2 className="text-xl font-bold text-foreground mb-4">App Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Sound Effects</div>
                <div className="text-sm text-muted-foreground">
                  Play sounds for trade results
                </div>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-foreground">Auto Recharge</div>
                <div className="text-sm text-muted-foreground">
                  Automatically recharge balance when low
                </div>
              </div>
              <Switch
                checked={settings.autoRecharge}
                onCheckedChange={(checked) => updateSetting("autoRecharge", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Demo Account Management */}
        <Card className="p-6 glow-effect">
          <h2 className="text-xl font-bold text-foreground mb-4">Demo Account</h2>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Manage your demo account data and settings
            </div>

            <Button
              onClick={resetDemoAccount}
              variant="outline"
              className="w-full justify-start"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Demo Account
              <span className="ml-auto text-xs text-muted-foreground">
                Clears history, resets settings
              </span>
            </Button>

            <Button
              onClick={clearAllData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
              <span className="ml-auto text-xs">
                Removes everything
              </span>
            </Button>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 glow-effect">
          <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Application:</span>
              <span className="text-primary font-semibold">InfinityX Markets™</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span>Demo 1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-success">Demo Trading</span>
            </div>
            <div className="flex justify-between">
              <span>Risk Level:</span>
              <span className="text-success">Risk-Free</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-2">Disclaimer:</p>
              <p>This is a demonstration platform for educational purposes only. 
              No real money is involved. All trading activities are simulated 
              and do not reflect real market conditions.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;