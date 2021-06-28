// import '../styles/globals.css'
import { RecoilRoot } from "recoil";
import "tailwindcss/tailwind.css";
import Container from "../components/Container";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Container>
        <Component {...pageProps} />
      </Container>
    </RecoilRoot>
  );
}

export default MyApp;
