import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign, MapPin, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CareType {
  id: string;
  name: string;
  description: string;
  base_hourly_rate: number;
  category: string;
}

interface CostBreakdown {
  base_care: number;
  location_adjustment: number;
  total_weekly: number;
  total_monthly: number;
}

const CostCalculator = () => {
  const [careTypes, setCareTypes] = useState<CareType[]>([]);
  const [formData, setFormData] = useState({
    care_type_id: '',
    state: '',
    city: '',
    hours_per_week: 40
  });
  const [results, setResults] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCareTypes();
  }, []);

  const fetchCareTypes = async () => {
    const { data, error } = await supabase
      .from('care_type_definitions')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load care types",
        variant: "destructive",
      });
      return;
    }
    
    setCareTypes(data || []);
  };

  const calculateCosts = async () => {
    if (!formData.care_type_id || !formData.state || !formData.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Get care type details
      const { data: careType } = await supabase
        .from('care_type_definitions')
        .select('*')
        .eq('id', formData.care_type_id)
        .single();

      if (!careType) {
        throw new Error('Care type not found');
      }

      // Get location multiplier
      const { data: locationMult } = await supabase
        .from('location_multipliers')
        .select('*')
        .eq('state', formData.state)
        .eq('city', formData.city)
        .single();

      const multiplier = locationMult?.cost_multiplier || 1.0;
      const baseWeeklyCost = careType.base_hourly_rate * formData.hours_per_week;
      const adjustedCost = baseWeeklyCost * multiplier;
      const totalMonthly = adjustedCost * 4.33; // Average weeks per month

      setResults({
        base_care: baseWeeklyCost,
        location_adjustment: adjustedCost - baseWeeklyCost,
        total_weekly: adjustedCost,
        total_monthly: totalMonthly
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate costs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-bright/10 rounded-lg">
              <Calculator className="h-6 w-6 text-primary-bright" />
            </div>
            <div>
              <CardTitle className="text-xl text-text-primary">Care Cost Calculator</CardTitle>
              <CardDescription>
                Get personalized cost estimates for different types of senior care
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="care_type">Care Type *</Label>
              <Select value={formData.care_type_id} onValueChange={(value) => setFormData({...formData, care_type_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select care type" />
                </SelectTrigger>
                <SelectContent>
                  {careTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name} - ${type.base_hourly_rate}/hr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours per Week</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="168"
                value={formData.hours_per_week}
                onChange={(e) => setFormData({...formData, hours_per_week: parseInt(e.target.value) || 40})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value, city: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({...formData, city: value})} disabled={!formData.state}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {formData.state === 'CA' && (
                    <>
                      <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="San Diego">San Diego</SelectItem>
                      <SelectItem value="Sacramento">Sacramento</SelectItem>
                    </>
                  )}
                  {formData.state === 'TX' && (
                    <>
                      <SelectItem value="Dallas">Dallas</SelectItem>
                      <SelectItem value="Houston">Houston</SelectItem>
                    </>
                  )}
                  {formData.state === 'NY' && (
                    <SelectItem value="New York">New York</SelectItem>
                  )}
                  {formData.state === 'FL' && (
                    <SelectItem value="Miami">Miami</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateCosts}
            disabled={loading || !formData.care_type_id || !formData.state || !formData.city}
            className="w-full bg-primary-bright hover:bg-primary-dark text-white"
          >
            {loading ? (
              <>
                <Calculator className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Calculate Costs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="glass-card animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl text-primary-bright flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Cost Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-primary-bright">
                ${results.total_monthly.toFixed(0)}
              </div>
              <div className="text-text-secondary">per month</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-text-primary">Base Care Cost:</span>
                <span className="font-medium">${results.base_care.toFixed(0)}/week</span>
              </div>
              
              {results.location_adjustment !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-text-primary flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    Location Adjustment:
                  </span>
                  <span className={`font-medium ${results.location_adjustment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {results.location_adjustment > 0 ? '+' : ''}${results.location_adjustment.toFixed(0)}/week
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-text-primary font-medium flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Total Weekly Cost:
                </span>
                <span className="font-bold text-lg">${results.total_weekly.toFixed(0)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-surface-soft rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Note:</strong> This is an estimate based on average rates. Actual costs may vary based on specific care needs, 
                facility amenities, and individual provider pricing. Contact providers directly for detailed quotes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostCalculator;