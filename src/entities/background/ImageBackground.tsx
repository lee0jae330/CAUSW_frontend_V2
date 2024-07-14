"use client";

import Image from "next/image";
import { useState } from "react";

import { LoadingComponent } from "@/entities";

export const ImageBackground = ({
  src,
  alt,
  darkBackground,
}: {
  src: string;
  alt: string;
  darkBackground?: boolean;
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <>
      {isImageLoaded ? null : <LoadingComponent />}
      {darkBackground ? (
        <div className="w-full h-screen fixed top-0 left-0  bg-black opacity-70 overflow-y-hidden z-[-1]"></div>
      ) : null}
      <div className="w-full h-screen fixed top-0 left-0 overflow-y-hidden z-[-1]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ filter: "brightness(0.5)" }}
          onLoadingComplete={() => {
            setIsImageLoaded(true);
          }}
        />
      </div>
    </>
  );
};
