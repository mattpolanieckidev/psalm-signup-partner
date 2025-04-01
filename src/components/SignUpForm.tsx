
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { saveParticipant, getClaimedPsalms } from "@/services/tehillimService";
import { ScrollArea } from "@/components/ui/scroll-area";

const SignUpForm = ({ onSignUp }: { onSignUp: () => void }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [selectedPsalms, setSelectedPsalms] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimedPsalms, setClaimedPsalms] = useState<number[]>([]);

  useEffect(() => {
    setClaimedPsalms(getClaimedPsalms());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPsalms.length === 0) {
      toast({
        title: "Please select at least one psalm",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      saveParticipant({
        name: name.trim(),
        psalmNumbers: selectedPsalms,
      });
      
      toast({
        title: "Thank you for signing up!",
        description: `You have committed to recite ${selectedPsalms.length === 1 
          ? `Psalm ${selectedPsalms[0]}` 
          : `Psalms ${selectedPsalms.join(', ')}`}.`,
      });
      
      setName("");
      setSelectedPsalms([]);
      onSignUp();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate psalm numbers 1-150
  const psalmNumbers = Array.from({ length: 150 }, (_, i) => i + 1);
  
  const togglePsalm = (psalmNumber: number) => {
    setSelectedPsalms(prev => 
      prev.includes(psalmNumber) 
        ? prev.filter(p => p !== psalmNumber)
        : [...prev, psalmNumber]
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-tehillim-blue/20">
      <CardHeader>
        <CardTitle className="text-center text-tehillim-blue">Sign Up for Psalms</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your First Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-tehillim-blue/30 focus-visible:ring-tehillim-blue"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Psalms to Recite</Label>
            <p className="text-sm text-gray-500 mb-2">
              You've selected {selectedPsalms.length} psalm{selectedPsalms.length !== 1 ? 's' : ''}
            </p>
            <ScrollArea className="h-60 rounded-md border border-tehillim-blue/30 p-4">
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {psalmNumbers.map((num) => {
                  const isClaimed = claimedPsalms.includes(num) && !selectedPsalms.includes(num);
                  return (
                    <div key={num} className="flex items-center space-x-2">
                      <Checkbox
                        id={`psalm-${num}`}
                        checked={selectedPsalms.includes(num)}
                        onCheckedChange={() => togglePsalm(num)}
                        disabled={isClaimed}
                        className="border-tehillim-blue/50 data-[state=checked]:bg-tehillim-blue data-[state=checked]:text-white"
                      />
                      <Label
                        htmlFor={`psalm-${num}`}
                        className={`text-sm ${isClaimed ? 'text-gray-400' : ''}`}
                      >
                        {num}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          
          <CardFooter className="px-0 pt-4 flex justify-center">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-tehillim-blue hover:bg-tehillim-blue/90 text-white"
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
