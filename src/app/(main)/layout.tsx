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
