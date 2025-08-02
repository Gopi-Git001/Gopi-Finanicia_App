import { Shield, DollarSign, TrendingUp, Bot, Bell, FileText, Phone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const userName = "Sarah";
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="swiss-section">
      <div className="swiss-container">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="mb-2">{greeting}, {userName}</h1>
          <p className="text-xl text-muted-foreground">Here's what's happening with your finances today.</p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="swiss-grid swiss-grid-3 mb-12">
          {/* Insurance Card */}
          <div className="swiss-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold">Your Insurance</h3>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <p className="text-muted-foreground mb-4">Auto & Home policies at a glance</p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Auto Policy</span>
                <span className="text-sm font-medium">$1,240/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Home Policy</span>
                <span className="text-sm font-medium">$890/year</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </div>

          {/* Loan Card */}
          <div className="swiss-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold">Loan Status</h3>
              </div>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
            <p className="text-muted-foreground mb-4">Personal loan application</p>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-medium">$25,000</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Rate</span>
                <span className="text-sm font-medium">5.99% APR</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Loan Details
            </Button>
          </div>

          {/* Credit Score Card */}
          <div className="swiss-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-semibold">Credit Score</h3>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">↑12</span>
              </div>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-accent mb-1">730</div>
              <div className="text-sm text-muted-foreground">Excellent</div>
            </div>
            <p className="text-sm text-muted-foreground text-center mb-4">Up 12 points this month</p>
            <Button variant="outline" size="sm" className="w-full">
              View Report
            </Button>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="swiss-card bg-accent/5 border-accent/20 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">AI Insight</h3>
              <p className="text-muted-foreground mb-4">
                Your premium could drop next month! Your driving score has improved by 15% - this could save you up to $180 on your auto insurance renewal.
              </p>
              <Button size="sm" className="btn-swiss-accent">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="mb-6">Quick Actions</h2>
          <div className="swiss-grid swiss-grid-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">File a Claim</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Apply for Loan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <RefreshCw className="h-6 w-6" />
              <span className="text-sm">Update Info</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Phone className="h-6 w-6" />
              <span className="text-sm">Contact Support</span>
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="swiss-card">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications right now</p>
            <p className="text-sm text-muted-foreground mt-2">We'll let you know when something important happens</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;