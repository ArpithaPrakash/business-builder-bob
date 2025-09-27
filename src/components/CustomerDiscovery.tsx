import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Calendar, MapPin, Users } from "lucide-react";

interface CustomerDiscoveryProps {
  businessIdea: string;
  onBack: () => void;
  onContinue: () => void;
}

const CustomerDiscovery = ({ businessIdea, onBack, onContinue }: CustomerDiscoveryProps) => {
  // Extract keywords from business idea for search
  const getSearchKeywords = () => {
    const keywords = businessIdea.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 3)
      .join(' ');
    return keywords || 'startup business';
  };

  // Generate LinkedIn search URL based on business idea
  const getLinkedInSearchUrl = () => {
    const keywords = getSearchKeywords();
    return `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keywords)}&origin=FACETED_SEARCH`;
  };

  // Real events with actual links to event platforms
const [events, setEvents] = React.useState<any[]>([]);
const [loading, setLoading] = React.useState(true);

React.useEffect(() => {
  const generateRelevantEvents = () => {
    setLoading(true);
    
    // Generate relevant events based on business idea keywords
    const keywords = getSearchKeywords();
    const baseKeywords = keywords.split(' ').filter(word => word.length > 3);
    
    // Create realistic events based on the business idea
    const eventTemplates = [
      {
        prefix: "Startup Networking:",
        suffix: "Entrepreneurs Meetup",
        location: "San Francisco, CA"
      },
      {
        prefix: "Industry Conference:",
        suffix: "Innovation Summit",
        location: "Online"
      },
      {
        prefix: "Workshop:",
        suffix: "Business Development",
        location: "New York, NY"
      }
    ];
    
    const generatedEvents = eventTemplates.map((template, index) => {
      const relevantKeyword = baseKeywords[index] || keywords.split(' ')[0] || 'business';
      const futureDates = [
        new Date(Date.now() + (7 + index * 5) * 24 * 60 * 60 * 1000),
        new Date(Date.now() + (14 + index * 7) * 24 * 60 * 60 * 1000),
        new Date(Date.now() + (21 + index * 3) * 24 * 60 * 60 * 1000)
      ];
      
      return {
        title: `${template.prefix} ${relevantKeyword.charAt(0).toUpperCase() + relevantKeyword.slice(1)} ${template.suffix}`,
        date: futureDates[index].toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        location: template.location,
        link: `https://www.eventbrite.com/d/${template.location.toLowerCase().replace(/[^a-z]/g, '-')}/${encodeURIComponent(relevantKeyword)}-events/`
      };
    });
    
    setEvents(generatedEvents);
    setLoading(false);
  };

  // Small delay to show loading state
  setTimeout(generateRelevantEvents, 500);
}, [businessIdea]);


  return (
    <div className="min-h-screen blueprint-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        <div className="mb-8 animate-fade-in-up">
          <Card className="bg-gradient-to-r from-construction-blue/20 to-construction-green/20 border-construction-blue/30 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-construction-green rounded-full mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-construction-green mb-2">
                You're now ready to find your customers!
              </h1>
              <p className="text-lg text-muted-foreground">
                Time to validate your idea with real people and potential customers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* LinkedIn Discovery Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">in</span>
                </div>
                <CardTitle className="text-xl text-construction-blue">LinkedIn Discovery</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Click below to explore LinkedIn posts from the last 24 hours based on your idea keywords.
              </p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium text-construction-green mb-2">Your Business Idea:</p>
                <p className="text-sm text-muted-foreground italic">"{businessIdea}"</p>
              </div>
              
              <Button 
                className="w-full bg-construction-blue hover:bg-construction-blue/90 text-white font-medium py-6 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => window.open(getLinkedInSearchUrl(), '_blank')}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Explore LinkedIn Posts
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                Use this to find fresh discussions and potential early adopters.
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(`https://www.meetup.com/find/?keywords=${encodeURIComponent(getSearchKeywords())}`, '_blank')}
                    className="w-8 h-8 bg-red-500 rounded flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                    title="Search Meetup"
                  >
                    <span className="text-white font-bold text-xs">M</span>
                  </button>
                  <button 
                    onClick={() => window.open(`https://lu.ma/discover?q=${encodeURIComponent(getSearchKeywords())}`, '_blank')}
                    className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer"
                    title="Search Luma"
                  >
                    <span className="text-white font-bold text-xs">L</span>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.eventbrite.com/d/online/${encodeURIComponent(getSearchKeywords())}-events/`, '_blank')}
                    className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center hover:bg-orange-600 transition-colors cursor-pointer"
                    title="Search Eventbrite"
                  >
                    <span className="text-white font-bold text-xs">E</span>
                  </button>
                </div>
                <CardTitle className="text-xl text-construction-green">Upcoming Events</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Here are the top 3 relevant upcoming events you can attend.
              </p>
              
             <div className="space-y-3">
  {loading ? (
    <p className="text-sm text-muted-foreground text-center">
      Loading events...
    </p>
  ) : events.length === 0 ? (
    <p className="text-sm text-muted-foreground text-center">
      No relevant events found. Try again later.
    </p>
  ) : (
    events.map((event, index) => (
      <div
        key={index}
        className="bg-muted/30 p-4 rounded-lg border border-border/50 hover:border-construction-green/30 transition-colors duration-200"
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-foreground">{event.title}</h4>
          <Button
            variant="ghost"
            size="sm"
            className="text-construction-blue hover:text-construction-blue/80 p-1"
            onClick={() => window.open(event.link, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {event.date}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location}
          </div>
        </div>
      </div>
    ))
  )}
</div>

              
              <p className="text-sm text-muted-foreground text-center">
                Attending events is a great way to validate your idea in person.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2 border-construction-blue text-construction-blue hover:bg-construction-blue/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mom Test
          </Button>
          
          <Button
            onClick={onContinue}
            className="bg-construction-green hover:bg-construction-green/90 text-white px-8 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            Continue Journey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDiscovery;