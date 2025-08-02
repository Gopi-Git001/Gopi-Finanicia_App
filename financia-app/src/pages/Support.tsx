import { useState } from 'react';
import { Search, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const faqItems = [
    {
      id: '1',
      question: 'How do I file an insurance claim?',
      answer: 'You can file a claim through our mobile app, website, or by calling our 24/7 claims hotline. Have your policy number and incident details ready. For faster processing, upload photos and documents directly through the app.',
      category: 'Insurance'
    },
    {
      id: '2',
      question: 'What documents do I need for a loan application?',
      answer: 'Typically you\'ll need: government-issued ID, proof of income (pay stubs, tax returns), bank statements, employment verification, and information about existing debts. Specific requirements may vary by loan type.',
      category: 'Loans'
    },
    {
      id: '3',
      question: 'How often is my credit score updated?',
      answer: 'Your credit score is updated monthly when new information is reported to credit bureaus. You can check your score anytime in our app for free without affecting your credit.',
      category: 'Credit'
    },
    {
      id: '4',
      question: 'Is my personal information secure?',
      answer: 'Yes, we use bank-level encryption and security measures to protect your data. We\'re SOC 2 compliant and never sell your personal information to third parties.',
      category: 'Security'
    },
    {
      id: '5',
      question: 'How do I cancel my insurance policy?',
      answer: 'You can cancel your policy by logging into your account and selecting "Cancel Policy" or by contacting our customer service team. Please note that cancellation terms vary by policy type.',
      category: 'Insurance'
    },
    {
      id: '6',
      question: 'What happens if I miss a loan payment?',
      answer: 'Contact us immediately if you think you\'ll miss a payment. We offer payment deferrals and modification options. Late payments may incur fees and affect your credit score.',
      category: 'Loans'
    }
  ];

  const supportTickets = [
    {
      id: 'TKT-2024-001',
      subject: 'Auto insurance claim question',
      status: 'Open',
      priority: 'Medium',
      created: '2024-01-15',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TKT-2024-002',
      subject: 'Loan application status inquiry',
      status: 'In Progress',
      priority: 'High',
      created: '2024-01-10',
      lastUpdate: '2024-01-14'
    },
    {
      id: 'TKT-2023-045',
      subject: 'Credit score discrepancy',
      status: 'Resolved',
      priority: 'Low',
      created: '2023-12-20',
      lastUpdate: '2023-12-22'
    }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!contactForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!contactForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!contactForm.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!contactForm.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (contactForm.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Contact form submitted:', contactForm);
      // Reset form
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <Clock className="h-4 w-4" />;
      case 'In Progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'Resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Need help? Search our FAQ or contact support. We'll reply within 1 business day.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="How can we help you?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>

        <div className="swiss-grid swiss-grid-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <Collapsible key={item.id}>
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <h3 className="font-medium mb-1">{item.question}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
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

            {filteredFAQ.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No results found for "{searchQuery}". Try a different search term or contact support below.
                </p>
              </div>
            )}
          </div>

          {/* Contact & Support */}
          <div className="space-y-8">
            {/* Quick Contact Options */}
            <div>
              <h2 className="mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Live Chat</h3>
                        <p className="text-muted-foreground">Connect to live support</p>
                      </div>
                      <Button>Start Chat</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Phone className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Phone Support</h3>
                        <p className="text-muted-foreground">1-800-FINANCIA</p>
                      </div>
                      <Badge variant="secondary">24/7</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Contact Support</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={contactForm.subject}
                    onValueChange={(value) => setContactForm(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger className={errors.subject ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insurance">Insurance Question</SelectItem>
                      <SelectItem value="loans">Loan Inquiry</SelectItem>
                      <SelectItem value="credit">Credit Score Issue</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue or question..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className={`min-h-[120px] ${errors.message ? 'border-destructive' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive mt-1">{errors.message}</p>
                  )}
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Send Message
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  We'll reply within 1 business day
                </p>
              </CardContent>
            </Card>

            {/* Support Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(ticket.status)}
                          <span className="font-medium">#{ticket.id}</span>
                        </div>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-2">{ticket.subject}</h4>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Created: {ticket.created}</span>
                        <span>Last update: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;