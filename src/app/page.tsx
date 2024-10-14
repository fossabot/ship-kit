import { LandingPageComponent } from "@/components/views/landing-page";
import { otelLogger } from "@/lib/otel-logger";

const LandingPage = () => {
  otelLogger.info('LandingPage');
  console.log('LandingPage');
  return (
    <>

<LandingPageComponent />

    </>
  );
};

export default LandingPage;