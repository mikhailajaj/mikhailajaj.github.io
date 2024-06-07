'use client'
import React, { useState } from 'react'
import MagicButton from './MagicButton'
import { FaDownload } from 'react-icons/fa'
import { myInfo } from '@/data'
import { BackgroundGradientAnimation } from "./GradientBg";
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
    <div className="h-fit">
      <BackgroundGradientAnimation className='w-full ' />
      <div className=' flex flex-col items-center justify-center content-center '>
        <div className={`z-50 m-5`} >
          <div className="transition duration-200 text-3xl font-bold relative md:h-full px-5 p-5">
            {props.title}
          </div>
          <div>
            {props.description}
          </div>
          <div className='ml-5'>
          <h2>Mikhail Ajaj</h2>
          <p><strong>Company:</strong> Mikhail CS</p>
          <p><strong>Phone:</strong> <a href="tel:+14164745749">+1(416)-474-5749</a></p>
          <p><strong>Email:</strong> <a href="mailto:mikhailajaj@gmail.ccom">Mikhailajaj@gmail.com</a></p>
          <p><strong>Website:</strong> <a href="https://mikhailajaj.github.io/" target="_blank">https://mikhailajaj.github.io/</a></p>
          <p><strong>Instagram:</strong> <a href="https://www.instagram.com/mikhailajaj/" target="_blank">https://www.instagram.com/mikhailajaj/</a></p>
          </div>
          <div className="m-5 flex justify-center content-center">
            <MagicButton title={downloaded ? "Downloaded" : "My Contact"}
              icon={<FaDownload />}
              position='right'
              handleClick={handelDownloaded}
            />
          </div>
        </div>
      </div>

    </div>

  )
}

export default Contact