import firebase from "../firebase";
import "firebase/auth";
import "firebase/firestore";
import { useRecoilState } from "recoil";
import { UserState, AuthState, AdminState } from "../recoil/Store";
import Swal from "sweetalert2";

const AuthController = () => {
  const [user, setUser] = useRecoilState(UserState);
  const [auth, setAuth] = useRecoilState(AuthState);
  const [admin, setAdmin] = useRecoilState(AdminState);

  const provider = new firebase.auth.GoogleAuthProvider();

  const login = async () => {
    await firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        const res = await firebase
          .auth()
          .signInWithPopup(provider)
          .then((res) => {
            const credential = res.credential;
            const token = credential.accessToken;
            const user = res.user;
            // console.log("Login successfully");
            Swal.fire({
              icon: "success",
              title: "Good",
              text: "Login successfully !",
            });
          })
          .catch((err) => {
            const errorCode = err.code;
            const errorMessage = err.message;
            // The email of the user's account used.
            const email = err.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = err.credential;
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong !",
            });
          });

        setUser({
          displayName: res.user.displayName,
          email: res.user.email,
          photoUrl: res.user.photoURL,
          uid: res.user.uid,
        });
        setAuth(true);
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode, errorMessage);
      });
  };

  const logout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        // console.log("Logout successfully");
        setAuth(false);
        setAdmin(undefined);
        setUser(undefined);
        Swal.fire({
          icon: "success",
          title: "Good",
          text: "Logout successfully !",
        });
      })
      .catch((err) => {
        // console.log("Logout failed");
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      });
  };

  const check = () => {
    // console.count("check()");
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // console.log("User is signed in.");
        // setName(user.displayName);
        // setEmail(user.email);
        // setPhotoProfile(user.photoURL);
        // setUid(user.uid);
        setUser({
          displayName: user.displayName,
          email: user.email,
          photoUrl: user.photoURL,
          uid: user.uid,
        });

        createUserData(user.uid, user.displayName);
        adminCheck(user.uid);

        // console.log("Automatic login successfully");

        if (user.email === "sysafarila.official@gmail.com") {
          // setAdmin(true);
        } else {
          // setAdmin(false);
        }

        // console.log(user.email);
        setAuth(true);
      } else {
        // console.log("No user is signed in.");
        setAuth(false);
      }
    });
  };

  const adminCheck = async (uid) => {
    // console.count("adminCheck()");
    const ref = firebase.firestore().collection("users").doc(uid);

    ref
      .get()
      .then((res) => {
        if (res.exists) {
          // if exist
          switch (res.data().role) {
            case "admin":
              setAdmin(true);
              break;

            case "user":
              setAdmin(false);
              break;

            default:
              console.count("You dont have any role !");
              setAdmin(false);
              break;
          }
        } else {
          // if doesn't exist
          console.log("User not found");
          setAdmin(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createUserData = (uid, name) => {
    // console.count("createUserData()");
    const ref = firebase.firestore().collection("users");

    ref
      .doc(uid)
      .get()
      .then((res) => {
        if (res.exists) {
          console.log("Welcome back !");
        } else {
          ref
            .doc(uid)
            .set({
              name,
              role: "user",
            })
            .then(() => {
              console.log("Hello there, welcome to Presences");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    login,
    logout,
    check,
  };
};

export default AuthController;
