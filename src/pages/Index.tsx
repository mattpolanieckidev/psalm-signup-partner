
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import SignUpForm from "@/components/SignUpForm";
import ParticipantsList from "@/components/ParticipantsList";
import PrayerRecipients from "@/components/PrayerRecipients";
import Footer from "@/components/Footer";
import { getAllParticipants } from "@/services/tehillimService";
import { Participant } from "@/types";

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadParticipants = async () => {
    setIsLoading(true);
    try {
      const data = await getAllParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Error loading participants:", error);
      toast({
        title: "Error loading participants",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Introduction />
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SignUpForm onSignUp={loadParticipants} />
          </div>
          <div>
            <PrayerRecipients />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full max-w-4xl mx-auto mt-8 text-center text-gray-500">
            Loading participants...
          </div>
        ) : (
          <ParticipantsList participants={participants} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
