import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-accent/10 to-transparent rounded-full animate-pulse delay-1000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-success/20 rounded-full blur-xl animate-float delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-18 h-18 bg-primary/15 rounded-full blur-xl animate-float delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo and Brand */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InfinityX Markets™
            </h1>
          </div>
          <p className="text-xl text-muted-foreground animate-fade-in delay-200">
            The Future of Trading Simulation
          </p>
        </div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in delay-300">
          <h2 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
            Master Trading with
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block">
              Unlimited Virtual Capital
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the thrill of trading without risk. Practice with unlimited virtual money, 
            real market data, and professional-grade tools.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-fade-in delay-500">
          <div className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground text-sm">
              Execute trades instantly with our high-performance platform
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">100% Risk-Free</h3>
            <p className="text-muted-foreground text-sm">
              Practice with virtual money - no real financial risk involved
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl text-center hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real Market Data</h3>
            <p className="text-muted-foreground text-sm">
              Trade with live market data from major exchanges worldwide
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in delay-700">
          <Button 
            onClick={() => navigate('/enter-demo')}
            size="lg"
            className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            Get Started Trading
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No registration required • Start in seconds
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16 animate-fade-in delay-1000">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">∞</div>
            <div className="text-xs text-muted-foreground">Virtual Balance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">24/7</div>
            <div className="text-xs text-muted-foreground">Market Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">0%</div>
            <div className="text-xs text-muted-foreground">Risk Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;