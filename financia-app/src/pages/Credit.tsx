import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Bot, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Credit = () => {
  const [creditScore, setCreditScore] = useState(0);
  const targetScore = 730;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCreditScore(prev => {
          if (prev >= targetScore) {
            clearInterval(interval);
            return targetScore;
          }
          return prev + 5;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(timer);
  }, [targetScore]);

  const getScoreCategory = (score: number) => {
    if (score >= 800) return { category: 'Exceptional', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 740) return { category: 'Very Good', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 670) return { category: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 580) return { category: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { category: 'Poor', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const scoreInfo = getScoreCategory(creditScore);

  const creditFactors = [
    { factor: 'Payment History', impact: 'Excellent', percentage: 95, color: 'bg-green-500' },
    { factor: 'Credit Utilization', impact: 'Good', percentage: 78, color: 'bg-blue-500' },
    { factor: 'Length of Credit History', impact: 'Good', percentage: 82, color: 'bg-blue-500' },
    { factor: 'Credit Mix', impact: 'Fair', percentage: 65, color: 'bg-yellow-500' },
    { factor: 'New Credit', impact: 'Good', percentage: 88, color: 'bg-blue-500' }
  ];

  const preApprovedOffers = [
    {
      id: '1',
      bank: 'Premier Bank',
      cardName: 'Cashback Rewards Card',
      apr: '14.99% - 24.99%',
      creditLimit: 'Up to $15,000',
      rewards: '2% cash back on all purchases',
      annualFee: '$0'
    },
    {
      id: '2',
      bank: 'Elite Credit Union',
      cardName: 'Travel Miles Card',
      apr: '16.99% - 26.99%',
      creditLimit: 'Up to $10,000',
      rewards: '3x miles on travel, 2x on dining',
      annualFee: '$95'
    },
    {
      id: '3',
      bank: 'Metro Financial',
      cardName: 'Balance Transfer Card',
      apr: '0% intro APR for 18 months',
      creditLimit: 'Up to $20,000',
      rewards: '0% balance transfer fee',
      annualFee: '$0'
    }
  ];

  const faqItems = [
    {
      question: 'How often is my credit score updated?',
      answer: 'Your credit score is updated monthly when new information is reported to the credit bureaus. You can check your score here anytime for free.'
    },
    {
      question: 'What factors affect my credit score the most?',
      answer: 'Payment history (35%) and credit utilization (30%) have the biggest impact on your credit score. Always pay on time and keep your credit card balances low.'
    },
    {
      question: 'How can I improve my credit score quickly?',
      answer: 'Pay down existing balances to lower your utilization ratio, make sure all payments are on time, and avoid opening new credit accounts unnecessarily.'
    },
    {
      question: 'Will checking my credit score hurt it?',
      answer: 'No, checking your own credit score is a "soft inquiry" and does not affect your credit score. Only "hard inquiries" from lenders can temporarily lower your score.'
    }
  ];

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Your credit, simplified</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your credit health and get personalized tips to improve your financial future.
          </p>
        </div>

        {/* Credit Score Gauge */}
        <div className="mb-16">
          <div className="swiss-card text-center max-w-2xl mx-auto">
            <h2 className="mb-8">Your Credit Score</h2>
            
            {/* Large Credit Score Display */}
            <div className="relative mb-8">
              <div className="w-48 h-48 mx-auto relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(creditScore / 850) * 283} 283`}
                    className="text-accent transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-accent">{creditScore}</div>
                  <div className={`text-sm font-medium px-3 py-1 rounded-full ${scoreInfo.bgColor} ${scoreInfo.color}`}>
                    {scoreInfo.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Trend */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-medium">Up 12 points this month</span>
            </div>

            <p className="text-muted-foreground">
              Your score is in the <strong>{scoreInfo.category.toLowerCase()}</strong> range. 
              Keep up the good work!
            </p>
          </div>
        </div>

        {/* Credit Factors */}
        <div className="mb-16">
          <h2 className="mb-8">What's affecting your score</h2>
          <div className="space-y-4">
            {creditFactors.map((factor, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{factor.factor}</h3>
                    <Badge variant="secondary">{factor.impact}</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Progress value={factor.percentage} className="flex-1" />
                    <span className="text-sm font-medium w-12">{factor.percentage}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Tips */}
        <div className="swiss-card bg-accent/5 border-accent/20 mb-16">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">AI Credit Tip</h3>
              <p className="text-muted-foreground mb-4">
                Keep utilization below 30% for best results. Your current utilization is 22% - great job! 
                If you pay down your cards by $500, you could see a 15-20 point increase in your score.
              </p>
              <Button className="btn-swiss-accent">
                Get Personalized Tips
              </Button>
            </div>
          </div>
        </div>

        {/* Pre-approved Offers */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2>Pre-approved Credit Card Offers</h2>
            <p className="text-sm text-muted-foreground">Based on your credit profile</p>
          </div>
          
          <div className="space-y-4 overflow-x-auto">
            <div className="flex space-x-6 pb-4" style={{ minWidth: '800px' }}>
              {preApprovedOffers.map((offer) => (
                <Card key={offer.id} className="flex-shrink-0 w-80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{offer.cardName}</CardTitle>
                      <CreditCard className="h-6 w-6 text-accent" />
                    </div>
                    <p className="text-muted-foreground">{offer.bank}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">APR</span>
                        <span className="text-sm font-medium">{offer.apr}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Credit Limit</span>
                        <span className="text-sm font-medium">{offer.creditLimit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Rewards</span>
                        <span className="text-sm font-medium">{offer.rewards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Annual Fee</span>
                        <span className="text-sm font-medium">{offer.annualFee}</span>
                      </div>
                    </div>
                    <Button className="w-full">Apply Today</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Collapsible key={index}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-left">{item.question}</h3>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="border-t pt-4">
                        <p className="text-muted-foreground">{item.answer}</p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credit;