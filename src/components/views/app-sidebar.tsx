"use client";

import {
  BookOpen,
  Code2,
  Frame,
  LifeBuoy,
  Rabbit,
  Send,
  SquareTerminal
} from "lucide-react";

import { SearchButton } from "@/components/search/search-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/views/nav-main";
import { NavProjects } from "@/components/views/nav-projects";
import { NavSecondary } from "@/components/views/nav-secondary";
import { NavUser } from "@/components/views/nav-user";
import { StorageCard } from "@/components/views/storage-card";
import { TeamSwitcher } from "@/components/views/team-switcher";
import { routes } from "@/lib/routes";
import { DashboardIcon } from "@radix-ui/react-icons";
import { useUser } from "@stackframe/stack";
const data = {
  teams: [
    {
      name: "Personal",
      logo: Rabbit,
      plan: "Free",
    },
  ],
    navMain: [
    {
      title: "Dashboard",
      url: routes.app.dashboard,
      icon: DashboardIcon,
      isActive: true,
    },
    {
      title: "Logs",
      url: routes.app.logs,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "API Keys",
      url: routes.app.apiKeys,
      icon: Code2,
    },
    // {
    //   title: "Settings",
    //   url: routes.app.settings,
    //   icon: Settings2,
    // },
  ],

  navSecondary: [
    {
      title: "Documentation",
      url: routes.docs,
      icon: BookOpen,
    },
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "My Project",
      url: "#",
      icon: Frame,
    },
  ],
  searchResults: [
    {
      title: "Routing Fundamentals",
      teaser:
        "The skeleton of every application is routing. This page will introduce you to the fundamental concepts of routing for the web and how to handle routing in Next.js.",
      url: "#",
    },
    {
      title: "Layouts and Templates",
      teaser:
        "The special files layout.js and template.js allow you to create UI that is shared between routes. This page will guide you through how and when to use these special files.",
      url: "#",
    },
  ],
};

export function AppSidebar() {
  const user = useUser()

  const userInfo = {
    name: user?.displayName ?? "Me",
    email: user?.primaryEmail ?? "me@logflare.com",
    avatar: user?.profileImageUrl ?? "",
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SearchButton />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Platform</SidebarLabel>
          <NavMain items={data.navMain} searchResults={data.searchResults} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Projects</SidebarLabel>
          <NavProjects projects={data.projects} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Help</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
        <SidebarItem>
          <StorageCard />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
