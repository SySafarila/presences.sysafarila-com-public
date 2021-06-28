import firebase from "./firebase";
import "firebase/firestore";

const LogsController = () => {
  const store = (userId, message) => {
    return firebase.firestore().collection("logs").add({
      userId: userId,
      action: message,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      type: "store",
    });
  };

  return { store };
};

export default LogsController;
