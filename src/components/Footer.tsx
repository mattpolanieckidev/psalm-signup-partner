
import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 mt-12 border-t border-tehillim-blue/10">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>May our collective prayers bring blessing and healing to all.</p>
        <p className="mt-2">© {new Date().getFullYear()} Tehillim Sign-Up</p>
      </div>
    </footer>
  );
};

export default Footer;
