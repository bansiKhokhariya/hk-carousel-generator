"use client";
const Hero = () => {
  return (
    <>
      <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 px-8 py-8 lg:py-20">
        <div>
          <h1 className="text-3xl font-bold !leading-[1.2] lg:text-4xl xl:text-[40px]  mb-4">
            LinkedIn Carousel Generator
          </h1>
          {/* <TryFreeButton openModal={openModal} /> */}
        </div>
        <div className="w-1/2">
          <img src="https://www.searchenginejournal.com/wp-content/uploads/2021/12/instagram-carousel-61b7446cb19e1-sej.jpg" className="w-full h-auto object-contain" alt="LinkedIn Carousel Example" />
        </div>
      </section>
    </>
  );
};

export default Hero;
