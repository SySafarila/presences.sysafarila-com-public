// import '../styles/globals.css'
import { RecoilRoot } from "recoil";
import "tailwindcss/tailwind.css";
import UserContainer from "../components/UserContainer";

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <UserContainer>
        <Component {...pageProps} />
      </UserContainer>
    </RecoilRoot>
  );
}

export default MyApp;
