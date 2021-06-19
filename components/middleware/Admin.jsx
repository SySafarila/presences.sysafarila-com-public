import { useRecoilValue } from "recoil";
import AuthController from "../auth/AuthController";
import {
  AdminState, // AuthState
} from "../recoil/Store";
import Css from "../../styles/CustomCss.module.css";
import Loading from "./Loading";

const Admin = (props) => {
  const admin = useRecoilValue(AdminState);
  const Auth = AuthController();

  switch (admin) {
    case true:
      return <>{props.children}</>;
      break;

    case false:
      return (
        <>
          <main
            className={`max-w-5xl md:pt-10 md:py-10 mx-auto px-4 py-4 relative md:-mt-32 -mt-20 ${Css.heightFull}`}
          >
            <div className="-translate-x-2/4 -translate-y-2/4 absolute border left-2/4 md:w-1/3 p-4 rounded top-2/4 transform w-10/12 md:mt-16 mt-11">
              <div className="relative text-cool-gray-600">
                <p className="text-center">You have to Admin to get access</p>
                {/* <button
                  onClick={() => Auth.login()}
                  className="cursor-pointer flex focus:outline-none hover:shadow-md items-center justify-center p-2.5 rounded shadow w-full"
                >
                  <img
                    src="/google.svg"
                    alt="Google logo's"
                    className="mr-2 w-1/12"
                  />
                  <span className="font-bold ml-2 text-cool-gray-600">
                    Login with Google
                  </span>
                </button> */}
              </div>
            </div>
          </main>
        </>
      );
      break;

    default:
      return <Loading />;
      break;
  }
};

export default Admin;
