import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

import { socialMedia } from "@/data";
import MagicButton from "./ui/MagicButton";

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <Link href="tel:+1(416)474-5749">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </Link>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2024 Mikhail Ajaj
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info, index) => {
            // Map social media links based on the image name
            const socialLinks = {
              "/git.svg": "https://github.com/mikhailajaj",
              "/twit.svg": "https://twitter.com/mikhailajaj",
              "/link.svg": "https://linkedin.com/in/mikhailajaj",
            };

            const socialNames = {
              "/git.svg": "GitHub",
              "/twit.svg": "Twitter",
              "/link.svg": "LinkedIn",
            };

            return (
              <Link
                key={info.id}
                href={socialLinks[info.img] || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 hover:bg-opacity-90 transition-all duration-300"
              >
                <Image
                  src={info.img}
                  alt={`${socialNames[info.img] || "Social media"} icon`}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
