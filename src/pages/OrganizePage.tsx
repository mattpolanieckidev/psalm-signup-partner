
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrayerRecipients from "@/components/PrayerRecipients";
import ParticipantsList from "@/components/ParticipantsList";
import { useQuery } from "@tanstack/react-query";
import { getParticipantsForRecipient } from "@/services/prayerSelectionService";
import { useState } from "react";
import { PrayerRecipient } from "@/services/prayerService";
import { Participant } from "@/types";

const OrganizePage = () => {
  const [selectedRecipient, setSelectedRecipient] = useState<PrayerRecipient | null>(null);
  const { data: participants = [] } = useQuery({
    queryKey: ['participants', selectedRecipient?.id],
    queryFn: () => selectedRecipient ? getParticipantsForRecipient(selectedRecipient.id) : Promise.resolve([]),
    enabled: !!selectedRecipient,
  });

  const handleRecipientSelect = (recipient: PrayerRecipient) => {
    setSelectedRecipient(recipient);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-tehillim-blue text-center mb-8">
          Prayer Organizer Dashboard
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1fr_2fr]">
          <div>
            <PrayerRecipients 
              showShareLinks={true} 
              onRecipientSelect={handleRecipientSelect}
              selectedRecipient={selectedRecipient}
            />
          </div>
          
          <div>
            {selectedRecipient && (
              <>
                <div className="mb-4 p-4 bg-tehillim-blue/10 rounded-lg">
                  <h2 className="text-xl font-semibold text-tehillim-blue">
                    Viewing participants for: {selectedRecipient.name}
                  </h2>
                </div>
                <ParticipantsList participants={participants} />
              </>
            )}
            
            {!selectedRecipient && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center p-8">
                  Select a prayer recipient to view participants
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrganizePage;
