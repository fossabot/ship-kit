import { SidebarLayout } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/views/app-sidebar";
import "@/styles/globals.css";


export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
  <>
    <SidebarLayout defaultOpen={true}>
      <AppSidebar />
        {children}
    </SidebarLayout>
  </>
  );
}
