import '../styles/globals.css'
import 'tailwindcss/tailwind.css';
import dynamic from 'next/dynamic';
const ProgressBar = dynamic(() => import('../example/components/ProgressBar'), { ssr: false });
import React from 'react'
import { Windmill } from '@roketid/windmill-react-ui'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  // suppress useLayoutEffect warnings when running outside a browser
  if (!process.browser) React.useLayoutEffect = React.useEffect;

  return (
    <Windmill usePreferences={true}>
      <Component {...pageProps} />
      <ProgressBar/>
    </Windmill>
  )
}
export default MyApp
