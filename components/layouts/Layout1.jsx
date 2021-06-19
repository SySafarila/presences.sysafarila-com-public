import Head from "next/head";
import Footer from "../Footer";
import Navbar from "../Navbar";

const Layout1 = (props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        {/* <link rel="icon" href="/favicon.svg" /> */}
        <link
          rel="canonical"
          href={props.canonical ?? "https://presences.sysafarila.tech"}
        />
        <meta name="robots" content={props.robots ?? "index, follow"} />
        <meta name="googlebot" content={props.robots ?? "index, follow"} />
        {/* <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      /> */}
        <meta
          name="description"
          content={
            props.description ?? "Website that can manage you're presences"
          }
        />
        {/* google */}
        <meta itemProp="name" content={props.title} />
        <meta itemProp="description" content={props.description} />
        <meta itemProp="image" content={props.image} />
        {/* facebook */}
        <meta property="og:url" content="https://presences.sysafarila.tech" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:image" content={props.image} />
        {/* twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
        <meta name="twitter:image" content={props.image} />
        {/* themeColor */}
        <meta name="theme-color" content={props.themeColor ?? "#fff"} />
      </Head>
      <Navbar />
      <>{props.children}</>
      <Footer />
    </>
  );
};

export default Layout1;
