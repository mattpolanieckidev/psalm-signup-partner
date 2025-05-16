
import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Introduction from "@/components/Introduction";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Introduction />
        
        <div className="w-full max-w-lg mx-auto mt-12 p-8 border border-tehillim-blue/20 rounded-lg bg-white shadow-sm text-center">
          <h2 className="text-2xl font-bold text-tehillim-blue mb-6">Tehillim Group Organizer</h2>
          <p className="mb-8 text-gray-600">
            Organize a Tehillim group by adding names of people to pray for and sharing links with participants.
          </p>
          <Link 
            to="/organize" 
            className="inline-block px-6 py-2 bg-tehillim-blue text-white rounded hover:bg-tehillim-blue/90 transition-colors"
          >
            Start Organizing
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
