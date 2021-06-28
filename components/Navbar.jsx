import Font from "../styles/Font.module.css";
import Link from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AdminState,
  AuthState,
  ShowSidebar,
  UserState,
  VisitedPresences,
  VisitedPresencesLoaded,
} from "./recoil/Store";
import AuthController from "../components/auth/AuthController";
import { useEffect, useState } from "react";
import CSS from "../styles/CustomNavbar.module.css";
import firebase from "./firebase";
import "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/router";

const Navbar = () => {
  const user = useRecoilValue(UserState);
  const auth = useRecoilValue(AuthState);
  const admin = useRecoilValue(AdminState);
  const visitedPresences = useRecoilValue(VisitedPresences);
  const visitedLoaded = useRecoilValue(VisitedPresencesLoaded);
  const [popup, setPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useRecoilState(ShowSidebar);

  const Auth = AuthController();
  const router = useRouter();

  useEffect(() => {
    setPopup(false);
    // getVisitedPresences();
  }, [auth]);

  useEffect(() => {
    resetSidebar();
  }, [router.asPath]);

  const resetSidebar = () => {
    if (showSidebar) {
      const body = document.querySelector("body");
      const blackSideBar = document.querySelector("#blackSideBar");

      setShowSidebar(false);

      body.classList.remove("overflow-hidden");
      blackSideBar.classList.remove("bg-opacity-50");
      blackSideBar.classList.add("bg-opacity-0");
      setTimeout(() => {
        blackSideBar.classList.add("hidden");
      }, 150);
    }
  };

  // const getVisitedPresences = () => {
  //   if (auth) {
  //     console.count("getVisitedPresences()");
  //     firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(user.uid)
  //       .collection("visitedPresences")
  //       .orderBy("created_at", "desc")
  //       .limit(21)
  //       .onSnapshot((snap) => {
  //         let arr = [];
  //         snap.forEach((data) => {
  //           arr.push({
  //             ...data.data(),
  //             uid: data.id,
  //           });
  //         });
  //         setVisitedPresences(arr);
  //         setVisitedLoaded(true);
  //       });
  //   } else {
  //     setVisitedPresences([]);
  //     setVisitedLoaded(false);
  //   }
  // };

  const sidebarToggle = () => {
    const body = document.querySelector("body");
    const blackSideBar = document.querySelector("#blackSideBar");
    switch (showSidebar) {
      case false:
        setShowSidebar(true);
        blackSideBar.classList.remove("hidden");
        body.classList.add("overflow-hidden");
        setTimeout(() => {
          blackSideBar.classList.remove("bg-opacity-0");
          blackSideBar.classList.add("bg-opacity-50");
        }, 50);
        break;

      default:
        setShowSidebar(false);
        body.classList.remove("overflow-hidden");
        blackSideBar.classList.remove("bg-opacity-50");
        blackSideBar.classList.add("bg-opacity-0");
        setTimeout(() => {
          blackSideBar.classList.add("hidden");
        }, 150);
        break;
    }
  };

  return (
    <>
      <nav className="bg-white fixed flex items-center justify-between px-4 py-4 shadow w-full z-50">
        <span className="flex items-center">
          <span className="mr-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              focusable="false"
              fill="currentColor"
              className="duration-200 hover:bg-gray-200 opacity-70 rounded-full transition-colors cursor-pointer"
              onClick={() => sidebarToggle()}
            >
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
            </svg>
          </span>
          <Link href="/">
            <a
              id="logo"
              className={`font-sans leading-none opacity-70 pb-0.5 select-none text-xl ${Font["noto-sans-jp"]}`}
            >
              Presences
            </a>
          </Link>
        </span>
        <div className="flex">
          <span className="mr-2 cursor-pointer">
            <Link href="/create">
              <a title="Create new presences">
                <svg
                  focusable="false"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="duration-200 hover:bg-gray-200 opacity-70 rounded-full transition-colors"
                >
                  <path d="M20 13h-7v7h-2v-7H4v-2h7V4h2v7h7v2z"></path>
                </svg>
              </a>
            </Link>
          </span>

          {auth == true ? (
            <>
              <span className={admin ? "mr-2" : "mr-3"}>
                <Link href="/current-presences">
                  <a title="Current presences">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      fill="currentColor"
                      className="duration-200 hover:bg-gray-200 opacity-70 rounded-full transition-colors"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                  </a>
                </Link>
              </span>
              {admin == true ? (
                <span className="mr-3">
                  <Link href="/dashboard">
                    <a title="Dashboard">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 24 24"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="currentColor"
                        className="duration-200 hover:bg-gray-200 opacity-70 rounded-full transition-colors"
                      >
                        <g>
                          <rect fill="none" height="24" width="24" />
                        </g>
                        <g>
                          <g>
                            <g>
                              <path d="M3,3v8h8V3H3z M9,9H5V5h4V9z M3,13v8h8v-8H3z M9,19H5v-4h4V19z M13,3v8h8V3H13z M19,9h-4V5h4V9z M13,13v8h8v-8H13z M19,19h-4v-4h4V19z" />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </Link>
                </span>
              ) : (
                ""
              )}
              <img
                src={user?.photoUrl}
                width="24"
                height="24"
                alt="Photo profile"
                title="Logout"
                className="rounded-full cursor-pointer"
                onClick={() => setPopup(!popup)}
              />
            </>
          ) : (
            <span onClick={() => setPopup(!popup)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="currentColor"
                className="opacity-70 cursor-pointer"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </span>
          )}
        </div>
        {popup ? (
          <div
            id="account_popup"
            className={`fixed bg-white ${
              auth ? "mt-32" : "mt-24"
            } p-4 right-0 mr-4 rounded-md shadow-md w-48 z-10 border`}
          >
            <ul className="text-cool-gray-600">
              {!auth ? (
                <li
                  className="hover:text-black cursor-pointer"
                  onClick={() => Auth.login()}
                >
                  Login with Google
                </li>
              ) : (
                <div>
                  <li className="cursor-not-allowed opacity-80">Profile</li>
                  <li
                    className="cursor-pointer hover:text-rose-500"
                    onClick={() => Auth.logout()}
                  >
                    Logout
                  </li>
                </div>
              )}
            </ul>
          </div>
        ) : (
          ""
        )}
      </nav>
      <div
        id="blackSideBar"
        className={`fixed bg-black bg-opacity-0 min-h-screen min-w-full right-0 z-10 transition-all duration-300 ease-in-out hidden`}
        onClick={() => sidebarToggle()}
      ></div>
      <div
        id="sidebar"
        className={`bg-white bottom-0 fixed md:w-72 w-2/4 overflow-auto z-40 shadow-md text-cool-gray-600 transform transition-transform duration-300 ease-in-out py-2 ${
          CSS.customScroll
        } ${showSidebar ? "" : "-translate-x-full"}`}
        style={{ height: "calc(100% - 3.5rem)" }}
      >
        <h3 className="font-bold px-5 py-2">Last visited</h3>
        {auth ? (
          visitedLoaded ? (
            visitedPresences?.length == 0 ? (
              <p className="px-5">
                <span>You dont have any visited Presences. </span>
                <Link href="/create">
                  <a className="hover:text-blue-700 text-blue-600">
                    Create here
                  </a>
                </Link>
              </p>
            ) : (
              <>
                {visitedPresences?.map((data) => (
                  <div
                    key={data.uid}
                    onClick={() => setTimeout(() => sidebarToggle(), 1000)}
                  >
                    <Link href={`/${data.uid}`}>
                      <a>
                        <div
                          className={`cursor-pointer hover:bg-cool-gray-100 px-5 py-2 ${
                            router?.query?.presenceUid == data.uid
                              ? "border-r-4 border-blue-400"
                              : ""
                          }`}
                        >
                          <span className="break-all line-clamp-1">
                            {`${data.lesson} - ${data.classes}`}
                          </span>
                          <small className="opacity-80">
                            {moment(
                              data?.created_at?.toDate()?.getTime()
                            )?.fromNow()}
                          </small>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
                {visitedPresences?.length > 20 ? (
                  <p className="px-5">
                    Another last visited presences are hidden.
                  </p>
                ) : (
                  ""
                )}
              </>
            )
          ) : (
            <p className="px-5">Loading...</p>
          )
        ) : (
          <p className="px-5">
            <span>Login with your Google account. </span>
            <span
              className="hover:text-blue-700 text-blue-600 cursor-pointer"
              onClick={() => Auth.login()}
            >
              Login
            </span>
          </p>
        )}
      </div>
    </>
  );
};

export default Navbar;
