import { useEffect } from "react";
import AuthController from "./auth/AuthController";
import firebase from "./firebase";
import "firebase/firestore";
import {
  AuthState,
  UserState,
  VisitedPresences,
  VisitedPresencesLoaded,
} from "./recoil/Store";
import { useRecoilState, useRecoilValue } from "recoil";

const Container = (props) => {
  const Auth = AuthController();
  const [visitedPresences, setVisitedPresences] =
    useRecoilState(VisitedPresences);
  const [visitedPresencesLoaded, setVisitedPresencesLoaded] = useRecoilState(
    VisitedPresencesLoaded
  );
  const auth = useRecoilValue(AuthState);
  const user = useRecoilValue(UserState);

  useEffect(() => {
    Auth.check();
  }, []);

  // get visited presences
  useEffect(() => {
    if (auth) {
      // console.count("getVisitedPresences()");
      const unsubscribe = firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("visitedPresences")
        .orderBy("created_at", "desc")
        .limit(21)
        .onSnapshot((snap) => {
          let arr = [];
          snap.forEach((data) => {
            arr.push({
              ...data.data(),
              uid: data.id,
            });
          });
          setVisitedPresences(arr);
          setVisitedPresencesLoaded(true);
        });

      // cleanUp
      return () => {
        // console.count("Unsubscribe visited presences");
        unsubscribe();
      };
    } else {
      setVisitedPresences([]);
      setVisitedPresencesLoaded(false);
    }
  }, [auth]);

  return <>{props.children}</>;
};

export default Container;
