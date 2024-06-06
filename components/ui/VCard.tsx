'use client'
import { useState } from 'react';
import { myInfo } from '@/data';
import MagicButton from './MagicButton';
import { FaDownload } from "react-icons/fa";
import Lottie from 'react-lottie';
import animationData from '@/data/confetti.json';
function VCard() {
  const [downloaded, setDownloaded] = useState(false);
  const handleClick = () => {

    const vcardString = `
BEGIN:VCARD
VERSION:2.1
N:${myInfo.lastName};${myInfo.firstName}
FN:${myInfo.firstName} ${myInfo.lastName}
ORG:${myInfo.company}
TEL:${myInfo.phone}
EMAIL:${myInfo.email}
URL:${myInfo.website}
X-SOCIALPROFILE:${myInfo.instagram}
END:VCARD
`;

    const vcfBlob = new Blob([vcardString], { type: 'text/vcard' });
    const vcfUrl = URL.createObjectURL(vcfBlob);

    const anchor = document.createElement('a');
    anchor.href = vcfUrl;
    anchor.download = 'MyInfo.vcf';
    anchor.click();
  };

  return (

    
      <MagicButton title={downloaded ? "Email is Copied!" : "Copy my email address"}
       icon={<FaDownload/>} 
       position='right' 
       handleClick={() => handleClick()} 
       otherClasses="!bg-[#161A31] bottom-1"/>
 
  );
}

export default VCard;