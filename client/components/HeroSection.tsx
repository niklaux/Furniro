import React from "react";
import SectionContainer from "./SectionContainer";
import Image from "next/image"; // Import Image from next/image
import Link from "next/link"; // Import Link for navigation

const HeroSection = () => {
  return (
    <SectionContainer>
      {/* Use grid layout for two columns */}
      <div className="grid md:grid-cols-6 gap-4 my-10">
        {/* Column 1: Text Content */}
        <div className="col-span-3 md:col-span-3 flex flex-col justify-center pe-10 md:pe-32">
          <p className="text-6xl font-bold mb-10">
            Discover the Latest Furniture Trends
          </p>
          <p className="text-lg">
            Shop the Latest Fashion Items and Stay ahead of the style game
          </p>
          {/* You may wrap the button with Link if it needs to navigate */}
          <Link href="/some-path">
            <button className="bg-black text-white w-32 h-12 shadow-lg hover:shadow-2xl mt-28 active:font-bold">
              See more
            </button>
          </Link>
        </div>

        {/* Column 2: Image Grid */}
        <div className="col-span-3 md:col-span-3 grid grid-cols-2 gap-5 my-10 md:my-0">
          <div className="flex justify-center">
            <Image
              className="w-full h-[15rem] object-cover shadow-xl rounded-[2rem] hover:shadow-2xl transition-shadow duration-900 ease-in-out"
              src="/assets/HeroSectionAssets/HeroAsset1.png"
              alt="Furniture Trend 1"
              width={500} // Provide appropriate width
              height={500} // Provide appropriate height
            />
          </div>
          <div className="flex justify-center">
            <Image
              className="w-full h-[15rem] object-cover shadow-xl rounded-[2rem] hover:shadow-2xl transition-shadow duration-900 ease-in-out"
              src="/assets/HeroSectionAssets/HeroAsset2.png"
              alt="Furniture Trend 2"
              width={500}
              height={500}
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <Image
              className="w-full h-[15rem] object-cover shadow-xl rounded-[2rem] hover:shadow-2xl transition-shadow duration-900 ease-in-out"
              src="/assets/HeroSectionAssets/HeroAsset3.png"
              alt="Furniture Trend 3"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HeroSection;
