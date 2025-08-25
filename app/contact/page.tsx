import React from "react";
import MultiStepContactForm from "@/components/interactive/MultiStepContactForm";
import NewsletterSignup from "@/components/interactive/NewsletterSignup";
import { DevelopmentBanner } from "@/components/ui/DevelopmentBanner";

const ContactPage = () => {
  return (
    <div className="pt-10 container mx-auto p-4 py-20">
      <h1 className="text-4xl font-bold text-center mb-8">Get in Touch</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <MultiStepContactForm />
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default ContactPage;
