import HeroLeft from "./Hero/HeroLeft";
import HeroRight from "./Hero/HeroRight";

function Hero() {
  return (
    <section className="relative bg-[#FCFBFF] pt-44 pb-24">

        <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-violet-700/20 blur-[180px] rounded-full"/>

        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[200px] rounded-full"/>

        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16 items-center">

                <HeroLeft />

                <HeroRight />

            </div>

        </div>

    </section>
  );
}

export default Hero;