import { LandingPageComponent } from "@/app/logs/landing-page";
import { auth } from "@/server/auth";

const LandingPage = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <>
      <LandingPageComponent user={user} />
    </>
  );
};

export default LandingPage;
