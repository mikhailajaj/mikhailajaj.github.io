'use client'
import { cn } from "@/utils/cn";
import { GlobeDemo } from "../GlobeGrid";
import { BackgroundGradientAnimation } from "./GradientBg";
import VCard from "./VCard";

import animationData from '@/data/confetti.json';
import { useState } from "react";
import MagicButton from "./MagicButton";
import { FaDownload } from "react-icons/fa";
import { myInfo } from '@/data';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 max-w-7xl mx-auto  md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 lg:gap-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id:number;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const  handelDownloaded = () =>{
    setDownloaded(true)
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
    
  }
  return (
    <div
      className={cn(
        "relative row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 overflow-hidden  group/bento border border-white/[0.1]",
        className
      )}
      style={{
        background: "rgb(4,7,29)",
        backgroundColor:
          "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
      }}
    >
      <div className={`${id===6 && 'flex justify-center'} h-full`}>
        <div className="w-full h-full absolute">
            {img && (
                <img
                src={img}
                alt={img}
                className={cn("object-cover object-center"
                    ,imgClassName
                )}
                />
            )}
        </div>
        <div className={`absolute right-0 -bottom-5 ${id===5 && 'w-full opacity-80'} `}>
            {spareImg && (
                <img
                src={spareImg}
                alt={spareImg}
                className={"object-cover object-center w-full h-full"}
                />
            )}
        </div>
        
        <div>
            {id===6 && (
            <BackgroundGradientAnimation>
                <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
            </BackgroundGradientAnimation>            
        )}
        
        </div>
        
        <div
          className={cn(
            titleClassName,
            "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
          )}
        >
            {/* change the order of the title and des, font-extralight, remove text-xs text-neutral-600 dark:text-neutral-300 , change the text-color */}
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>
          {/* add text-3xl max-w-96 , remove text-neutral-600 dark:text-neutral-300*/}
          {/* remove mb-2 mt-2 */}
          <div
            className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10`}
          >
            {title}
          </div>
          {id===2 && <GlobeDemo/>}
          {id === 3 && (
            <div className="flex gap-1  lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              {/* tech stack lists */}
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {id ===6 && (
            <div className= 'mt-5 relative'>
                <div className={`absolute -bottom-5 right-0 ${downloaded ? "block" : "block"
                  }`}>
            
                
                </div>
                <MagicButton title={downloaded ? "My Contact" : "Downloaded"}
                  icon={<FaDownload/>} 
                  position='right' 
                  handleClick={() => handelDownloaded()} 
                  otherClasses=" !bg-[#161A31] 	"
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  
const leftLists = ["React", "Next.js", "Tailwind CSS"];
const rightLists = ["GraphQL", "Prisma", "Apollo Client"];