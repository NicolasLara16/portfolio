import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import SkillsSection from "@/components/public/SkillsSection";
import CertificationsSection from "@/components/public/CertificationsSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";

export default function Home() {
  return (
    <div className="bg-grid min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SkillsSection />
        <CertificationsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
