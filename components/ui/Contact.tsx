"use client";
import React, { useState } from "react";
import MagicButton from "./MagicButton";
import { FaDownload } from "react-icons/fa";
import { myInfo } from "@/data/index";

/**
 * Props interface for Contact component
 */
interface ContactProps {
  /** Title content (string or React node) */
  title: string | React.ReactNode;
  /** Description content (string or React node) */
  description: string | React.ReactNode;
  /** Optional CSS classes for title styling */
  titleClassName?: string;
  /** Optional CSS classes for description styling */
  descriptionClassName?: string | React.ReactNode;
}

/**
 * Contact Component
 *
 * A contact card component that allows users to download contact information
 * as a vCard (.vcf) file for easy import into their address book.
 *
 * @component
 * @example
 * ```tsx
 * <Contact
 *   title="Get My Contact Info"
 *   description="Download my contact details"
 * />
 * ```
 *
 * Features:
 * - Generates vCard format for universal compatibility
 * - Includes comprehensive contact information (name, company, phone, email, etc.)
 * - Visual feedback with download state management
 * - Automatic state reset after 3 seconds
 * - Accessible button with proper ARIA attributes
 *
 * vCard Fields Included:
 * - Full name and organization
 * - Phone number and email
 * - Website URL
 * - Social media profiles
 *
 * @param {ContactProps} props - The component props
 * @returns {JSX.Element} Contact download button with state management
 */
const Contact = (props: ContactProps) => {
  const [downloaded, setDownloaded] = useState(false);

  /**
   * Handles the contact download process
   *
   * Creates a vCard file with contact information and triggers download.
   * Updates UI state to show download confirmation.
   */
  const handelDownloaded = () => {
    setDownloaded(true);
    const vcardString = `BEGIN:VCARD
VERSION:2.1
N:${myInfo.lastName};${myInfo.firstName}
FN:${myInfo.firstName} ${myInfo.lastName}
ORG:${myInfo.company}
TEL:${myInfo.phone}
EMAIL:${myInfo.email}
URL:${myInfo.website}
X-SOCIALPROFILE;TYPE=instagram:${myInfo.instagram}
END:VCARD`;

    const vcfBlob = new Blob([vcardString], { type: "text/vcard" });
    const vcfUrl = URL.createObjectURL(vcfBlob);

    const anchor = document.createElement("a");
    anchor.href = vcfUrl;
    anchor.download = "MikhailAjaj.vcf";
    anchor.click();
    setTimeout(() => {
      setDownloaded(false);
    }, 3000);
  };
  return (
    <div className="h-fit flex justify-center content-center ">
      <MagicButton
        title={downloaded ? "Downloaded" : "My Contact"}
        icon={<FaDownload />}
        position="right"
        handleClick={handelDownloaded}
      />
    </div>
  );
};

export default Contact;
