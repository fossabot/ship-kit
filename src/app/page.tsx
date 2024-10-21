import { HeroSection } from "@/components/blocks/hero-section";
import AnimatedButton from "@/components/buttons/animated-button/animated-button";
import { HoverGrid } from "@/components/grid/hover-grid";
import {
  ClockIcon,
  GridIcon,
  InboxIcon,
  LayersIcon,
  MapIcon,
  RefreshCwIcon,
} from "lucide-react";

const features = [
  {
    icon: <LayersIcon />,
    title: "Issues",
    description: "Create new tasks and subtasks in seconds",
  },
  {
    icon: <RefreshCwIcon />,
    title: "Real-time Sync",
    description: "Synchronized instantly across all users",
  },
  {
    icon: <ClockIcon />,
    title: "Cycles",
    description: "Don't sprint - build momentum with Cycles",
  },
  {
    icon: <GridIcon />,
    title: "Projects",
    description: "Define larger initiatives and features",
  },
  {
    icon: <MapIcon />,
    title: "Roadmap",
    description: "Plan visually with live predictions",
  },
  {
    icon: <InboxIcon />,
    title: "Backlog",
    description: "A place for new issues and ideas",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <HoverGrid content={features} />

      <AnimatedButton href="/next-page">Click Me</AnimatedButton>
    </>
  );
}
