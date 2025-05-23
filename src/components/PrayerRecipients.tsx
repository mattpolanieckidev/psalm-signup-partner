import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOff, Eye, Copy, Link } from "lucide-react";
import { 
  PrayerRecipient, 
  addPrayerRecipient, 
  getPrayerRecipients, 
  toggleRecipientVisibility,
  generateShareableLink
} from "@/services/prayerService";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface PrayerRecipientsProps {
  showShareLinks?: boolean;
  onRecipientSelect?: (recipient: PrayerRecipient) => void;
  selectedRecipient?: PrayerRecipient | null;
}

const PrayerRecipients = ({ 
  showShareLinks = false, 
  onRecipientSelect, 
  selectedRecipient 
}: PrayerRecipientsProps) => {
  const [recipients, setRecipients] = useState<PrayerRecipient[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const { toast } = useToast();

  const loadRecipients = async () => {
    setIsLoading(true);
    try {
      const data = await getPrayerRecipients(showHidden);
      setRecipients(data);
    } catch (error) {
      console.error("Error loading prayer recipients:", error);
      toast({
        title: "Error loading names",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, [showHidden]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newName.trim()) {
      toast({
        title: "Please enter a name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addPrayerRecipient(newName);
      
      toast({
        title: "Name added successfully",
        description: `We will pray for ${newName}.`,
      });
      
      setNewName("");
      loadRecipients();
    } catch (error) {
      console.error("Error adding prayer recipient:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (id: string, currentlyHidden: boolean) => {
    try {
      const success = await toggleRecipientVisibility(id, !currentlyHidden);
      if (success) {
        toast({
          title: currentlyHidden ? "Name restored" : "Name hidden",
          description: currentlyHidden ? "The name is now visible in the prayer list." : "The name has been hidden from the prayer list.",
        });
        loadRecipients();
      }
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "The shareable link has been copied to your clipboard.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-tehillim-blue/20">
      <CardHeader>
        <CardTitle className="text-center text-tehillim-blue">
          {showShareLinks ? "Manage Prayer Recipients" : "Pray For"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter a name to pray for"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-tehillim-blue/30 focus-visible:ring-tehillim-blue"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-tehillim-blue hover:bg-tehillim-blue/90 text-white"
            >
              Add
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-500">People We Are Praying For:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHidden(!showHidden)}
              className="text-xs h-8 border-tehillim-blue/30"
            >
              {showHidden ? "Hide Archived" : "Show All"}
            </Button>
          </div>
          
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Loading names...</p>
          ) : recipients.length > 0 ? (
            <ul className="space-y-2 max-h-80 overflow-y-auto p-2 border border-tehillim-blue/10 rounded-md">
              {recipients.map((recipient) => (
                <li 
                  key={recipient.id} 
                  className={`flex justify-between items-center text-gray-700 border-b border-tehillim-blue/10 pb-1 last:border-0 
                    ${recipient.hidden ? 'text-gray-400' : ''} 
                    ${onRecipientSelect && selectedRecipient?.id === recipient.id ? 'bg-tehillim-blue/10' : ''}
                    ${onRecipientSelect ? 'cursor-pointer hover:bg-tehillim-blue/5' : ''}`}
                  onClick={() => onRecipientSelect && onRecipientSelect(recipient)}
                >
                  <span>{recipient.name}</span>
                  <div className="flex space-x-1">
                    {showShareLinks && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            title="Get shareable link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link className="h-4 w-4 text-gray-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">Share this link with others so they can pray for {recipient.name}</p>
                            <div className="flex items-center space-x-2">
                              <Input 
                                value={generateShareableLink(recipient.id)} 
                                readOnly 
                                className="text-xs"
                              />
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => copyToClipboard(generateShareableLink(recipient.id))}
                                className="shrink-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(recipient.id, recipient.hidden);
                      }}
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      title={recipient.hidden ? "Restore" : "Hide"}
                    >
                      {recipient.hidden ? 
                        <Eye className="h-4 w-4 text-gray-400" /> : 
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      }
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No names added yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerRecipients;
