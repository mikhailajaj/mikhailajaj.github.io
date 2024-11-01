'use client'
import { cn } from "@/lib/utils";
import Contact from "./Contact";

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
  return (
    <div
      className={cn(
        "transbarant relative row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4 overflow-hidden  group/bento border border-white/[0.4] b-2",
        className
      )}
    >
      {(id !== 6)  &&
      <div className={`h-full w-full`}>
       
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
          <div
        className={cn(
          titleClassName,
          "group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10"
        )}
           >
         <div
          className={`font-sans text-lg lg:text-3xl max-w-96 font-bold z-10 `}
        >
          {title}
        </div>
          <div className="font-sans font-extralight md:max-w-32 md:text-xs lg:text-base text-sm text-[#C1C2D3] z-10">
            {description}
          </div>
        </div>
        
      </div>
      }

      <div className="h-fit">
          {id===6 && (
          <Contact title = {title} description = {description}/> 
      )}
      
      </div>

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

        {id === 5 && (
        <div>
          {promos.map((promo, index) => (
            <div
              key={index}
              className="p-4 bg-[#10132E]rounded-lg shadow-md m-2 cursor-pointer"
          
            >
              <h3 className="font-bold text-lg ">{promo.title}</h3>
              <p className="text-sm text-gray-400">{promo.description}</p>
              <p className="font-semibold text-md">{promo.price}</p>
            </div>
          ))}
        </div>
      )}
      </div>

  );
};


const promos = [
  {
    title: "Promotion Title 1",
    description: "This is a description for promotion 1.",
    price: "$19.99"
  },
  {
    title: "Promotion Title 2",
    description: "This is a description for promotion 2.",
    price: "$29.99"
  },
  // Add more promotion items as needed
];
const leftLists = ["React", "Next.js", "Tailwind CSS"];
const rightLists = ["GraphQL", "Prisma", "Apollo Client"];