import { useEffect } from "react";
import AuthController from "./auth/AuthController";
// import { useRecoilValue } from "recoil";
// import { UserState } from "./recoil/Store";

const UserContainer = (props) => {
  //   const user = useRecoilValue(UserState);

  const Auth = AuthController();

  useEffect(() => {
    Auth.check();
    // console.log("UserContainer.jsx");
    // console.log(user);
  }, []);

  return <>{props.children}</>;
};

export default UserContainer;
