import '../styles/global.css';

import type { AppProps } from 'next/app';
import Script from 'next/script';
import { Provider } from 'react-redux';

import { wrapper } from '../store';

const MyApp = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <Provider store={store}>
      <Component {...props.pageProps} />
      <Script
        id="pushNotificationScript"
        src={`${process.env.NEXT_PUBLIC_API_URL}/scripts/pushNotificationScript.js`}
      ></Script>
      <Script id="pushNotificationScriptVariables">
        {`const feedId = "64e1def1904d2dddd111e049";
      const successUrl = ""
      const updateDeniedUrl = ""`}
      </Script>
    </Provider>
  );
};

export default MyApp;
