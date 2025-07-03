import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const warrantyImages = [
  {
    src: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Smartphone
    alt: "Modern smartphone on table",
    caption: "Smartphones"
  },
  {
    src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Laptop
    alt: "Laptop computer on desk",
    caption: "Laptops & Computers"
  },
  {
    src: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHZ8ZW58MHx8MHx8fDA%3D", // TV
    alt: "Flat screen television in living room",
    caption: "Televisions"
  },
  {
    src: "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FzaGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D", // Washing Machine
    alt: "Front load washing machine",
    caption: "Washing Machines"
  },
  {
    src: "https://images.unsplash.com/photo-1722859178634-ccc8ea5680d2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJlZnJpZ2VyYXRvcnxlbnwwfDB8MHx8fDA%3D", // Refrigerator
    alt: "Modern refrigerator in kitchen",
    caption: "Refrigerators"
  },
  {
    src: "https://images.unsplash.com/photo-1586208958839-06c17cacdf08?q=80&w=965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Kitchen Appliance
    alt: "Blender and kitchen appliances",
    caption: "Kitchen Appliances"
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfDB8MHx8fDA%3D", // Headphones
    alt: "Wireless headphones on desk",
    caption: "Headphones"
  },
  {
    src: "https://images.unsplash.com/photo-1632794716789-42d9995fb5b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Smartwatch
    alt: "Smartwatch on wrist",
    caption: "Smartwatches"
  },
  {
    src: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1142&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Smartwatch
    alt: "Others",
    caption: "Many More"
  }
];

const carouselOpts= { loop: true, draggable: true, speed: 20 };

const Slider = () => {
  return (
    <div>
      <section className="pt-8 pb-20 bg-gray-50">
        <div className="waranai-container px-0 max-w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-extrabold text-brand-navy mb-2 leading-tight drop-shadow-lg">
              <span className="text-brand-purple">WaranAI</span> Covers All Your Essentials
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From your daily essentials to your favorite gadgets, WaranAI keeps every warranty safe, organized, and always at your fingertips.
            </p>
          </div>
          <div className="flex justify-center overflow-x-hidden">
            <Carousel className="w-full max-w-5xl" opts={carouselOpts}>
              <CarouselContent>
                {warrantyImages.map((img, idx) => (
                  <CarouselItem key={idx} className="flex flex-col items-center">
                    <img src={img.src} alt={img.alt} className="rounded-xl shadow-2xl w-full max-w-4xl aspect-[16/7] object-cover mb-2 transition-all duration-500" />
                    <span className="text-brand-navy font-semibold text-xl bg-white/80 px-6 py-2 rounded-full shadow-md -mt-6 mb-6 relative z-10">
                      {img.caption}
                    </span>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:-left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="right-2 md:-right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Slider
