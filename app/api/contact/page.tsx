'use client'
import React, { useEffect, useState } from 'react'
import { myInfo } from '@/data';

const ContactDownload = () => {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    count === 0 ? redirect('/') : setTimeout(() => {
      setCount(count - 1);
    }, 1000)
  }, [count])

  const redirect = (url: string) => {
    window.location.href = url;
  }
  useEffect(()=>
    // @ts-ignore
  handelDownloaded()
  ,[])
  
  
  const handelDownloaded = () => {
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
    anchor.download = 'Mikhail Ajaj.vcf';
    anchor.click();
  }
  return (
    <div>
      <h1>Contact</h1>
      <p>Thank you for downloading Mikhail Ajaj contact Project Manger</p>
      <p>This page will redirect you to the website in <span className='text-red-500'>{count}</span></p>
    </div>
  )
}

export default ContactDownload