"use client";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel() {
    const t = useTranslations("Carousel");
    const carouselRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const container = carouselRef.current;
            // Scroll by one card width (roughly)
            const scrollAmount = container.clientWidth * 0.7;
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const items = [
        { id: "1", image: "img/wise-case.jpg" },
        { id: "2", image: "img/orbeo-case.jpg" },
        { id: "3", image: "img/padel-case.jpg" },
        { id: "4", image: "img/mar-holidays-case.jpg" },
    ];

    return (
        <div className="relative w-full group px-4 pb-12">
            {/* Navigation Buttons - Floating on sides */}
            <div className="absolute inset-y-0 left-0 flex items-center z-20 pointer-events-none">
                <button
                    onClick={() => scroll("left")}
                    className="ml-4 pointer-events-auto bg-primary/20 hover:bg-primary/40 text-primary-content p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-primary/30 hidden lg:flex shadow-lg"
                    aria-label="Previous"
                >
                    <ChevronLeft size={32} />
                </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center z-20 pointer-events-none">
                <button
                    onClick={() => scroll("right")}
                    className="mr-4 pointer-events-auto bg-primary/20 hover:bg-primary/40 text-primary-content p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-primary/30 hidden lg:flex shadow-lg"
                    aria-label="Next"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Carousel Container */}
            <div
                ref={carouselRef}
                className="carousel carousel-center rounded-box w-full gap-6 p-4 scroll-smooth no-scrollbar"
            >
                {items.map((item) => (
                    <div key={item.id} className="carousel-item">
                        <div className="card bg-[#011b27] w-[18rem] sm:w-[25rem] lg:w-[35rem] shadow-2xl border border-white/5 overflow-hidden transform transition-transform hover:scale-[1.01]">
                            <figure className="relative h-48 sm:h-64 lg:h-80">
                                <img
                                    src={item.image}
                                    alt={t(`items.${item.id}.title`)}
                                    className="object-cover w-full h-full brightness-90 hover:brightness-100 transition-all"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-primary text-xl font-bold">
                                    {t(`items.${item.id}.title`)}
                                </h2>
                                <p className="text-slate-300 text-sm">
                                    {t(`items.${item.id}.description`)}
                                </p>
                                {/*<div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary btn-outline btn-sm rounded-full px-6">
                                        {t(`items.${item.id}.button`)}
                                    </button>
                                </div>*/}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile indicator text */}
            <div className="lg:hidden text-center mt-4 text-slate-400 text-xs italic">
                Scroll horizontally to see more projects
            </div>
        </div>
    );
}