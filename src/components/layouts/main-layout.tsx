import { Footer } from "@/components/footers/footer";
import { Header } from "@/components/headers/header";
import { routes } from "@/config/routes";

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

const navLinks = [{ href: routes.app.dashboard, label: "Dashboard" }];

const userMenuItems = [
  {
    label: "Settings",
  },
  {
    label: "Support",
  },
  {
    label: "Logout",
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header
          navLinks={navLinks}
          searchPlaceholder="Search documentation..."
          userMenuItems={userMenuItems}
        />
        <main className="grid grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
