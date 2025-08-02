import { useState } from 'react';
import { Car, Home, Heart, Search, Filter, Plus, MessageCircle, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Insurance = () => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [claimDescription, setClaimDescription] = useState('');

  const insuranceProducts = [
    {
      id: '1',
      type: 'Auto Insurance',
      description: 'Drive safe, pay less',
      icon: Car,
      monthlyPrice: 95,
      yearlyPrice: 1140,
      features: ['Collision Coverage', 'Comprehensive', '24/7 Support', 'Roadside Assistance']
    },
    {
      id: '2',
      type: 'Home Insurance',
      description: 'Protect your biggest investment',
      icon: Home,
      monthlyPrice: 75,
      yearlyPrice: 900,
      features: ['Property Coverage', 'Liability Protection', 'Personal Belongings', 'Natural Disasters']
    },
    {
      id: '3',
      type: 'Life Insurance',
      description: 'Secure your family\'s future',
      icon: Heart,
      monthlyPrice: 45,
      yearlyPrice: 540,
      features: ['Term Life Coverage', 'Beneficiary Support', 'No Medical Exam', 'Flexible Premiums']
    }
  ];

  const activePolicies = [
    {
      id: '1',
      type: 'Auto Insurance',
      provider: 'SafeDrive Insurance',
      premium: '$1,240/year',
      status: 'Active',
      renewalDate: '2024-12-15'
    },
    {
      id: '2',
      type: 'Home Insurance',
      provider: 'SecureHome Co.',
      premium: '$890/year',
      status: 'Active',
      renewalDate: '2024-11-08'
    }
  ];

  const claims = [
    {
      id: 'CLM-2024-001',
      type: 'Auto Insurance',
      description: 'Minor fender bender',
      status: 'In Review',
      submissionDate: '2024-01-15',
      icon: Clock,
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'CLM-2023-045',
      type: 'Home Insurance',
      description: 'Water damage repair',
      status: 'Approved',
      submissionDate: '2023-11-20',
      icon: CheckCircle,
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  const toggleComparison = (productId: string) => {
    setSelectedForComparison(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Find the best insurance for you</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare policies from top providers and protect what matters most to you.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search insurance products..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Insurance Products */}
        <div className="mb-16">
          <h2 className="mb-8">Insurance Products</h2>
          <div className="swiss-grid swiss-grid-3">
            {insuranceProducts.map((product) => (
              <div key={product.id} className="swiss-card">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <product.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{product.type}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-2xl font-bold text-accent">${product.monthlyPrice}/mo</div>
                  <div className="text-sm text-muted-foreground">${product.yearlyPrice}/year</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <Button className="w-full">Get Quote</Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleComparison(product.id)}
                    className={selectedForComparison.includes(product.id) ? 'bg-accent/10' : ''}
                  >
                    {selectedForComparison.includes(product.id) ? 'Remove from Compare' : 'Add to Compare'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Bar */}
          {selectedForComparison.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4">
              <span>{selectedForComparison.length} selected for comparison</span>
              <Button variant="secondary" size="sm">
                Compare Now
              </Button>
            </div>
          )}
        </div>

        {/* Active Policies */}
        <div className="mb-16">
          <h2 className="mb-8">Your Active Policies</h2>
          <div className="swiss-grid swiss-grid-2">
            {activePolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{policy.type}</CardTitle>
                    <Badge variant="secondary">{policy.status}</Badge>
                  </div>
                  <p className="text-muted-foreground">{policy.provider}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium</span>
                      <span className="font-medium">{policy.premium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renewal Date</span>
                      <span className="font-medium">{policy.renewalDate}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Policy Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Claims Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2>Your Claims</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>File New Claim</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>File a New Claim</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Describe your issue
                    </label>
                    <Textarea 
                      placeholder="Please describe what happened..."
                      value={claimDescription}
                      onChange={(e) => setClaimDescription(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Attach photos or documents
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop files here, or click to select
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">Submit Claim</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {claims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <claim.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{claim.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {claim.type} • Claim #{claim.id}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={claim.statusColor}>{claim.status}</Badge>
                      <div className="text-sm text-muted-foreground mt-1">
                        {claim.submissionDate}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Chat Widget */}
        <div className="fixed bottom-6 right-6">
          <Button className="rounded-full w-14 h-14 shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Insurance;