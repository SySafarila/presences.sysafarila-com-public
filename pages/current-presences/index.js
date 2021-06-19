import firebase from "../../components/firebase";
import "firebase/firestore";
import { useRecoilValue } from "recoil";
import { AuthState, UserState } from "../../components/recoil/Store";
import { useEffect, useState } from "react";
import Layout1 from "../../components/layouts/Layout1";
import Authenticated from "../../components/middleware/Authenticated";
import Link from "next/link";
import Css from "../../styles/CustomCss.module.css";
import moment from "moment";

const CurrentPresences = () => {
  const user = useRecoilValue(UserState);
  const auth = useRecoilValue(AuthState);
  const [presences, setPresences] = useState([]);
  const [notFound, setNotFound] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (auth) {
      getData();
    }
  }, [auth]);

  const getData = async () => {
    await firebase
      .firestore()
      .collection("presences")
      .where("userId", "==", user.uid)
      .orderBy("created_at", "desc")
      .get()
      .then((res) => {
        let arr = [];
        if (res.empty) {
          setNotFound(true);
        } else {
          res.forEach((data) => {
            // console.log({ ...data.data(), uid: data.id });
            arr.push({ ...data.data(), uid: data.id });
          });
          setPresences(arr);
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Layout1 title="Current Presences">
        <Authenticated>
          <main
            className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
          >
            <h1 className="font-semibold mb-4 md:pt-0 pt-1 text-2xl text-cool-gray-600">
              Current Presences
            </h1>
            <div id="presences" className="gap-3 grid md:grid-cols-2">
              {isLoaded ? (
                presences?.map((data) => (
                  <div
                    key={data.uid}
                    className="text-cool-gray-600 relative group"
                  >
                    <Link href={data.uid}>
                      <a className="border grid hover:border-cool-gray-400 p-3 rounded-md">
                        <span className="font-medium">
                          {data.school} - {data.lesson}
                        </span>
                        <small>
                          <span className="opacity-80">With</span>
                          <span className="font-medium">{` ${data.lecturer}`}</span>
                        </small>
                        <small className="font-thin">
                          {moment(data.created_at.toDate()).fromNow()}
                        </small>
                      </a>
                    </Link>
                    <div className="absolute bg-white group-hover:block hidden mr-4 mt-4 pb-1.5 pl-1.5 right-0 text-xs top-0">
                      <span
                        className="mr-2 cursor-pointer"
                        onClick={() =>
                          alert(
                            "Not available for now, please try again later."
                          )
                        }
                      >
                        Edit
                      </span>
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          alert(
                            "Not available for now, please try again later."
                          )
                        }
                      >
                        Delete
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-cool-gray-500">Loading...</span>
              )}
              {notFound ? (
                <p className="text-cool-gray-500">Data not found</p>
              ) : (
                ""
              )}
            </div>
          </main>
        </Authenticated>
      </Layout1>
    </>
  );
};

export default CurrentPresences;
