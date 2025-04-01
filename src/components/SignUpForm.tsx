
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveParticipant, getClaimedPsalms } from "@/services/tehillimService";

const SignUpForm = ({ onSignUp }: { onSignUp: () => void }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [psalmNumber, setPsalmNumber] = useState("");
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
    
    if (!psalmNumber) {
      toast({
        title: "Please select a psalm",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      saveParticipant({
        name: name.trim(),
        psalmNumber: parseInt(psalmNumber),
      });
      
      toast({
        title: "Thank you for signing up!",
        description: `You have committed to recite Psalm ${psalmNumber}.`,
      });
      
      setName("");
      setPsalmNumber("");
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

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border-tehillim-blue/20">
      <CardHeader>
        <CardTitle className="text-center text-tehillim-blue">Sign Up for a Psalm</CardTitle>
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
            <Label htmlFor="psalm">Select a Psalm</Label>
            <Select value={psalmNumber} onValueChange={setPsalmNumber}>
              <SelectTrigger id="psalm" className="border-tehillim-blue/30 focus:ring-tehillim-blue">
                <SelectValue placeholder="Choose a psalm to recite" />
              </SelectTrigger>
              <SelectContent>
                {psalmNumbers.map((num) => (
                  <SelectItem 
                    key={num} 
                    value={num.toString()}
                    disabled={claimedPsalms.includes(num)}
                    className={claimedPsalms.includes(num) ? "text-gray-400" : ""}
                  >
                    {num} {claimedPsalms.includes(num) ? "(Claimed)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
