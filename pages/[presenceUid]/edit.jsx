import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout1 from "../../components/layouts/Layout1";
import Css from "../../styles/CustomCss.module.css";
import firebase from "../../components/firebase";
import "firebase/firestore";
import Authenticated from "../../components/middleware/Authenticated";
import { useRecoilValue } from "recoil";
import { AuthState, UserState } from "../../components/recoil/Store";
import Loading from "../../components/middleware/Loading";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";
import LogsController from "../../components/LogsController";

const EditPresence = () => {
  const [presence, setPresence] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(undefined);
  const [editAutorized, setEditAuthorized] = useState(undefined);
  const [button, setButton] = useState(true);
  const [bypass, setBypass] = useState(undefined);
  const [started_at, setStarted_at] = useState(undefined);
  const [deadline, setDeadline] = useState(undefined);
  const auth = useRecoilValue(AuthState);
  const user = useRecoilValue(UserState);
  const { register, handleSubmit, watch, errors } = useForm();

  const router = useRouter();
  const logs = LogsController();

  useEffect(() => {
    if (router.isReady && auth) {
      getPresence();

      // cleanup
      return () => {
        setPresence(undefined);
        console.count("Edit presence cleanup");
      };
    }
  }, [router.isReady, auth]);

  const getPresence = () => {
    console.count("getPresence()");
    firebase
      .firestore()
      .collection("presences")
      .doc(router.query.presenceUid)
      .get()
      .then((res) => {
        if (res.exists) {
          // presence exist
          // set started_at
          let startYear,
            startMonth,
            startDay,
            startHour,
            startMinute,
            startFinal;
          startYear = new Date(res.data().started_at).getFullYear();
          startMonth =
            new Date(res.data().started_at).getMonth() < 10
              ? "0" + parseInt(new Date(res.data().started_at).getMonth() + 1)
              : parseInt(new Date(res.data().started_at).getMonth() + 1);
          startDay =
            new Date(res.data().started_at).getDate() < 10
              ? "0" + new Date(res.data().started_at).getDate()
              : new Date(res.data().started_at).getDate();
          startHour =
            new Date(res.data().started_at).getHours() < 10
              ? "0" + new Date(res.data().started_at).getHours()
              : new Date(res.data().started_at).getHours();
          startMinute =
            new Date(res.data().started_at).getMinutes() < 10
              ? "0" + new Date(res.data().started_at).getMinutes()
              : new Date(res.data().started_at).getMinutes();
          startFinal = `${startYear}-${startMonth}-${startDay}T${startHour}:${startMinute}`;
          setStarted_at(startFinal.toString());

          // set deadline
          let endYear, endMonth, endDay, endHour, endMinute, endFinal;
          endYear = new Date(res.data().deadline).getFullYear();
          endMonth =
            new Date(res.data().deadline).getMonth() < 10
              ? "0" + parseInt(new Date(res.data().deadline).getMonth() + 1)
              : parseInt(new Date(res.data().deadline).getMonth() + 1);
          endDay =
            new Date(res.data().deadline).getDate() < 10
              ? "0" + new Date(res.data().deadline).getDate()
              : new Date(res.data().deadline).getDate();
          endHour =
            new Date(res.data().deadline).getHours() < 10
              ? "0" + new Date(res.data().deadline).getHours()
              : new Date(res.data().deadline).getHours();
          endMinute =
            new Date(res.data().deadline).getMinutes() < 10
              ? "0" + new Date(res.data().deadline).getMinutes()
              : new Date(res.data().deadline).getMinutes();
          endFinal = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}`;
          setDeadline(endFinal.toString());

          if (res.data().userId == user.uid) {
            setEditAuthorized(true);
          } else {
            setEditAuthorized(false);
          }
          setBypass(res.data().bypass);
          setPresence(res.data());
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onSubmit = async (data) => {
    setButton(false);

    const salt = bcrypt.genSaltSync(10);

    await firebase
      .firestore()
      .collection("presences")
      .doc(router?.query?.presenceUid)
      .update({
        bypass: bypass,
        class: data.class,
        deadline: parseInt(new Date(data.deadline).getTime()),
        lecturer: data.lecturer,
        lesson: data.lesson,
        name: data.name,
        password: bcrypt.hashSync(data.password, salt),
        school: data.school,
        started_at: parseInt(new Date(data.started_at).getTime()),
      })
      .then((res) => {
        setButton(true);
        Swal.fire({
          icon: "success",
          title: "Good",
          text: "Presences updated !",
        });
        router.push(`/${router?.query?.presenceUid}`);
      })
      .catch((err) => {
        setButton(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      });

    await logs.store(
      user?.uid,
      `${user?.displayName} just editing presence : ${router.query.presenceUid}`
    );
  };

  return (
    <Layout1
      title={`Presences ${
        router.query.presenceUid != undefined
          ? `- ${router.query.presenceUid}`
          : ""
      }`}
      robots="noindex, nofollow"
    >
      <Authenticated>
        {isLoaded ? (
          editAutorized ? (
            <main
              className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
              id="editPage"
            >
              <h1
                className="break-words font-semibold line-clamp-2 md:pt-0 pt-2 text-2xl text-cool-gray-600"
                id="schoolAndClass"
              >
                <>{`Edit | ${presence?.class} - ${presence?.lesson}`}</>
              </h1>
              <div id="form" className="border-t mt-4 pt-4">
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-7"
                  onSubmit={handleSubmit(onSubmit)}
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
                      defaultValue={presence?.school}
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
                      defaultValue={presence?.class}
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
                      defaultValue={presence?.lecturer}
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
                      defaultValue={presence?.lesson}
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
                      defaultValue={`${started_at}`}
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
                        defaultValue={`${deadline}`}
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
                      // disabled={bypass}
                      placeholder="Your new secret key"
                    />
                    <div className="flex items-baseline mt-2">
                      <input
                        type="checkbox"
                        name="bypass"
                        id="bypass"
                        className="mr-2"
                        ref={register()}
                        onClick={() => setBypass(!bypass)}
                        defaultChecked={bypass}
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
                        Update Presence
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
          ) : (
            <Loading message="You don't have access to edit this Presence." />
          )
        ) : (
          <Loading />
        )}
      </Authenticated>
    </Layout1>
  );
};

export default EditPresence;
