import LogProvider from '@/plugins/LogProvider';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LogProvider prefix="[MyApp]" logLevel="info">
      <Component {...pageProps} />
    </LogProvider>
  );
}

export default MyApp;