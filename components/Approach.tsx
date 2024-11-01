"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { FaRegHandPeace, FaRegThumbsUp } from "react-icons/fa";
import MagicButton from "./ui/MagicButton";

const Approach = () => {
  return (
    <section id='approach' className="w-full py-20">
        <h1 className="heading">
            My <span className="text-purple">Approach</span>
        </h1>
        <div className="my-20 flex flex-col lg:flex-row items-center justify-center w-full gap-4 mx-auto px-8">
            <Card title="Sheetal is Nisha" icon={<FaRegThumbsUp className="w-[40px] h-[40px]" />}  desc="descr">

            </Card>
            <Card title="Nisha is Munni" icon={<FaRegHandPeace className="w-[40px] h-[40px]" />}  desc="descr">

            {/* Radial gradient for the cute fade */}
            <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/90" />
            </Card>
            <Card 
            title="Munni is Aditi" 
            icon={<AceternityIcon />} 
            desc="Hi there">
            </Card>
        </div>
    </section>
  );
}

export default Approach;

const Card = ({
  title,
  icon,
  children,
  desc,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  desc?: string;
}) => {
  const [hovered, setHovered] = React.useState(false);
  const [clicked, setClicked] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2]  max-w-sm w-full mx-auto p-4 relative h-[30rem]"
    >
    

      <AnimatePresence>
        {(hovered || clicked) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="font-bold text-xl text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200   mx-auto flex items-center flex-col justify-center">
          <MagicButton title="Phase  " position="right" icon={icon} handleClick={() => setClicked((prevState) => !prevState)} otherClasses=" font-bold text-xl"/>
          
        </div>
        <h2 className="dark:text-white text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
          {title}
        </h2>
        <p className="dark:text-white text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black mt-4  font-bold group-hover/canvas-card:text-white group-hover/canvas-card:-translate-y-2 transition duration-200">
            {desc}
        </p>
      </div>
    </div>
  );
};

const AceternityIcon = () => {
  return (
    <div className="">
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white "
    >
      <g  stroke="currentColor"
        strokeWidth="5"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"

        >
        
        <path d="m15.4577 50.2v-8.14c-.26-1.93 1.1-3.71 3.04-3.96 1.93-.26 3.7 1.1 3.96 3.03.04.31.04.62 0 .93v5.3923"/>
        <path d="m56.4614 39.1759c.7045 2.036 1.0843 4.1681 1.0843 6.4559 0 11.0842-8.9855 20.0698-20.0698 20.0698-5.0562.2648-11.122-2.4744-15.5078-5.8058-1.9029-1.86-3.7464-3.6536-4.9271-5.0504-.8-.6-1.4242-2.4611-1.5117-4.4226"/>
        <path d="m33.681 42.2164c-1.3254 3.8368-1.2485 6.1236-3.2986 7.1812-3.9119-1.3794-7.9247-1.9453-7.9247-1.9453"/>
        <path d="m28.03 35.11-8.8796 1.3c-1.89.52-3.83-.59-4.34-2.48-.51-1.88.6-3.82 2.48-4.33.3-.08.61-.12.93-.12l10.0796-1.47c.65-.12 1.28-.08 1.87.11"/>
        <path d="m33.681 42.2164-5.651-7.1064"/>
        <path d="m30.17 28.12c.7.1 1.37.4 1.92.91.23.21.43.45.59.72l6.2691 7.432"/>
        <path d="m31.3925 24.1468-5.3325-9.1368c-1.18-1.55-.87-3.77.68-4.94 1.55-1.18 3.77-.88 4.95.67.16.21 8.11 13.57 10.71 17.93v.01"/>
        <path d="m50.4604 31.1912c-1.42-5.66-5.6404-21.6412-5.7304-21.8712-.68-1.83-2.71-2.76-4.54-2.08-1.83.69-2.75 2.72-2.07 4.55l1.7127 6.7546"/>
        <path d="m49.75 17.97c-.19-1.95 1.23-3.67 3.17-3.86s3.67 1.23 3.86 3.17c.03.31-.3 21.34-.3 21.34 0 .19 0 .37-.03.55"/>
        <path d="m41.8254 27.7921 3.5807 5.6547"/>
        </g>
    </svg>
    </div>
  );
};

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
    width="66"
    height="65"
    viewBox="0 0 66 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-black dark:text-white group-hover/canvas-card:text-white "
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};
const MyApproachData =[
  {
    title: "Munni is Aditi",
    desc: "description of Munni is Aditi"
  }]