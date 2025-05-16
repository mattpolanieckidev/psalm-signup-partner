
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrayerRecipients from "@/components/PrayerRecipients";

const OrganizePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-tehillim-blue text-center mb-8">
          Prayer Organizer Dashboard
        </h1>
        
        <div className="max-w-lg mx-auto">
          <PrayerRecipients showShareLinks={true} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrganizePage;
