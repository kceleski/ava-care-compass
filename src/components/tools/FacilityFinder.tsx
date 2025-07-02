import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Star, Clock, ExternalLink, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Facility {
  id: string;
  name: string;
  facility_type: string;
  address_line1: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
  description: string;
  rating: number;
  reviews_count: number;
  price_range_min: number;
  price_range_max: number;
  current_availability: number;
  accepts_medicare: boolean;
  accepts_medicaid: boolean;
  is_featured: boolean;
  latitude: number;
  longitude: number;
}

const FacilityFinder = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    facility_type: '',
    radius: 25,
    accepts_medicare: false,
    accepts_medicaid: false
  });
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  const facilityTypes = [
    'Assisted Living',
    'Memory Care', 
    'Nursing Home',
    'Independent Living',
    'Continuing Care'
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Found",
            description: "Your location has been detected successfully.",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enter a ZIP code.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter a ZIP code to search for facilities.",
        variant: "destructive",
      });
    }
  };

  const searchFacilities = async () => {
    if (!filters.location && !userLocation) {
      toast({
        title: "Location Required",
        description: "Please provide a location or use your current location.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let query = supabase
        .from('facilities')
        .select('*')
        .order('rating', { ascending: false });

      if (filters.facility_type) {
        query = query.eq('facility_type', filters.facility_type);
      }

      if (filters.accepts_medicare) {
        query = query.eq('accepts_medicare', true);
      }

      if (filters.accepts_medicaid) {
        query = query.eq('accepts_medicaid', true);
      }

      // Add location-based filtering here if needed
      // For now, we'll show all facilities and let users filter by location visually

      const { data, error } = await query.limit(20);

      if (error) {
        throw error;
      }

      setFacilities(data || []);
      
      if (data?.length === 0) {
        toast({
          title: "No Results",
          description: "No facilities found matching your criteria. Try adjusting your filters.",
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search facilities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const callFacility = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const visitWebsite = (website: string) => {
    if (website) {
      window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
    }
  };

  const formatAddress = (facility: Facility) => {
    return `${facility.address_line1}, ${facility.city}, ${facility.state} ${facility.zip_code}`;
  };

  const getDirections = (facility: Facility) => {
    const address = encodeURIComponent(formatAddress(facility));
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-bright/10 rounded-lg">
              <MapPin className="h-6 w-6 text-primary-bright" />
            </div>
            <div>
              <CardTitle className="text-xl text-text-primary">Facility Finder</CardTitle>
              <CardDescription>
                Find senior care facilities in your area
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Location</label>
              <div className="space-y-2">
                <Input
                  placeholder="Enter ZIP code or city"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  <Navigation className="mr-2 h-4 w-4" />
                  Use My Location
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Care Type</label>
              <Select value={filters.facility_type} onValueChange={(value) => setFilters({...filters, facility_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {facilityTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Insurance</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.accepts_medicare}
                    onChange={(e) => setFilters({...filters, accepts_medicare: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Medicare</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.accepts_medicaid}
                    onChange={(e) => setFilters({...filters, accepts_medicaid: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Medicaid</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Search Radius</label>
              <Select value={filters.radius.toString()} onValueChange={(value) => setFilters({...filters, radius: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 miles</SelectItem>
                  <SelectItem value="25">25 miles</SelectItem>
                  <SelectItem value="50">50 miles</SelectItem>
                  <SelectItem value="100">100 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={searchFacilities}
            disabled={loading}
            className="w-full bg-primary-bright hover:bg-primary-dark text-white"
          >
            {loading ? (
              <>
                <MapPin className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Find Facilities
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {facilities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              Found {facilities.length} facilities
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {facilities.map((facility) => (
              <Card key={facility.id} className="glass-card hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-text-primary text-lg mb-1">
                        {facility.name}
                      </h4>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {facility.facility_type}
                        </Badge>
                        {facility.is_featured && (
                          <Badge className="bg-warning text-warning-foreground text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    {facility.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium">{facility.rating}</span>
                        <span className="text-sm text-text-secondary">
                          ({facility.reviews_count})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">
                        {formatAddress(facility)}
                      </span>
                    </div>
                    
                    {facility.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{facility.phone}</span>
                      </div>
                    )}

                    {facility.current_availability !== null && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">
                          {facility.current_availability > 0 
                            ? `${facility.current_availability} beds available`
                            : 'No availability'
                          }
                        </span>
                      </div>
                    )}
                  </div>

                  {facility.description && (
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {facility.description}
                    </p>
                  )}

                  {(facility.price_range_min || facility.price_range_max) && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-text-primary">
                        Price Range: ${facility.price_range_min?.toLocaleString()} - ${facility.price_range_max?.toLocaleString()}/month
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mb-4">
                    {facility.accepts_medicare && (
                      <Badge variant="outline" className="text-xs">Medicare</Badge>
                    )}
                    {facility.accepts_medicaid && (
                      <Badge variant="outline" className="text-xs">Medicaid</Badge>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {facility.phone && (
                      <Button
                        size="sm"
                        onClick={() => callFacility(facility.phone)}
                        className="flex-1"
                      >
                        <Phone className="mr-1 h-4 w-4" />
                        Call
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => getDirections(facility)}
                      className="flex-1"
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      Directions
                    </Button>

                    {facility.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => visitWebsite(facility.website)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityFinder;