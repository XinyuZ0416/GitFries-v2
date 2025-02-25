"use client";
import { it } from 'node:test';
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 7 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 5 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 3 }
}

type CarouselItemType = {
  image: string,
  alt: string,
  title: string,
  description: string,
}

const carouselItems: CarouselItemType[] = [
  {
    image: "/java.png",
    alt: "Java",
    title: "Java",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },{
    image: "/java.png",
    alt: "test",
    title: "title",
    description: "Java",
  },
];

const CarouselItem: React.FC<CarouselItemType> = ({image, alt, title, description}) => (
  <>
  <div className='py-4 flex flex-col items-center'>
    <img src={image} alt={alt} title={title} className='w-14 h-14 object-cover rounded-lg' />
    <h3 className='text-lg font-semibold mt-2 '>{description}</h3>
  </div>
  </>
);

export default function LanguageCarousel() {
  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      autoPlaySpeed={3000}
      centerMode={false}
      className=""
      containerClass="container-with-dots"
      dotListClass=""
      draggable
      focusOnSelect={false}
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={responsive}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots={false}
      sliderClass=""
      slidesToSlide={1}
      swipeable
    >
      {carouselItems.map((item, index) => (<CarouselItem key={index} {...item} />))}
    </Carousel>
  );
}
