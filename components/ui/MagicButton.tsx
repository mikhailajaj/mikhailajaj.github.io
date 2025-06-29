'use client';
import React, { useState, useEffect } from 'react'


const MagicButton = ({title, icon, position, handleClick, otherClasses, variant}:
    {
        title: string;
        icon: React.ReactNode;
        position: string;
        handleClick?: () => void;
        otherClasses?: string;
        variant?: 'default' | 'outline';}
) => {
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
   <>
   {isSafari ? (
    <button onClick={handleClick} className="p-[3px] relative">
    <div className={`absolute inset-0 ${variant === 'outline' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-orange-500 to-white'} rounded-lg`} />
    <div className={`px-8 py-2 dark:text-white bg-white dark:bg-black rounded-[6px] relative group transition duration-200 text-black hover:bg-transparent ${otherClasses}`}>
        <span className='inline-flex w-full items-center justify-center px-7 gap-2 '>
        {position === 'left' && icon}
        {title } 
        {position === 'right' && icon}
        </span>
      </div>
  
    </button>
 
  ):(
    <button onClick={handleClick} className="relative inline-flex h-12 w-full overflow-hidden rounded-lg p-[1px] focus:outline-none md:w-60 md:mt-2 ">
 
    <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] ${variant === 'outline' ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#3b82f6_0%,#8b5cf6_50%,#c4b5fd_100%)]' : 'bg-[conic-gradient(from_90deg_at_50%_50%,#990000_0%,#ff5c33_50%,#E2CBFF_100%)]'}`} />
    <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg ${variant === 'outline' ? 'bg-transparent border border-blue-500 text-blue-500 dark:text-blue-400' : 'bg-slate-950 text-white'} px-7 text-sm font-medium backdrop-blur-3xl gap-2 ${otherClasses}`}>
        {position === 'left' && icon}
        {title}
        {position === 'right' && icon}
      </span>
     
    </button>
  )}
  </>
  )
}

export default MagicButton