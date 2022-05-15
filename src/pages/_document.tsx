import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
    public render() {
        return (
            <Html lang='zh-CN'>
                <Head>
                    <link rel='icon' href='https://cdn.sanity.io/images/oru63jca/production/1849036965928bc955c339b4db7aa6fdd6d4c6ae-1026x972.png?h=50' />
                </Head>
                <body
                    style={{
                        backgroundImage: 'url(https://cdn.sanity.io/images/oru63jca/production/ef964782c97c616101ea98847a9488e5208b71f1-1192x1192.png?h=500)',
                        backgroundRepeat: 'repeat',
                        backgroundSize: 'contain'
                    }}
                >
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return initialProps;
    }
}

export default MyDocument;