
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/SignUpForm";
import ParticipantsList from "@/components/ParticipantsList";
import { getPrayerRecipientById } from "@/services/prayerService";
import { getParticipantsForRecipient } from "@/services/prayerSelectionService";
import { PrayerRecipient } from "@/services/prayerService";
import { PsalmParticipant } from "@/services/prayerSelectionService";

const RecipientPage = () => {
  const { recipientId } = useParams<{ recipientId: string }>();
  const [recipient, setRecipient] = useState<PrayerRecipient | null>(null);
  const [participants, setParticipants] = useState<PsalmParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!recipientId) {
        toast({
          title: "Error",
          description: "No recipient ID provided",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Load recipient data
        const recipientData = await getPrayerRecipientById(recipientId);
        if (!recipientData) {
          toast({
            title: "Recipient not found",
            description: "The prayer recipient was not found or may have been removed.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        setRecipient(recipientData);
        
        // Load participants for this recipient
        const participantsData = await getParticipantsForRecipient(recipientId);
        setParticipants(participantsData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error loading data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [recipientId, toast]);

  const loadParticipants = async () => {
    if (!recipientId) return;
    
    try {
      const data = await getParticipantsForRecipient(recipientId);
      setParticipants(data);
    } catch (error) {
      console.error("Error loading participants:", error);
      toast({
        title: "Error loading participants",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="w-full text-center mt-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="w-full text-center mt-12">
            <h2 className="text-2xl text-gray-700 mb-4">Recipient Not Found</h2>
            <p className="text-gray-500">The prayer recipient you're looking for doesn't exist or may have been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-tehillim-blue text-center mb-2">
          Pray for {recipient.name}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign up to recite Psalms (Tehillim) for {recipient.name}
        </p>
        
        <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
          <div>
            <SignUpForm 
              onSignUp={loadParticipants} 
              recipientId={recipientId} 
              recipientName={recipient.name}
            />
          </div>
        </div>
        
        {participants.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-tehillim-blue mb-4 text-center">
              People Praying for {recipient.name}
            </h2>
            <ParticipantsList participants={participants} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default RecipientPage;
