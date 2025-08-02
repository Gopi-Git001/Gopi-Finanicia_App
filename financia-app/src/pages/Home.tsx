import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { ArrowRight, Shield, DollarSign, TrendingUp, Bot, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import heroImage from '@/assets/hero-finance.jpg';

const Home = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate(); // Navigation hook

  const features = [
    {
      icon: Shield,
      title: 'Find your best insurance',
      description: 'Compare policies from top providers and save hundreds on premiums.',
    },
    {
      icon: DollarSign,
      title: 'Low-rate loans in minutes',
      description: 'Get approved for personal and home loans with competitive rates.',
    },
    {
      icon: TrendingUp,
      title: 'Track your credit score',
      description: 'Monitor your credit health and get personalized improvement tips.',
    },
    {
      icon: Bot,
      title: 'Personal AI financial assistant',
      description: 'Get instant answers and smart recommendations 24/7.',
    },
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleGetStarted = () => {
    if (validateEmail(email)) {
      // Handle successful email submission
      console.log('Email submitted:', email);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="swiss-section-lg relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Finance Platform Hero" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="swiss-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="mb-6 animate-fade-in">
              Empowering your financial journey. <br />
              <span className="text-accent">Simple. Smart. Secure.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in">
              Compare insurance, apply for loans, and boost your credit — all in one seamless app.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-swiss-primary text-lg animate-fade-in">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Get Started with Financia</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className={emailError ? 'border-destructive' : ''}
                    />
                    {emailError && (
                      <p className="text-sm text-destructive mt-1">{emailError}</p>
                    )}
                  </div>
                  <Button onClick={handleGetStarted} className="w-full">
                    Continue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="swiss-section bg-secondary/30">
        <div className="swiss-container text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-muted-foreground">4.9/5 rating</span>
          </div>
          <p className="text-lg font-medium mb-8">Trusted by over 100,000 users</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="font-semibold">TechCrunch</div>
            <div className="font-semibold">Forbes</div>
            <div className="font-semibold">WSJ</div>
            <div className="font-semibold">Bloomberg</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="swiss-section">
        <div className="swiss-container">
          <div className="text-center mb-16">
            <h2 className="mb-4">Everything you need in one place</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplify your financial life with our comprehensive suite of tools and services.
            </p>
          </div>
          <div className="swiss-grid swiss-grid-4">
            {features.map((feature, index) => (
              <div key={index} className="swiss-card text-center group">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="swiss-section bg-secondary/30">
        <div className="swiss-container">
          <div className="text-center mb-16">
            <h2 className="mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to financial success</p>
          </div>
          <div className="swiss-grid swiss-grid-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground font-bold text-2xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Compare</h3>
              <p className="text-muted-foreground">
                Browse and compare financial products from top providers in real-time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground font-bold text-2xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply</h3>
              <p className="text-muted-foreground">
                Submit your application with our streamlined, secure process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 text-accent-foreground font-bold text-2xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Relax</h3>
              <p className="text-muted-foreground">
                Enjoy better rates and coverage while we handle the details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Highlight */}
      <section className="swiss-section">
        <div className="swiss-container">
          <div className="swiss-card bg-accent text-accent-foreground text-center max-w-4xl mx-auto">
            <div className="flex justify-center items-center mb-6">
              <Bot className="h-12 w-12" />
            </div>
            <h2 className="mb-4">Meet your AI financial assistant</h2>
            <p className="text-xl mb-8 opacity-90">
              Get personalized recommendations, instant answers, and smart insights to make better financial decisions.
            </p>
            {/* Updated Button with navigation */}
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/ai-assistant')}
            >
              Try AI Assistant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="swiss-section-lg bg-primary text-primary-foreground">
        <div className="swiss-container text-center">
          <h2 className="mb-4">Ready to transform your finances?</h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who are already saving money and making smarter financial decisions.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Your Financial Journey</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cta-email">Email Address</Label>
                  <Input
                    id="cta-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    className={emailError ? 'border-destructive' : ''}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive mt-1">{emailError}</p>
                  )}
                </div>
                <Button onClick={handleGetStarted} className="w-full">
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
};

export default Home;