import { useState } from 'react';
import { User, Mail, Phone, MapPin, Bell, Shield, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Anytown, ST 12345'
  });

  const [notifications, setNotifications] = useState({
    emailMarketing: true,
    pushNotifications: true,
    smsAlerts: false,
    policyReminders: true,
    paymentReminders: true,
    securityAlerts: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const linkedAccounts = [
    { id: '1', name: 'Google', email: 'sarah.johnson@gmail.com', connected: true },
    { id: '2', name: 'Bank of America', type: 'Checking Account', connected: true },
    { id: '3', name: 'Chase Credit Card', type: 'Credit Card', connected: false }
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?1?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSaveProfile = () => {
    const newErrors: {[key: string]: string} = {};

    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(profileData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (profileData.phone && !validatePhone(profileData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Save profile logic
      console.log('Profile saved:', profileData);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = () => {
    const newErrors: {[key: string]: string} = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Change password logic
      console.log('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="swiss-section">
      <div className="swiss-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="mb-4">Profile & Settings</h1>
          <p className="text-xl text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="swiss-grid swiss-grid-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                    <p className="text-muted-foreground">{profileData.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable two-factor authentication for better security
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className={errors.currentPassword ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-sm text-destructive mt-1">{errors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={errors.newPassword ? 'border-destructive' : ''}
                      />
                      {errors.newPassword && (
                        <p className="text-sm text-destructive mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={errors.confirmPassword ? 'border-destructive' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <Button onClick={handlePasswordChange} variant="outline">
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications & Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional offers and updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailMarketing}
                    onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about important updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text message alerts
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('smsAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Policy Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Renewal and payment reminders
                    </p>
                  </div>
                  <Switch
                    checked={notifications.policyReminders}
                    onCheckedChange={(checked) => handleNotificationChange('policyReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Account security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.securityAlerts}
                    onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Linked Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Linked Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {linkedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {account.email || account.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={account.connected ? 'secondary' : 'outline'}>
                        {account.connected ? 'Connected' : 'Not Connected'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {account.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center space-x-2">
                  <Trash2 className="h-5 w-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Account</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Are you sure you want to delete your account? This action cannot be undone.
                        All your data, policies, and account history will be permanently removed.
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="destructive" className="flex-1">
                          Yes, Delete My Account
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;