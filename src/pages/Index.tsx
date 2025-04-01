
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import SignUpForm from "@/components/SignUpForm";
import ParticipantsList from "@/components/ParticipantsList";
import Footer from "@/components/Footer";
import { getAllParticipants } from "@/services/tehillimService";
import { Participant } from "@/types";

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);

  const loadParticipants = () => {
    const data = getAllParticipants();
    setParticipants(data);
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Introduction />
        <SignUpForm onSignUp={loadParticipants} />
        <ParticipantsList participants={participants} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
