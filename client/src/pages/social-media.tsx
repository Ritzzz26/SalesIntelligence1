import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, User, Clock, Check, BarChart4, RefreshCw, Twitter, Linkedin, Facebook } from "lucide-react";

type SocialMediaPlatform = {
  id: number;
  name: string;
  icon: string | null;
  enabled: boolean | null;
  lastSyncedAt: string | null;
  apiKey: string | null;
};

type SocialMediaLead = {
  id: number;
  username: string;
  name: string | null;
  message: string | null;
  status: string;
  platformId: number;
  interactionType: string;
  interactionDate: string;
  sentiment: string | null;
  profileUrl: string | null;
  originalPostUrl: string | null;
  metadata: string | null;
  convertedToLeadId: number | null;
  assignedUserId: number | null;
};

const SocialMediaDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Fetch social media platforms
  const platformsQuery = useQuery({
    queryKey: ['/api/social-media/platforms'],
    retry: false
  });
  
  // Fetch social media leads
  const leadsQuery = useQuery({
    queryKey: ['/api/social-media/leads'],
    retry: false
  });
  
  // Platform Icon component
  const PlatformIcon: React.FC<{ name: string | null }> = ({ name }) => {
    switch (name?.toLowerCase()) {
      case 'twitter':
        return <Twitter className="text-blue-400 text-xl" />;
      case 'linkedin':
        return <Linkedin className="text-blue-600 text-xl" />;
      case 'facebook':
        return <Facebook className="text-blue-800 text-xl" />;
      default:
        return <MessageSquare className="text-gray-400 text-xl" />;
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-500';
      case 'contacted':
        return 'bg-yellow-500';
      case 'qualified':
        return 'bg-green-500';
      case 'converted':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Get sentiment color
  const getSentimentColor = (sentiment: string | null) => {
    if (!sentiment) return 'text-gray-400';
    
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Filter leads by platform if a platform tab is selected
  const filteredLeads = Array.isArray(leadsQuery.data)
    ? activeTab === "all"
      ? leadsQuery.data
      : leadsQuery.data.filter(lead => lead.platformId === parseInt(activeTab))
    : [];
  
  if (platformsQuery.isLoading || leadsQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading social media data...</span>
      </div>
    );
  }
  
  if (platformsQuery.isError || leadsQuery.isError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Error loading social media data. Please try again later.
              </p>
              <Button onClick={() => {
                platformsQuery.refetch();
                leadsQuery.refetch();
              }}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Social Media Leads</h1>
        <Button 
          variant="outline"
          onClick={() => {
            platformsQuery.refetch();
            leadsQuery.refetch();
          }}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
        {Array.isArray(platformsQuery.data) && platformsQuery.data.map(platform => (
          <Card key={platform.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center">
                <PlatformIcon name={platform.name} />
                <span className="ml-2">{platform.name}</span>
              </CardTitle>
              <Badge 
                variant={platform.enabled ? "default" : "secondary"}
                className="ml-auto"
              >
                {platform.enabled ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {platform.lastSyncedAt 
                      ? `Last sync: ${formatDate(platform.lastSyncedAt)}` 
                      : "Never synced"}
                  </span>
                </div>
                <div>
                  {Array.isArray(leadsQuery.data) && 
                    `${leadsQuery.data.filter(lead => lead.platformId === platform.id).length} leads`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          {Array.isArray(platformsQuery.data) && 
            platformsQuery.data.map(platform => (
              <TabsTrigger key={platform.id} value={platform.id.toString()}>
                {platform.name}
              </TabsTrigger>
            ))
          }
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No leads found for this platform
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map(lead => {
              const platform = Array.isArray(platformsQuery.data) 
                ? platformsQuery.data.find(p => p.id === lead.platformId) 
                : null;
                
              const metadataObj = lead.metadata ? JSON.parse(lead.metadata) : {};
              
              return (
                <Card key={lead.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex p-6 border-b">
                      <div className="mr-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {lead.name?.substring(0, 2).toUpperCase() || lead.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <h3 className="font-semibold">
                              {lead.name || lead.username}
                            </h3>
                            <div className="flex items-center ml-2">
                              <PlatformIcon name={platform?.name || null} />
                              <span className="text-sm text-muted-foreground ml-1">
                                @{lead.username}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                        
                        <p className="mt-1 text-muted-foreground">
                          {lead.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(lead.interactionDate)}</span>
                          </div>
                          <div className={`flex items-center ${getSentimentColor(lead.sentiment)}`}>
                            <BarChart4 className="h-4 w-4 mr-1" />
                            <span>{lead.sentiment || "No sentiment"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {metadataObj && Object.keys(metadataObj).length > 0 && (
                      <div className="bg-muted/50 p-3 text-sm">
                        {metadataObj.followers && (
                          <div className="flex justify-between py-1">
                            <span className="font-medium">Followers:</span>
                            <span>{metadataObj.followers.toLocaleString()}</span>
                          </div>
                        )}
                        {metadataObj.location && (
                          <div className="flex justify-between py-1">
                            <span className="font-medium">Location:</span>
                            <span>{metadataObj.location}</span>
                          </div>
                        )}
                        {metadataObj.title && (
                          <div className="flex justify-between py-1">
                            <span className="font-medium">Title:</span>
                            <span>{metadataObj.title}</span>
                          </div>
                        )}
                        {metadataObj.bio && (
                          <div className="py-1">
                            <span className="font-medium">Bio:</span>
                            <p className="text-muted-foreground mt-1">{metadataObj.bio}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="p-4 flex justify-end space-x-2">
                      {lead.convertedToLeadId ? (
                        <Badge variant="outline" className="flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Converted to Lead
                        </Badge>
                      ) : (
                        <Button size="sm">Convert to Lead</Button>
                      )}
                      
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMediaDashboard;