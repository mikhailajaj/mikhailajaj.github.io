"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Contact from "./Contact";

/**
 * Props interface for BentoGrid component
 */
interface BentoGridProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Child components to render within the grid */
  children?: React.ReactNode;
}

/**
 * BentoGrid Component
 *
 * A responsive grid layout component inspired by the Bento box design pattern.
 * Creates a masonry-style grid that adapts to different screen sizes.
 *
 * @component
 * @example
 * ```tsx
 * <BentoGrid>
 *   <BentoGridItem id={1} title="Item 1" description="Description" />
 *   <BentoGridItem id={2} title="Item 2" description="Description" />
 * </BentoGrid>
 * ```
 *
 * Features:
 * - Responsive grid layout (1 col mobile, 6 cols tablet, 5 cols desktop)
 * - Flexible spacing and sizing
 * - Optimized for showcasing portfolio items
 * - Seamless integration with BentoGridItem components
 *
 * @param {BentoGridProps} props - The component props
 * @returns {JSX.Element} The bento grid container
 */
export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * Props interface for BentoGridItem component
 */
interface BentoGridItemProps {
  /** Optional additional CSS classes */
  className?: string;
  /** Title content (string or React node) */
  title?: string | React.ReactNode;
  /** Description content (string or React node) */
  description?: string | React.ReactNode;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional icon element */
  icon?: React.ReactNode;
  /** Unique identifier for the grid item (affects layout and behavior) */
  id: number;
  /** Main image URL */
  img?: string;
  /** CSS classes for the main image */
  imgClassName?: string;
  /** CSS classes for the title */
  titleClassName?: string;
  /** Secondary/spare image URL */
  spareImg?: string;
}

/**
 * BentoGridItem Component
 *
 * Individual item component for the BentoGrid layout. Supports various
 * content types including images, text, and special interactive elements.
 *
 * @component
 * @example
 * ```tsx
 * <BentoGridItem
 *   id={1}
 *   title="Project Title"
 *   description="Project description"
 *   img="/project-image.jpg"
 *   className="md:col-span-2"
 * />
 * ```
 *
 * Special Behaviors by ID:
 * - id={3}: Displays technology stack lists
 * - id={5}: Shows promotional content
 * - id={6}: Renders contact form component
 *
 * Features:
 * - Responsive image handling with Next.js Image optimization
 * - Hover animations and transitions
 * - Flexible content layout
 * - Special content types based on ID
 * - Glass morphism design with backdrop effects
 *
 * @param {BentoGridItemProps} props - The component props
 * @returns {JSX.Element} The bento grid item
 */
export const BentoGridItem = ({
  className,
  title,
  description,
  id,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: BentoGridItemProps) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className,
      )}
    >
      {id !== 6 && (
        <div className="relative h-full w-full">
          {img && (
            <Image
              src={img}
              alt={img || "Grid item image"}
              fill
              className={cn("object-cover object-center", imgClassName)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {spareImg && (
            <div className={`absolute right-0 -bottom-5 ${id === 5 ? "w-full opacity-80" : ""}`}>
              <Image
                src={spareImg}
                alt={spareImg || "Spare image"}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className={cn(titleClassName, "transition duration-200 relative md:h-full min-h-40 flex flex-col p-4")}>            
            <div className="mt-2 mb-2 font-sans font-bold text-neutral-600 dark:text-neutral-200 text-lg lg:text-3xl">
              {title}
            </div>
            <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
              {description}
            </div>
          </div>
        </div>
      )}

      <div className="h-fit">
        {id === 6 && <Contact title={title} description={description} />}
      </div>

      {id === 3 && (
        <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
          <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
            {leftLists.map((item, i) => (
              <span
                key={i}
                className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/10 text-white"
              >
                {item}
              </span>
            ))}
            <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-black/5 dark:bg-white/5"></span>
          </div>
          <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
            <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg text-center bg-black/5 dark:bg-white/5"></span>
            {rightLists.map((item, i) => (
              <span
                key={i}
                className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base rounded-lg text-center bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/10 text-white"
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
              className="p-4 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-lg border border-white/10 m-2 cursor-pointer hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300"
            >
              <h3 className="font-bold text-lg text-neutral-950 dark:text-white">{promo.title}</h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{promo.description}</p>
              <p className="font-semibold text-md text-primary-600 dark:text-primary-400 mt-2">{promo.price}</p>
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
    price: "$19.99",
  },
  {
    title: "Promotion Title 2",
    description: "This is a description for promotion 2.",
    price: "$29.99",
  },
  // Add more promotion items as needed
];
const leftLists = ["React", "Next.js", "Tailwind CSS"];
const rightLists = ["GraphQL", "Prisma", "Apollo Client"];
