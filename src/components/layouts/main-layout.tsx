import { Footer } from "@/components/footers/footer";
import { Header } from "@/components/headers/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="grid grow">{children}</main>
        <Footer />
      </div>
    </>
  );
}
