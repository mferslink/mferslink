import '@/styles/app.global.css';
import '@/styles/pmd.global.css';
import '@/styles/antd.global.css';
import '@/styles/reset.global.css';
import type { AppProps } from 'next/app';
import '../locale/index';
import { StoreProvider } from '@/store';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import Layout from '@/components/Common/Layout';
import Head from 'next/head';

const activeChainId = ChainId.Mainnet;
function App({ Component, pageProps }: AppProps) {
    const AnyComponent = Component as any;
    return  <>
        <Head>
            <meta property="twitter:url" content="https://www.mfers.link/home"/>
            <meta name="twitter:title" content="mfers.link"/>
            <meta name="twitter:description" content="home of mfers"/>
            <meta name="twitter:site" content="https://www.mfers.link/home"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image" content="https://cdn.sanity.io/images/oru63jca/production/3dd84f7b49a1d41fea81f188614ed21fa25083df-998x520.png"/>
            <meta name="description" content="mfers.link is a mfer community" />
            <meta name="keywords" content="mfers mfer mferslink mfers.link Mfers.link nft opensea" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <meta name="format-detection" content="telephone=no"/>
            <meta name="format-detection" content="date=no"/>
            <meta name="format-detection" content="address=no"/>
            <meta property="og:title" content="mfers.link" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.mfers.link/home" />
            <meta property="og:image" content="https://cdn.sanity.io/images/oru63jca/production/3dd84f7b49a1d41fea81f188614ed21fa25083df-998x520.png"/>
        </Head>
        <ThirdwebProvider
                desiredChainId={activeChainId}
            >
                <StoreProvider>
                    <Layout>
                        <AnyComponent {...pageProps}/>
                    </Layout>
                </StoreProvider>
            </ThirdwebProvider>
        </>
}

export default App;
