import firebase from "../firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";

const UsersStatistic = () => {
  const [amount, setAmount] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmpty, setIsEmmpty] = useState(undefined);

  useEffect(() => {
    console.count("Users Statistic");
    const unsubscribe = firebase
      .firestore()
      .collection("users")
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
      console.count("Unsubscribe users statistic");
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {isLoaded ? (
        isEmpty ? (
          <p>Users is empty</p>
        ) : (
          <p>Users registered : {amount.length}</p>
        )
      ) : (
        <p>Please wait...</p>
      )}
    </div>
  );
};

export default UsersStatistic;
