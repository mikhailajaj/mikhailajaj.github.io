import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/bento-grid';
import { gridItems } from '@/data/gridItems';
import  Image from 'next/image';
import { cn } from '@/lib/utils';

// Define types for grid items
// Updated types to handle multiple icons
interface GridItem {
  id: number;
  title: string;
  description: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  icons?: (string | React.ComponentType)[];  // Can be either image paths or React components
  image?: {
    src: string;
    alt: string;
  };
}
const IconRenderer: React.FC<{ icon: string | React.ComponentType }> = ({ icon }) => {

  
    // Render component icon
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5" />;
  
};
const DescriptionRenderer: React.FC<{ description: string | React.ComponentType }> = ({ description }) => {

  if (typeof description === 'string') {
    // Render image icon
    return (
      <>{description}</>
    );
  } else {
    // Render component icon
    const DescriptionComponent = description;
    return <DescriptionComponent className="w-fit flex align-center justify-center" />;
  }
};

const GridItemHeader: React.FC<{ 
  image?: GridItem['image'],
  icons?: GridItem['icons']
}> = ({ image, icons }) => {
  if (!image) {
    return (
      <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />
    );
  }

  return (
    <div className="relative flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        width={300}
        height={200}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
  );
};


const GridIcons: React.FC<{ 
  icons?: GridItem['icons']
}> = ({ icons }) => {
  if (!icons || icons.length === 0) return null;

  return (
    <div className="flex bottom-2 left-2 gap-2 bg-black/20 backdrop-blur-sm rounded-full p-2">
      {icons.map((icon, index) => (
        <div key={index} className="flex items-center justify-center">
          <IconRenderer icon={icon} />
        </div>
      ))}
    </div>
  );
};

const Grid: React.FC = () => {

  return (
    <section id="about" className="w-full">
      <BentoGrid>
        {gridItems.map((item: GridItem) => (
          <BentoGridItem
            key={item.id}
            title={item.title}
            description={<DescriptionRenderer description={item.description} />}
            className={cn (item.className)} 
            icon={<GridIcons icons = {item.icons}/>}
            header={<GridItemHeader image={item.image} />}

          />
        ))}
      </BentoGrid>
    </section>
  );
};
export default Grid

