"use client";
const Hero = () => {
  return (
    <>
      <div style={{ backgroundImage: "url('/images-banner/Banner.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        <section className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between lg:gap-20  pt-6 lg:pt-10">
          <div>
            <h1 className="text-[20px] font-bold !leading-[1.2] lg:text-4xl xl:text-[40px]">
              LinkedIn Carousel Generator
            </h1>
            {/* <TryFreeButton openModal={openModal} /> */}
          </div>
          <div className="w-1/2">
            <img src={`${process.env.NEXT_PUBLIC_APP_URL}/images-banner/Layer.png`} className="w-full h-auto object-contain" alt="LinkedIn Carousel Example" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;
