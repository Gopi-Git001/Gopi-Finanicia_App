import { useState } from 'react';
import { Home, User, GraduationCap, Calculator, Bot, Upload, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState([25000]);
  const [loanTerm, setLoanTerm] = useState('60');
  const [calculatedPayment, setCalculatedPayment] = useState(468);

  const loanTypes = [
    {
      id: '1',
      type: 'Home Loan',
      description: 'Buy your dream house',
      icon: Home,
      rate: '3.25% - 7.50%',
      maxAmount: '$750,000',
      features: ['Fixed & Variable Rates', 'Up to 30 Year Terms', 'First-time Buyer Programs', 'No Prepayment Penalty']
    },
    {
      id: '2',
      type: 'Personal Loan',
      description: 'For life\'s important moments',
      icon: User,
      rate: '5.99% - 24.99%',
      maxAmount: '$100,000',
      features: ['No Collateral Required', 'Fixed Monthly Payments', 'Same Day Funding', 'Debt Consolidation']
    },
    {
      id: '3',
      type: 'Student Loan',
      description: 'Invest in your education',
      icon: GraduationCap,
      rate: '4.50% - 12.99%',
      maxAmount: '$200,000',
      features: ['Deferred Payment Options', 'No Origination Fees', 'Cosigner Release', 'Interest Rate Reductions']
    }
  ];

  const activeLoans = [
    {
      id: '1',
      type: 'Personal Loan',
      amount: '$25,000',
      balance: '$18,450',
      monthlyPayment: '$468',
      nextPayment: '2024-02-15',
      status: 'Current',
      rate: '5.99%'
    },
    {
      id: '2',
      type: 'Auto Loan',
      amount: '$35,000',
      balance: '$12,300',
      monthlyPayment: '$520',
      nextPayment: '2024-02-20',
      status: 'Current',
      rate: '4.25%'
    }
  ];

  const calculateMonthlyPayment = (amount: number, term: number, rate: number = 5.99) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  };

  const handleAmountChange = (value: number[]) => {
    setLoanAmount(value);
    const payment = calculateMonthlyPayment(value[0], parseInt(loanTerm));
    setCalculatedPayment(payment);
  };

  const handleTermChange = (value: string) => {
    setLoanTerm(value);
    const payment = calculateMonthlyPayment(loanAmount[0], parseInt(value));
    setCalculatedPayment(payment);
  };

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Affordable loans. Clear terms.</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the funding you need with competitive rates and transparent terms.
          </p>
        </div>

        {/* Loan Calculator */}
        <div className="swiss-card bg-accent/5 border-accent/20 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold">Loan Calculator</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Loan Amount: ${loanAmount[0].toLocaleString()}
                </Label>
                <Slider
                  value={loanAmount}
                  onValueChange={handleAmountChange}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>$1,000</span>
                  <span>$100,000</span>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium mb-4 block">Loan Term</Label>
                <Select value={loanTerm} onValueChange={handleTermChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                    <SelectItem value="84">84 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="text-center p-8 bg-background rounded-lg border">
                <div className="text-sm text-muted-foreground mb-2">Your estimated monthly payment</div>
                <div className="text-4xl font-bold text-accent mb-4">${calculatedPayment}</div>
                <div className="text-sm text-muted-foreground">
                  Based on 5.99% APR • {loanTerm} months
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Best Offer Banner */}
        <div className="swiss-card bg-accent text-accent-foreground mb-16">
          <div className="flex items-start space-x-4">
            <Bot className="h-8 w-8 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">AI-Powered Best Offer</h3>
              <p className="opacity-90 mb-4">
                Based on your profile, this is your best rate: <strong>5.99% APR</strong> for a personal loan up to $50,000.
              </p>
              <Button variant="secondary">
                Get Pre-Approved
              </Button>
            </div>
          </div>
        </div>

        {/* Loan Types */}
        <div className="mb-16">
          <h2 className="mb-8">Choose Your Loan Type</h2>
          <div className="swiss-grid swiss-grid-3">
            {loanTypes.map((loan) => (
              <div key={loan.id} className="swiss-card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <loan.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{loan.type}</h3>
                    <p className="text-sm text-muted-foreground">{loan.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Interest Rate</span>
                    <span className="text-sm font-medium">{loan.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Amount</span>
                    <span className="text-sm font-medium">{loan.maxAmount}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {loan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {loan.type}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Enter first name" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Enter last name" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label htmlFor="income">Annual Income</Label>
                        <Input id="income" placeholder="$0" />
                      </div>
                      <div>
                        <Label htmlFor="loanPurpose">Loan Purpose</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debt-consolidation">Debt Consolidation</SelectItem>
                            <SelectItem value="home-improvement">Home Improvement</SelectItem>
                            <SelectItem value="vacation">Vacation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">Continue Application</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>

        {/* Active Loans */}
        <div className="mb-16">
          <h2 className="mb-8">Your Active Loans</h2>
          <div className="space-y-4">
            {activeLoans.map((loan) => (
              <Card key={loan.id}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <div className="font-semibold">{loan.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {loan.amount} loan
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Balance</div>
                      <div className="font-medium">{loan.balance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Monthly Payment</div>
                      <div className="font-medium">{loan.monthlyPayment}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Next Payment</div>
                        <div className="font-medium">{loan.nextPayment}</div>
                      </div>
                      <Badge variant="secondary">{loan.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="swiss-card">
          <h3 className="font-semibold mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Quick Document Upload
          </h3>
          <p className="text-muted-foreground mb-6">
            Speed up your application by uploading required documents
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drag & drop documents or click to upload</p>
            <p className="text-sm text-muted-foreground mb-4">
              Accepted formats: PDF, JPG, PNG (Max 10MB per file)
            </p>
            <Button variant="outline">Select Files</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;