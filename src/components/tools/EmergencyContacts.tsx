import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Phone, AlertTriangle, Plus, Clock, Users, Trash2, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  contact_type: string;
  description: string;
  available_24_7: boolean;
  location_specific?: string;
}

interface UserEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  is_primary: boolean;
}

const EmergencyContacts = () => {
  const [emergencyHotlines, setEmergencyHotlines] = useState<EmergencyContact[]>([]);
  const [personalContacts, setPersonalContacts] = useState<UserEmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    is_primary: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      // Fetch emergency hotlines
      const { data: hotlines, error: hotlinesError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('available_24_7', { ascending: false })
        .order('contact_type');

      if (hotlinesError) throw hotlinesError;

      // Fetch personal emergency contacts (mock data for demo since auth not implemented)
      // In real app: .eq('user_id', auth.uid())
      const { data: personal, error: personalError } = await supabase
        .from('user_emergency_contacts')
        .select('*')
        .order('is_primary', { ascending: false });

      if (personalError && personalError.code !== 'PGRST116') {
        throw personalError;
      }

      setEmergencyHotlines(hotlines || []);
      setPersonalContacts(personal || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load emergency contacts",
        variant: "destructive",
      });
    }
  };

  const addPersonalContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('user_emergency_contacts')
        .insert([{
          ...newContact,
          user_id: 'anonymous' // In real app, this would be auth.uid()
        }]);

      if (error) throw error;

      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully",
      });

      setShowAddForm(false);
      setNewContact({ name: '', relationship: '', phone: '', is_primary: false });
      fetchContacts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add emergency contact",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePersonalContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('user_emergency_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Contact Deleted",
        description: "Emergency contact has been removed",
      });

      fetchContacts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const callNumber = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return <Heart className="h-4 w-4" />;
      case 'mental_health':
        return <Heart className="h-4 w-4" />;
      case 'general':
        return <Phone className="h-4 w-4" />;
      case 'local_service':
        return <Users className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'medical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mental_health':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'general':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'local_service':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Emergency Hotlines */}
      <Card className="glass-card border-red-200">
        <CardHeader className="bg-red-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-red-800">🚨 Emergency Hotlines</CardTitle>
              <CardDescription className="text-red-600">
                24/7 crisis support and emergency services
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-4">
            {emergencyHotlines.map((contact) => (
              <Card key={contact.id} className="border border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-text-primary">{contact.name}</h4>
                        <Badge className={getContactTypeColor(contact.contact_type)}>
                          {getContactTypeIcon(contact.contact_type)}
                          <span className="ml-1 capitalize">{contact.contact_type.replace('_', ' ')}</span>
                        </Badge>
                        {contact.available_24_7 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Clock className="h-3 w-3 mr-1" />
                            24/7
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{contact.description}</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-text-secondary" />
                        <span className="font-mono text-lg font-semibold text-text-primary">
                          {contact.phone}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => callNumber(contact.phone)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      size="lg"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personal Emergency Contacts */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-bright/10 rounded-lg">
                <Users className="h-6 w-6 text-primary-bright" />
              </div>
              <div>
                <CardTitle className="text-xl text-text-primary">👥 Personal Emergency Contacts</CardTitle>
                <CardDescription>
                  Your family and friends for emergency situations
                </CardDescription>
              </div>
            </div>
            
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="bg-primary-bright hover:bg-primary-dark text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add a family member or friend who can be contacted in case of an emergency.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select value={newContact.relationship} onValueChange={(value) => setNewContact({...newContact, relationship: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="neighbor">Neighbor</SelectItem>
                        <SelectItem value="caregiver">Caregiver</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="primary"
                      checked={newContact.is_primary}
                      onCheckedChange={(checked) => setNewContact({...newContact, is_primary: checked as boolean})}
                    />
                    <Label htmlFor="primary" className="text-sm">
                      Primary emergency contact
                    </Label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={addPersonalContact} 
                      disabled={loading}
                      className="flex-1 bg-primary-bright hover:bg-primary-dark text-white"
                    >
                      {loading ? 'Adding...' : 'Add Contact'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {personalContacts.length > 0 ? (
            <div className="grid gap-4">
              {personalContacts.map((contact) => (
                <Card key={contact.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-text-primary">{contact.name}</h4>
                          {contact.is_primary && (
                            <Badge className="bg-primary-bright text-white">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-2 capitalize">{contact.relationship}</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-text-secondary" />
                          <span className="font-mono text-text-primary">{contact.phone}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => callNumber(contact.phone)}
                          className="bg-primary-bright hover:bg-primary-dark text-white"
                        >
                          <Phone className="mr-1 h-4 w-4" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deletePersonalContact(contact.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No Personal Contacts</h3>
              <p className="text-text-secondary mb-4">
                Add family members or friends who can be contacted in emergencies
              </p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-primary-bright hover:bg-primary-dark text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContacts;