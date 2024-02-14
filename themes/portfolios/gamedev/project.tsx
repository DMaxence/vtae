"use client";
import React from "react";

import {
  cn,
  getElapsedTime,
  getTextDate,
  getVideoThumbnail,
} from "@/lib/utils";
import { Media, Project, Skill } from "@prisma/client";

import Image from "next/image";

import NextJsImage from "@/components/next-js-image-lightbox";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import styles from "./gamedev.module.scss";

type ProjectProps = {
  project: Project & {
    skills: Skill[];
    medias: Media[];
  };
};

const MyPrevIcon = () => (
  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10">
    <ChevronLeft className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6" />
  </div>
);

const MyNextIcon = () => (
  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70 sm:h-10 sm:w-10">
    <ChevronRight className="h-5 w-5 text-white dark:text-gray-800 sm:h-6 sm:w-6" />
  </div>
);

const MyCloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

export default function Project({ project }: ProjectProps) {
  const hasImage = project.medias.length > 0;

  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const toggleOpen = (state: boolean) => () => setOpen(state);

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  const slides = project.medias.map((media, i) => ({
    type: (media.type === "VIDEO" ? "video" : "image") as "image",
    src: media.url,
    alt: project.title,
    width: 963,
    height: 700,
  }));

  return (
    <div className="flex flex-col gap-5 py-5 text-white sm:flex-row">
      {/* image */}
      {hasImage && (
        <div className={cn("w-full space-y-2 sm:w-1/2", styles.yarlThumbnails)}>
          <Lightbox
            index={index}
            slides={slides}
            plugins={[Inline, Thumbnails]}
            on={{
              view: updateIndex,
              click: toggleOpen(true),
            }}
            carousel={{
              padding: 0,
              spacing: 0,
              imageFit: "cover",
            }}
            inline={{
              style: {
                width: "100%",
                maxWidth: "900px",
                aspectRatio: "2.5 / 2",
                margin: "0 auto",
              },
            }}
            thumbnails={{
              padding: 0,
              gap: 14,
              borderRadius: 8,
              border: 0,
              imageFit: "cover",
              vignette: slides.length > 5,
            }}
            render={{
              // slide: NextJsImage,
              slide: ({ slide, offset, rect }) =>
                slide.type === ("video" as "image") ? (
                  <div className="h-full w-full overflow-hidden rounded-lg">
                    <iframe
                      src={slide.src}
                      className="h-full w-full object-contain"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <NextJsImage slide={slide} offset={offset} rect={rect} />
                ),
              thumbnail: ({ slide }) => {
                const imgUrl =
                  slide.type === "image"
                    ? slide.src
                    : getVideoThumbnail(slide.src);
                return (
                  <Image
                    src={imgUrl}
                    alt={project.title}
                    className="w-full object-cover"
                    width={69}
                    height={75}
                  />
                );
              },
              iconPrev: () => <MyPrevIcon />,
              iconNext: () => <MyNextIcon />,
              iconClose: () => <MyCloseIcon />,
            }}
          />

          <Lightbox
            open={open}
            className={styles.yarlLightbox}
            close={toggleOpen(false)}
            index={index}
            slides={slides}
            on={{ view: updateIndex }}
            animation={{ fade: 0 }}
            controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
            render={{
              slide: ({ slide, offset, rect }) =>
                slide.type === ("video" as "image") ? (
                  <iframe
                    src={slide.src}
                    className="h-full w-full object-contain"
                    allowFullScreen
                  />
                ) : (
                  <NextJsImage slide={slide} offset={offset} rect={rect} />
                ),
              iconPrev: () => <MyPrevIcon />,
              iconNext: () => <MyNextIcon />,
            }}
          />
          {/* <Modal dismissible show={showModal} onClose={() => setShowModal(false)}>
            <Modal.Body>
              <Carousel
                ref={_modalCarouselRef}
                responsive={{
                  all: {
                    breakpoint: { max: 4000, min: 0 },
                    items: 1,
                  },
                }}
                ssr
                // infinite
                className="rounded-lg"
                beforeChange={(nextSlide) => {
                  _carouselRef.current?.goToSlide(nextSlide);
                }}
              >
                {project.medias.map((media, i) =>
                  media.type === "IMAGE" ? (
                    <Image
                      key={i}
                      src={media.url}
                      alt={project.title}
                      className="object-contain"
                      width={963}
                      height={700}
                    />
                  ) : (
                    <iframe
                      key={i}
                      src={media.url}
                      className="object-contain"
                      height={700}
                      allowFullScreen
                    />
                  ),
                )}
              </Carousel>
</Modal.Body> 
          </Modal> */}
          {/* <Carousel
            ref={_carouselRef}
            responsive={{
              all: {
                breakpoint: { max: 4000, min: 0 },
                items: 1,
              },
            }}
            ssr
            // infinite
            className="rounded-lg"
            beforeChange={(nextSlide) => {
              _modalCarouselRef.current?.goToSlide(nextSlide);
            }}
          >
            {project.medias.map((media, i) =>
              media.type === "IMAGE" ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  <Image
                    src={media.url}
                    alt={project.title}
                    className="h-[400px] w-full object-cover"
                    width={550}
                    height={400}
                  />
                </button>
              ) : (
                <iframe
                  key={i}
                  src={media.url}
                  className="h-[400px] w-full object-cover"
                  height={400}
                  allowFullScreen
                />
              ),
            )}
          </Carousel> */}
          {/* <Carousel
            responsive={{
              all: {
                breakpoint: { max: 4000, min: 0 },
                items: 6,
              },
            }}
            ssr
          >
            {project.medias.map((media, i) => {
              const imgUrl =
                media.type === "IMAGE"
                  ? media.url
                  : getVideoThumbnail(media.url);
              return (
                <div
                  key={i}
                  className="relative h-[50px] w-20 overflow-hidden rounded-lg"
                >
                  <Image
                    src={imgUrl}
                    alt={project.title}
                    className="w-full object-cover"
                    width={69}
                    height={75}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      _carouselRef.current?.goToSlide(i);
                      _modalCarouselRef.current?.goToSlide(i);
                    }}
                    className="absolute inset-0"
                  />
                </div>
              );
            })}
          </Carousel> */}
        </div>
      )}
      {/* content */}
      <div
        className={cn("flex w-full flex-col gap-5", { "sm:w-1/2": hasImage })}
      >
        {/* title */}
        <div className="font-title text-2xl font-semibold">{project.title}</div>
        {/* date and Time on project */}
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-2 text-xl font-semibold">
            <div>{getTextDate(project.startDate)}</div>
            <span>|</span>
            <div>
              {getElapsedTime(
                project.startDate,
                project?.endDate || new Date(),
              )}
            </div>
          </div>
          {/* skills list */}
          <div className="flex flex-wrap gap-3">
            {project.skills.map((skill, i) => (
              <div
                key={i}
                className="rounded-full bg-white px-3 py-1.5 text-[#1D072E]"
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>
        {/* description */}
        <div className="whitespace-pre-line text-justify">
          {project.description}
        </div>
      </div>
    </div>
  );
}
