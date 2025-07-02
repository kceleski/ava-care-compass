import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Star, Clock, ExternalLink, Navigation } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SearchResultsSummary from '@/components/SearchResultsSummary';

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
  const [searchResultId, setSearchResultId] = useState<string | null>(null);
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
      // Build search query for SerperAPI
      let searchQuery = filters.facility_type || 'assisted living';
      
      if (filters.accepts_medicare) {
        searchQuery += ' medicare accepted';
      }
      if (filters.accepts_medicaid) {
        searchQuery += ' medicaid accepted';
      }

      const searchPayload = {
        query: searchQuery,
        location: filters.location,
        type: 'assisted living',
        num: 20
      };

      // Call SerperAPI edge function
      const { data: searchData, error: searchError } = await supabase.functions.invoke('serper-search', {
        body: searchPayload
      });

      if (searchError) {
        throw searchError;
      }

      // Transform SerperAPI results to match our Facility interface
      const transformedFacilities = searchData.places?.map((place: any) => ({
        id: place.placeId || place.cid || Math.random().toString(),
        name: place.title,
        facility_type: filters.facility_type || 'Assisted Living',
        address_line1: place.address?.split(',')[0] || place.address || '',
        city: place.address?.split(',')[1]?.trim() || '',
        state: place.address?.split(',')[2]?.trim() || '',
        zip_code: place.address?.split(',')[3]?.trim() || '',
        phone: place.phoneNumber || '',
        website: place.website || '',
        description: `${place.title} - ${place.type || 'Senior Care Facility'}`,
        rating: place.rating || 0,
        reviews_count: place.ratingCount || 0,
        price_range_min: 3000, // Default values since SerperAPI doesn't provide pricing
        price_range_max: 8000,
        current_availability: Math.floor(Math.random() * 10) + 1, // Mock availability
        accepts_medicare: filters.accepts_medicare,
        accepts_medicaid: filters.accepts_medicaid,
        is_featured: false,
        latitude: place.latitude || 0,
        longitude: place.longitude || 0
      })) || [];

      setFacilities(transformedFacilities);
      setSearchResultId(searchData.searchResultId);
      
      if (transformedFacilities.length === 0) {
        toast({
          title: "No Results",
          description: "No facilities found matching your criteria. Try adjusting your filters.",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${transformedFacilities.length} facilities using live search data.`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search facilities. Please try again.",
        variant: "destructive",
      });
      console.error('Search error:', error);
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

      {searchResultId && (
        <SearchResultsSummary 
          searchResultId={searchResultId} 
          onOpenFacilityDetails={(facility) => {
            // Handle facility detail opening
            console.log('Opening facility details:', facility);
          }}
        />
      )}
    </div>
  );
};

export default FacilityFinder;