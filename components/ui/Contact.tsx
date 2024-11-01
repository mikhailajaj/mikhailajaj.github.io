'use client'
import React, { useState } from 'react'
import MagicButton from './MagicButton'
import { FaDownload } from 'react-icons/fa'
import { myInfo } from '@/data/index'
const Contact = (props: { title: string|React.ReactNode, description: string|React.ReactNode, titleClassName?: string, descriptionClassName?: string|React.ReactNode}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handelDownloaded = () => {
    setDownloaded(true)
    const vcardString =
      `BEGIN:VCARD
VERSION:2.1
N:${myInfo.lastName};${myInfo.firstName}
FN:${myInfo.firstName} ${myInfo.lastName}
ORG:${myInfo.company}
TEL:${myInfo.phone}
EMAIL:${myInfo.email}
URL:${myInfo.website}
X-SOCIALPROFILE;TYPE=instagram:${myInfo.instagram}
END:VCARD`;

    const vcfBlob = new Blob([vcardString], { type: 'text/vcard' });
    const vcfUrl = URL.createObjectURL(vcfBlob);

    const anchor = document.createElement('a');
    anchor.href = vcfUrl;
    anchor.download = 'MikhailAjaj.vcf';
    anchor.click();
    setTimeout(() => {
      setDownloaded(false)
    }, 3000)
  }
  return (

          <div className="h-fit flex justify-center content-center ">
            <MagicButton title={downloaded ? "Downloaded" : "My Contact"}
              icon={<FaDownload />}
              position='right'
              handleClick={handelDownloaded}
             
            />
          </div>

  )
}

export default Contact