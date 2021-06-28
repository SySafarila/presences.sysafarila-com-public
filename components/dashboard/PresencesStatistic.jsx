import firebase from "../firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";

const PresencesStatistic = () => {
  const [amount, setAmount] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmmpty] = useState(undefined);

  useEffect(() => {
    console.count("Presence Statistic");
    const unsubscribe = firebase
      .firestore()
      .collection("presences")
      .onSnapshot(
        (snap) => {
          let arr = [];
          snap.empty ? setIsEmmpty(true) : setIsEmmpty(false);
          snap.forEach((data) => {
            arr.push(data.data());
          });
          setAmount(arr);
          setIsLoaded(true);
        },
        (err) => {
          console.log("Listener error : ", err);
        }
      );

    return () => {
      console.count("Unsubscribe presence statistic");
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {isLoaded ? (
        isEmpty ? (
          <p>Presences is empty</p>
        ) : (
          <p>Presences counted : {amount.length}</p>
        )
      ) : (
        <p>Please wait...</p>
      )}
    </div>
  );
};

export default PresencesStatistic;
