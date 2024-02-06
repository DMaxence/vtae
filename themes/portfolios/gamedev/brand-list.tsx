"use client";
import { Media, Site } from "@prisma/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
  },
};

type BrandListProps = {
  site: Site & {
    iconsList: Media[];
  };
};

const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
  const {
    carouselState: { currentSlide },
  } = rest;
  return (
    <div className="absolute left-1/2 top-1/2 flex w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 transform justify-between text-white">
      <button
        type="button"
        className={currentSlide === 0 ? "disable" : ""}
        onClick={() => previous()}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button type="button" onClick={() => next()}>
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default function BrandList({ site }: BrandListProps) {
  const logos = site.iconsList;

  return (
    <div className=" bg-[#1D072E] py-5">
      <div className="relative mx-auto h-full max-w-4xl">
        <Carousel
          responsive={responsive}
          ssr
          infinite
          arrows={false}
          renderButtonGroupOutside={true}
          customButtonGroup={<ButtonGroup />}
          className="mx-auto max-w-3xl"
        >
          {logos.map((logo, i) => (
            <div key={i}>
              <Image src={logo.url} alt="" width={50} height={50} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
