import Hero from "../../components/Hero";
import AboutSection from "../../components/AboutSection";
import Advantages from "../../components/Advantages";
import Projects from "@/components/Projects";
import Partners from "@/components/Partners";
import Insights from "@/components/Insights";
import WhyChooseUs from "@/components/WhyChooseUs";
import BlogSlider from "@/components/BlogSlider";
import TeamSection from "@/components/TeamSection";
// import ProductSection from "@/components/ProductSectionLive";
import { getSeoMetadataByPath } from "@/lib/seo";
import IndustrialSourcesSection from "@/components/IndustrialSourcesSection";
import ProductSection from "@/components/ProductSection";
import JourneyMissionVision from "@/components/Journey";
import LocationSection from "@/components/Location";

export async function generateMetadata() {
  return getSeoMetadataByPath("/", {
    title: "Indian Roller | Premium Industrial Solutions",
    description: "Industrial rollers, coatings, and engineered solutions from Indian Roller.",
  });
}

export default function Home() {
  return (
    <main className="" >
      <Hero />
     <AboutSection />
     <ProductSection/>
      <JourneyMissionVision/>
      <TeamSection/>
      <Advantages />
      {/* <IndustrialSourcesSection/> */}
      {/* <Projects/> */}
      <Partners/>
      <Insights/>
      <WhyChooseUs/>
      <LocationSection/>
      <BlogSlider/>
    </main>
  );
}
