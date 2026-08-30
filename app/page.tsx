import Container from "@/components/layout/Container";
import Hero from "@/components/home/Hero";
import MetricStrip from "@/components/home/MetricStrip";
import WDSpotlight from "@/components/home/WDSpotlight";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Timeline from "@/components/home/Timeline";
import TechStack from "@/components/home/TechStack";
import PublicationHighlight from "@/components/home/PublicationHighlight";
import ContactBand from "@/components/home/ContactBand";

export default function Home() {
  return (
    <Container>
      <Hero />
      <MetricStrip />
      <Timeline />
      <WDSpotlight />
      <FeaturedProjects />
      <PublicationHighlight />
      <TechStack />
      <ContactBand />
    </Container>
  );
}
