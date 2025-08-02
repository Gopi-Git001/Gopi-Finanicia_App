import { useState } from 'react';
import { Plus, X, Bot, Filter, Share, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Compare = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['1', '2']);
  const [showAISummary, setShowAISummary] = useState(false);
  const [comparisonType, setComparisonType] = useState('insurance');

  const insuranceProducts = [
    {
      id: '1',
      name: 'SafeDrive Auto Insurance',
      provider: 'SafeDrive Insurance',
      monthlyPremium: 95,
      coverageLimit: '$500,000',
      deductible: '$500',
      rating: 4.8,
      features: ['24/7 Roadside Assistance', 'Accident Forgiveness', 'New Car Replacement', 'Rental Coverage']
    },
    {
      id: '2',
      name: 'Guardian Auto Protection',
      provider: 'Guardian Insurance Co.',
      monthlyPremium: 87,
      coverageLimit: '$300,000',
      deductible: '$1,000',
      rating: 4.6,
      features: ['Multi-Car Discount', 'Safe Driver Rewards', 'Mobile Claims', 'Glass Coverage']
    },
    {
      id: '3',
      name: 'Elite Auto Shield',
      provider: 'Elite Coverage',
      monthlyPremium: 112,
      coverageLimit: '$1,000,000',
      deductible: '$250',
      rating: 4.9,
      features: ['Comprehensive Coverage', 'Gap Insurance', 'Premium Roadside', 'Vanishing Deductible']
    }
  ];

  const loanProducts = [
    {
      id: '4',
      name: 'Personal Loan Standard',
      provider: 'Community Bank',
      apr: '7.99%',
      maxAmount: '$50,000',
      term: '5 years',
      rating: 4.7,
      features: ['No Origination Fee', 'Fixed Rate', 'Autopay Discount', 'Early Payoff Allowed']
    },
    {
      id: '5',
      name: 'FlexiLoan Personal',
      provider: 'FlexiBank',
      apr: '5.99%',
      maxAmount: '$75,000',
      term: '7 years',
      rating: 4.8,
      features: ['Rate Match Guarantee', 'Skip-a-Payment Option', 'No Prepayment Penalty', 'Same Day Funding']
    }
  ];

  const creditCards = [
    {
      id: '6',
      name: 'Cashback Rewards Card',
      provider: 'Premier Bank',
      apr: '14.99% - 24.99%',
      creditLimit: '$15,000',
      rewards: '2% cashback',
      rating: 4.5,
      features: ['No Annual Fee', 'Intro 0% APR', 'Purchase Protection', 'Mobile Banking']
    },
    {
      id: '7',
      name: 'Travel Miles Card',
      provider: 'Elite Credit Union',
      apr: '16.99% - 26.99%',
      creditLimit: '$10,000',
      rewards: '3x miles on travel',
      rating: 4.3,
      features: ['Travel Insurance', 'No Foreign Transaction Fees', 'Airport Lounge Access', '50,000 Mile Bonus']
    }
  ];

  const getProductsByType = () => {
    switch (comparisonType) {
      case 'insurance':
        return insuranceProducts;
      case 'loans':
        return loanProducts;
      case 'credit':
        return creditCards;
      default:
        return insuranceProducts;
    }
  };

  const products = getProductsByType();
  const comparedProducts = products.filter(p => selectedProducts.includes(p.id));

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId].slice(0, 3) // Max 3 products
    );
  };

  const clearAll = () => {
    setSelectedProducts([]);
  };

  const getComparisonFields = () => {
    switch (comparisonType) {
      case 'insurance':
        return [
          { key: 'monthlyPremium', label: 'Monthly Premium', format: (val: any) => `$${val}` },
          { key: 'coverageLimit', label: 'Coverage Limit', format: (val: any) => val },
          { key: 'deductible', label: 'Deductible', format: (val: any) => val },
          { key: 'rating', label: 'Customer Rating', format: (val: any) => `${val}/5.0` }
        ];
      case 'loans':
        return [
          { key: 'apr', label: 'APR', format: (val: any) => val },
          { key: 'maxAmount', label: 'Max Amount', format: (val: any) => val },
          { key: 'term', label: 'Term', format: (val: any) => val },
          { key: 'rating', label: 'Customer Rating', format: (val: any) => `${val}/5.0` }
        ];
      case 'credit':
        return [
          { key: 'apr', label: 'APR', format: (val: any) => val },
          { key: 'creditLimit', label: 'Credit Limit', format: (val: any) => `Up to $${val.replace('$', '')}` },
          { key: 'rewards', label: 'Rewards', format: (val: any) => val },
          { key: 'rating', label: 'Customer Rating', format: (val: any) => `${val}/5.0` }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Compare Financial Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Side-by-side comparison to help you make the best financial decisions.
          </p>
        </div>

        {/* Type Selector and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select value={comparisonType} onValueChange={setComparisonType}>
            <SelectTrigger className="md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="loans">Loans</SelectItem>
              <SelectItem value="credit">Credit Cards</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <div className="flex-1" />
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share Results</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Bookmark className="h-4 w-4" />
            <span>Save Comparison</span>
          </Button>
        </div>

        {/* Product Selection */}
        <div className="mb-12">
          <h2 className="mb-6">Available Products</h2>
          <div className="swiss-grid swiss-grid-3">
            {products.map((product) => (
              <Card key={product.id} className={`cursor-pointer transition-all ${
                selectedProducts.includes(product.id) ? 'ring-2 ring-accent bg-accent/5' : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-muted-foreground">{product.provider}</p>
                    </div>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProduct(product.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {comparisonType === 'insurance' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Monthly Premium</span>
                          <span className="text-sm font-medium">${(product as any).monthlyPremium}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Coverage</span>
                          <span className="text-sm font-medium">{(product as any).coverageLimit}</span>
                        </div>
                      </>
                    )}
                    {comparisonType === 'loans' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">APR</span>
                          <span className="text-sm font-medium">{(product as any).apr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Max Amount</span>
                          <span className="text-sm font-medium">{(product as any).maxAmount}</span>
                        </div>
                      </>
                    )}
                    {comparisonType === 'credit' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">APR</span>
                          <span className="text-sm font-medium">{(product as any).apr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rewards</span>
                          <span className="text-sm font-medium">{(product as any).rewards}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.rating}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {comparedProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2>Comparison ({comparedProducts.length} products)</h2>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Feature</th>
                    {comparedProducts.map((product) => (
                      <th key={product.id} className="text-left p-4 font-medium min-w-48">
                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-muted-foreground font-normal">
                            {product.provider}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getComparisonFields().map((field) => (
                    <tr key={field.key} className="border-b hover:bg-muted/30">
                      <td className="p-4 font-medium">{field.label}</td>
                      {comparedProducts.map((product) => (
                        <td key={product.id} className="p-4">
                          {field.format((product as any)[field.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-4 font-medium">Key Features</td>
                    {comparedProducts.map((product) => (
                      <td key={product.id} className="p-4">
                        <ul className="space-y-1">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="text-sm">{feature}</li>
                          ))}
                          {product.features.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{product.features.length - 3} more
                            </li>
                          )}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {comparedProducts.length > 1 && (
          <div className="swiss-card bg-accent/5 border-accent/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">AI Comparison Summary</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAISummary(!showAISummary)}
                  >
                    {showAISummary ? 'Hide' : 'Explain in simple terms'}
                  </Button>
                </div>
                
                {showAISummary && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-muted-foreground">
                      <strong>The main difference is:</strong> {comparedProducts[0].name} offers the lowest cost at 
                      ${comparisonType === 'insurance' ? (comparedProducts[0] as any).monthlyPremium : 'competitive rates'}, 
                      while {comparedProducts[1]?.name} provides better coverage options.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-background rounded-lg">
                        <h4 className="font-medium text-green-600 mb-2">Best for Budget</h4>
                        <p className="text-sm text-muted-foreground">
                          {comparedProducts[0].name} - Lowest monthly cost with essential coverage
                        </p>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <h4 className="font-medium text-blue-600 mb-2">Best Overall Value</h4>
                        <p className="text-sm text-muted-foreground">
                          {comparedProducts[1]?.name} - Best balance of price and features
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;