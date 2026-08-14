import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  const title = pageProps.seo?.title || "USCalcHub — Salary & Tax Calculators";
  const description = pageProps.seo?.description || "Calculate your exact take-home pay across all 50 states with our free, updated tax calculators.";
  const url = pageProps.seo?.canonical || "https://uscalchub.com";
  const image = "https://uscalchub.com/logo.png";

  return (
    <>
      <Head>
        <meta property="og:title" content={title} key="ogtitle" />
        <meta property="og:description" content={description} key="ogdesc" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:url" content={url} key="ogurl" />
        <meta property="og:image" content={image} key="ogimage" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
