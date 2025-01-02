import React, { useState, useEffect, useCallback } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

type PropType = {
  slides: string[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaMainRef}>
        <div className="w-full flex touch-pan-y touch-pinch-zoom">
          {slides.map((imageUrl, index) => (
            <div
              className="w-full aspect-square flex-none border border-gray-300  overflow-hidden bg-gray-100"
              key={index}
            >
              <img className="w-full h-full object-cover" src={imageUrl} />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden mt-3 w-full" ref={emblaThumbsRef}>
        <div className="flex flex-row gap-3 w-full">
          {slides.map((imageUrl, index) => (
            <div
              className={"flex-shrink-0 flex-grow-0 border border-#3b74a6-500 aspect-square w-[25%]".concat(
                index === selectedIndex ? " border border-[#A93F15]" : "",
              )}
              key={index}
              onClick={() => onThumbClick(index)}
            >
              <img className="w-full h-full object-cover" src={imageUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
