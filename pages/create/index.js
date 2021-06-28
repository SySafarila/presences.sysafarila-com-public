import Layout1 from "../../components/layouts/Layout1";
import firebase from "../../components/firebase";
import "firebase/firestore";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { UserState } from "../../components/recoil/Store";
import Authenticated from "../../components/middleware/Authenticated";
import bcrypt from "bcryptjs";
import { useState } from "react";
import Css from "../../styles/CustomCss.module.css";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import LogsController from "../../components/LogsController";

const Create = () => {
  const [bypass, setBypass] = useState(false);
  const [button, setButton] = useState(true);
  const user = useRecoilValue(UserState);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const logs = LogsController();

  const onSubmit = async (data) => {
    setButton(false);

    const salt = bcrypt.genSaltSync(10);

    if (data.bypass) {
      // bypass = true
      await firebase
        .firestore()
        .collection("presences")
        .add({
          ...data,
          status: true,
          userId: user?.uid ?? null,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          password: bcrypt.hashSync(data.password, salt),
          deadline: parseInt(new Date(data.deadline).getTime()),
          started_at: parseInt(new Date(data.started_at).getTime()),
        })
        .then(async (res) => {
          await logs.store(
            user?.uid,
            `${user?.displayName} just creating presence : ${res.id}`
          );
          Swal.fire({
            icon: "success",
            title: "Good",
            text: "Presences successfully created !",
          });
          router.push(`/${res.id}`);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong !",
          });
          setButton(true);
        });
    } else {
      // bypass = false
      await firebase
        .firestore()
        .collection("presences")
        .add({
          ...data,
          status: true,
          userId: user?.uid ?? null,
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          password: bcrypt.hashSync(data.password, salt),
          deadline: parseInt(new Date(data.deadline).getTime()),
          started_at: parseInt(new Date(data.started_at).getTime()),
        })
        .then(async (res) => {
          await logs.store(
            user?.uid,
            `${user?.displayName} just creating presence : ${res.id}`
          );
          Swal.fire({
            icon: "success",
            title: "Good",
            text: "Presences successfully created !",
          });
          router.push(`/${res.id}`);
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong !",
          });
          setButton(true);
        });
    }
  };

  return (
    <>
      <Layout1 title="Presences">
        <Authenticated>
          <main
            className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
          >
            <h1 className="font-semibold mb-2 md:pt-0 pt-1 text-2xl text-cool-gray-600">
              Create Presences
            </h1>
            <div id="form">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-7"
              >
                <div>
                  <label
                    htmlFor="school"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Your School
                  </label>
                  <input
                    type="text"
                    name="school"
                    id="school"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Ex : UNPI Cianjur"
                  />
                </div>
                <div>
                  <label
                    htmlFor="class"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Your Class
                  </label>
                  <input
                    type="text"
                    name="class"
                    id="class"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Ex : Teknik Informatika"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lecturer"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Lecturer
                  </label>
                  <input
                    type="text"
                    name="lecturer"
                    id="lecturer"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Ex : Dosen ***"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lesson"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Lesson
                  </label>
                  <input
                    type="text"
                    name="lesson"
                    id="lesson"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Ex : Web Programming"
                  />
                </div>
                <div>
                  <label
                    htmlFor="started_at"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Start At
                  </label>
                  <input
                    type="datetime-local"
                    name="started_at"
                    id="started_at"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="deadline"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Deadline
                  </label>
                  <div className="flex">
                    <input
                      type="datetime-local"
                      name="deadline"
                      id="deadline"
                      ref={register({ required: true })}
                      className="ml-2 border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    ref={register({ required: true })}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Your secret key"
                  />
                  <div className="flex items-baseline mt-2">
                    <input
                      type="checkbox"
                      name="bypass"
                      id="bypass"
                      className="mr-2"
                      ref={register()}
                      onClick={() => setBypass(!bypass)}
                    />
                    <label
                      htmlFor="bypass"
                      className="flex flex-col select-none text-cool-gray-500"
                    >
                      <span>Set visibility to Public</span>
                      <small className="text-red-600">
                        Password still required, but User can skip Password
                        Checker when join this presence
                      </small>
                    </label>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-cool-gray-600 font-medium"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="namet"
                    ref={register({ required: true })}
                    defaultValue={user?.displayName ?? ""}
                    className="border mt-2 py-2 px-2.5 w-full rounded-br-md rounded-tl-md text-cool-gray-600 focus:border-cool-gray-400 focus:outline-none bg-white"
                    placeholder="Ex : Syahrul Safarila"
                  />
                </div>
                <div className="flex">
                  {button ? (
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 rounded-md focus:outline-none"
                    >
                      Create Presence
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-green-500 cursor-not-allowed disabled:opacity-60 focus:outline-none p-2 rounded-md text-white"
                      disabled={true}
                    >
                      Please wait...
                    </button>
                  )}
                </div>
              </form>
            </div>
          </main>
        </Authenticated>
      </Layout1>
    </>
  );
};

export default Create;
