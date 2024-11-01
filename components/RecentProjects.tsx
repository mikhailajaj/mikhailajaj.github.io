import React from 'react'
import { projects } from '@/data'
import { PinContainer } from './ui/3d-pin'
import { title } from 'process'
import { FaLocationArrow } from 'react-icons/fa'

const RecentProjects = () => {
  return (
    <div className='py-20 text-2xl' id='projects'>
        <h1 className='heading text-black dark:text-white '>
            A small selection of {' '}
            <span className='text-blue-600 dark:text-blue-100'>recent projects</span>

        </h1>
        <div className='flex flex-wrap justify-center items-center gap-x-24 gap-y-8 mt-10'>
            {projects.map(({id,title,des,img,iconLists,link})=>(
                <div key={id} className='sm:h-[41rem] lg-min-h-[32.5rem] h-[32rem] flex items-center justify-center sm:w-[570px] w-[80vw]'>
                    <PinContainer  title={title} href={link}>
                        <div className='flex relative items-center justify-center sm:w-[570px] w-[80vw] sm:h-[40vh] overflow-hidden h-[30vh] mb-10'>
                            <img src={img} alt={img} className='w-full h-full object-cover z-10 bottom-0'/>
                        </div>
                        <h1 className='font-bold lg:text-2xl md:text-xl text-base line-clamp-1'>{title}</h1>
                        <p className='lg:text-xl lg:font-normal font-light text-sm line-clamp-2'>{des}</p>
                        <div className='flex items-center justify-between mt-7 mb-3'>
                            <div className='flex items-center'>
                                {iconLists.map((Icon,index)=>(
                                    <div key={index} className='borrder border-whiter/[0.2] rounded-ful bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center'
                                    style={{
                                        transform: `translateX(-${5 * index * 2}px)`
                                    }}
                                    >
                                      {
                                        typeof Icon === 'function' ? (
                                            <Icon className='w-10 h-10 p-2' />
                                        ) : (
                                            <img src={Icon} alt={Icon} className='w-10 h-10 p-2' />
                                        )
                                        }
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center">
                                <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                                    Check Live Site
                                </p>
                                <FaLocationArrow className="ms-3" color="#CBACF9" />
                            </div>
                        </div>
                        
                    </PinContainer>
                </div>
            ))}
        </div>
        

    </div>
  )
}

export default RecentProjects