import React from 'react'
import { Spotlight } from './ui/Spotlight'
import Link from 'next/link'
import MagicButton from './ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa'

const Hero = () => {
  return (
    <div className='pb-20 pt-20'>
        <div>

           
            <div />
            </div>
            <div className='flex justify-center relative my-20 z-10'>
                <div className='w-max-[89vw]> md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center'> 
                <h2 className='uppercase tracking-widest text-center dark:text-blue-100 text-blue-600  max-w-80text-center md:tracking-wider mb-4 text-sm md:text-lg  lg:text-2xl'>Mobile Application Development</h2>
                <p className='text-center dark:text-white md:tracking-wider mb-4 text-sm md:text-lg  lg:text-2xl'>Hi, I&apos;m Mikhail a Web/Mobile Developer dedicated to enhancing quality.</p>
                <Link href='#about'>
                    <MagicButton 
                    title='Learn more' 
                    icon={<FaLocationArrow />}
                    position='right'
                    
                    />
                </Link>
                </div>
            </div>
        </div>
   
  )
}

export default Hero