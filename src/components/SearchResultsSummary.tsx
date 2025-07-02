import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Star, ExternalLink, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResultsSummaryProps {
  searchResultId: string;
  onOpenFacilityDetails?: (facility: any) => void;
}

interface Place {
  id: string;
  title: string;
  address: string;
  rating: number;
  rating_count: number;
  phone_number: string;
  website: string;
  latitude: number;
  longitude: number;
  place_type: string;
  thumbnail_url: string;
}

interface ConversationSummary {
  summary_text: string;
  markup_content: string;
}

const SearchResultsSummary = ({ searchResultId, onOpenFacilityDetails }: SearchResultsSummaryProps) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Fetch places from the search result
        const { data: placesData, error: placesError } = await supabase
          .from('serperapi_places')
          .select('*')
          .eq('search_result_id', searchResultId)
          .order('position')
          .limit(10);

        if (placesError) throw placesError;

        // Fetch conversation summary
        const { data: summaryData, error: summaryError } = await supabase
          .from('search_conversation_summaries')
          .select('*')
          .eq('search_result_id', searchResultId)
          .single();

        if (summaryError && summaryError.code !== 'PGRST116') {
          console.error('Error fetching summary:', summaryError);
        }

        setPlaces(placesData || []);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (searchResultId) {
      fetchSearchResults();
    }
  }, [searchResultId]);

  const openMapLink = (place: Place) => {
    const query = encodeURIComponent(`${place.title} ${place.address}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const callFacility = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const visitWebsite = (website: string) => {
    if (website) {
      window.open(website.startsWith('http') ? website : `https://${website}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading search results...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {summary && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary-bright" />
              <CardTitle className="text-lg">Search Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-text-secondary whitespace-pre-wrap">{summary.summary_text}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xl">Search Results ({places.length} facilities found)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {places.map((place) => (
              <Card key={place.id} className="border hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onOpenFacilityDetails?.(place)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-1">{place.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {place.place_type || 'Senior Care'}
                      </Badge>
                    </div>
                    {place.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{place.rating}</span>
                        {place.rating_count > 0 && (
                          <span className="text-xs text-text-secondary">({place.rating_count})</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-text-secondary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{place.address}</span>
                    </div>
                    
                    {place.phone_number && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-text-secondary" />
                        <span className="text-sm text-text-secondary">{place.phone_number}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {place.phone_number && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          callFacility(place.phone_number);
                        }}
                        className="flex-1"
                      >
                        <Phone className="mr-1 h-3 w-3" />
                        Call
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMapLink(place);
                      }}
                      className="flex-1"
                    >
                      <MapPin className="mr-1 h-3 w-3" />
                      Map
                    </Button>

                    {place.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          visitWebsite(place.website);
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {place.thumbnail_url && (
                    <div className="mt-3">
                      <img 
                        src={place.thumbnail_url} 
                        alt={place.title}
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResultsSummary;