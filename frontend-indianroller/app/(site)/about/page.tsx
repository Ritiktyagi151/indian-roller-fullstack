import AboutHero from "@/components/about/AboutHero";
import AboutDetails from "@/components/about/AboutDetails";
import WhyIRI from "@/components/about/WhyIRI";
import Philosophy from "@/components/about/Philosophy";
import ContactMirror from "@/components/about/ContactMirror";
import Team from "@/components/about/Team";
import { getSeoMetadataByPath } from "@/lib/seo";
import DirectorMessage from "@/components/about/DirectorMessage";

export async function generateMetadata() {
  return getSeoMetadataByPath("/about", {
    title: "About Indian Roller | Industrial Roller Manufacturer",
    description: "Learn about Indian Roller and our industrial roller manufacturing expertise.",
  });
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero
        title="About Our Company"
        subtitle="Sincere Service & Honest Manufacturing Since 1990"
        imagePath="/team-img/bangladesh.png"
      />
      <AboutDetails />
<DirectorMessage/>
      <WhyIRI />
      <Philosophy />
      <Team />
      <ContactMirror />
    </main>
  );
}
