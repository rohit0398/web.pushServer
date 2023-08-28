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
      <Script src="https://api-pushserver.onrender.com/scripts/pushNotificationScript.js"></Script>
    </Provider>
  );
};

export default MyApp;
