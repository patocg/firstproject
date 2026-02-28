import React from "react";
import { signIn } from "next-auth/react";
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from "../components/sections/SkillSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import StatsSection from "../components/sections/StatsSection";

export async function getStaticProps() {
  return {
    props: {
      // no futuro podemos passar dados aqui (ex.: stats, projetos, etc.)
    },
    revalidate: 3600, // revalida a cada 1 hora
  };
}

const socialLinks = [
  {
    href: "https://linkedin.com/in/jonathas-lima-cunha-60070839/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
    title: "LinkedIn"
  },
  {
    href: "https://www.instagram.com/jonathas.cunha/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
    title: "Instagram"
  },
  {
    href: "https://github.com/patocg",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg",
    title: "GitHub"
  },
  {
    href: "https://www.facebook.com/jonathas.cunha/",
    icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
    title: "Facebook"
  },
];

export default function Home() {
  return (
    <main style={{ fontFamily: "Arial, sans-serif", background: "#e5e5e5", minHeight: "100vh" }}>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <StatsSection />
    </main>
  );
}