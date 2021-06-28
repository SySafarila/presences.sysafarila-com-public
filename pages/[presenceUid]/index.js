import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout1 from "../../components/layouts/Layout1";
import firebase from "../../components/firebase";
import "firebase/firestore";
// import moment from "moment";
import Authenticated from "../../components/middleware/Authenticated";
import { useForm } from "react-hook-form";
import bcrypt from "bcryptjs";
import { useRecoilValue } from "recoil";
import { AuthState, UserState } from "../../components/recoil/Store";
import Css from "../../styles/CustomCss.module.css";
import Loading from "../../components/middleware/Loading";
import Swal from "sweetalert2";
// import Faker from "faker";
// import Style from "./style.module.css";
import RealtimeMoment from "../../components/presenceId/RealtimeMoment";
import Link from "next/link";
import LogsController from "../../components/LogsController";

const ShowPresences = () => {
  const router = useRouter();
  const { presenceUid, p } = router.query;
  const [presence, setPresence] = useState({});
  const [classes, setClasses] = useState(undefined);
  const [lesson, setLesson] = useState(undefined);
  const [school, setSchool] = useState(undefined);
  const [pass, setPass] = useState(false);
  const [students, setStudents] = useState([]);
  const [loaded, setIsLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);
  // const [timer, setTimer] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [studentsEmpty, setStudentsEmpty] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [waitCountDown, setWaitCountDown] = useState(undefined);
  const [stopCountDown, setStopCountDown] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(true);
  const [userCheckInStatus, setUserCheckinStatus] = useState(false);
  const [getStudentsStatus, setGetStudentsStatus] = useState(undefined);
  const [option, setOption] = useState(false);
  const activeUser = useRecoilValue(UserState);
  const auth = useRecoilValue(AuthState);

  const { register, handleSubmit, watch, errors } = useForm();
  const logs = LogsController();

  // getPresenceData() if presenceUid isn't undifined
  useEffect(() => {
    if (presenceUid != undefined) {
      getPresenceData();
    }
  }, [router]);

  // getStudents if router is ready & authenticated
  useEffect(() => {
    if (router.isReady && auth) {
      // console.count("getStudents()");
      const unsub = firebase
        .firestore()
        .collection("presences")
        .doc(presenceUid)
        .collection("students")
        .orderBy("time", "asc")
        .onSnapshot(
          (snap) => {
            if (snap.empty) {
              setStudentsEmpty(true);
            } else {
              setStudentsEmpty(false);
            }
            let arr = [];
            snap.forEach((data) => {
              arr.push({ ...data.data(), uid: data.id });
            });
            if (arr.length == 0) setUserExist(false);
            setStudents(arr);
            setButtonClicked(false);
          },
          (err) => {
            console.log("Error : ", err);
          }
        );

      // Cleanup (when presence changed & not authenticated)
      return () => {
        unsub();
        // console.count(`Unsubscribed ${presenceUid}`);
      };
    }
  }, [router, auth]);

  useEffect(() => {
    if (router.isReady && auth && loaded) {
      // console.count("countdown()");
      const countDownDate = new Date(presence.started_at).getTime();
      let stop = false;

      if (!stop) {
        const x = setInterval(() => {
          const now = new Date().getTime();
          const distance = countDownDate - now;

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setWaitCountDown(`${days}d, ${hours}h, ${minutes}m, ${seconds}s`);
          if (distance < 0) {
            clearInterval(x);
            stop = true;
            // console.count("Action enabled");
            // setStopCountDown(true);
          }

          // cleanup
        }, 1000);
        return () => {
          clearInterval(x);
          // setStopCountDown(true);
          setWaitCountDown(undefined);
        };
      }
    }
  }, [auth, loaded, new Date(presence.started_at).getTime()]);

  // update setGetStudentsStatus(state) not authenticated
  useEffect(() => {
    if (!auth) {
      setGetStudentsStatus(undefined);
    }
  }, [auth]);

  // re-run useCheckIn() & countdown() when loaded changed
  useEffect(() => {
    if (loaded) {
      useCheckIn();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      if (!stopCountDown) {
        // countdown();
      }
    }
  }, [loaded, presence]);

  // re-run setUserExist() when auth changed
  useEffect(() => {
    if (auth == false) {
      setStudents([]);
      setUserExist(false);
    }
  }, [auth]);

  // re-run userExistCheck() when students changed
  useEffect(() => {
    userExistCheck();
  }, [students]);

  const getPresenceData = async () => {
    // console.count("getPresenceData()");
    await firebase
      .firestore()
      .collection("presences")
      .doc(presenceUid)
      .get()
      .then((res) => {
        if (res.exists) {
          setPresence({ ...res.data(), uid: res.id });
          setClasses(res.data().class);
          setLesson(res.data().lesson);
          setSchool(res.data().school);
          if (res?.data()?.bypass) {
            setBypass(true);
            setPass(true);
          }
          setIsLoaded(true);
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        console.count(err);
      });
  };

  const addData = async (status) => {
    // console.count("addData()");
    await firebase
      .firestore()
      .collection("presences")
      .doc(presenceUid)
      .collection("students")
      .doc(activeUser?.uid)
      .set({
        name: activeUser?.displayName,
        email: activeUser?.email,
        time: new Date().getTime(),
        status: status,
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Good",
          text: "Your data was recorded !",
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      });
  };

  const addAndCheck = async (status) => {
    // console.count("addAndCheck()");
    setButtonClicked(true);
    await firebase
      .firestore()
      .collection("presences")
      .doc(presenceUid)
      .collection("students")
      .doc(activeUser?.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `You cannot ${status} anymore`,
          });
        } else {
          // Add data
          addData(status);
          setButtonClicked(false);
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      });
  };

  const cancel = async () => {
    // console.count("cancel()");
    setButtonClicked(true);
    await firebase
      .firestore()
      .collection("presences")
      .doc(presenceUid)
      .collection("students")
      .doc(activeUser?.uid)
      .delete()
      .then(() => {
        setUserExist(false);
        Swal.fire({
          icon: "success",
          title: "Good",
          text: "Your data was removed !",
        });
        setButtonClicked(false);
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      });
  };

  // const getStudents = async () => {
  //   console.count("getStudents()");
  //   const presenceRef = firebase
  //     .firestore()
  //     .collection("presences")
  //     .doc(presenceUid);
  //   const studentsRef = presenceRef.collection("students");

  //   presenceRef
  //     .get()
  //     .then((res) => {
  //       if (res.exists) {
  //         // Presence exist
  //         const unsubscribeStudents = studentsRef
  //           .orderBy("time", "asc")
  //           .onSnapshot(
  //             (snap) => {
  //               if (snap.empty) {
  //                 setStudentsEmpty(true);
  //               } else {
  //                 setStudentsEmpty(false);
  //               }
  //               let arr = [];
  //               snap.forEach((data) => {
  //                 arr.push({ ...data.data(), uid: data.id });
  //               });
  //               if (arr.length == 0) setUserExist(false);
  //               setStudents(arr);
  //               setButtonClicked(false);
  //             },
  //             (err) => {
  //               console.error("Stop listening students");
  //               unsubscribeStudents();
  //             }
  //           );
  //       } else {
  //         // Presence doesn't exist
  //       }
  //     })
  //     .catch((err) => {
  //       console.count(err);
  //     });
  //   setGetStudentsStatus(true);
  // };

  const userExistCheck = () => {
    let userFound = false;
    students.forEach((data) => {
      if (data.uid == activeUser?.uid) {
        userFound = true;
      }
    });
    setUserExist(userFound);
  };

  const getHadir = () => {
    // console.log("getHadir()");
    let hadir = [];
    students.forEach((data) => {
      if (data.status == "hadir") {
        hadir.push(data);
      }
    });
    return hadir.length;
  };

  const getSakit = () => {
    // console.log("getSakit()");
    let sakit = [];
    students.forEach((data) => {
      if (data.status == "sakit") {
        sakit.push(data);
      }
    });
    return sakit.length;
  };

  const getIzin = () => {
    // console.log("getIzin");
    let izin = [];
    students.forEach((data) => {
      if (data.status == "izin") {
        izin.push(data);
      }
    });
    return izin.length;
  };

  const onSubmit = (data) => {
    // console.count("onSubmit");
    const check = bcrypt.compareSync(data.password, presence.password);
    if (check) {
      setBypass(true);
      setPass(true);
      Swal.fire({
        icon: "success",
        title: "Good",
        text: "Keep your password secret !",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password is wrong !",
      });
    }
  };

  // const random = async () => {
  //   // console.count("random()");
  //   setButtonClicked(true);
  //   for (let index = 0; index < 40; index++) {
  //     let name = Faker.name.findName();
  //     let email = Faker.internet.email();
  //     let status = Faker.random.arrayElement(["hadir", "sakit", "izin"]);
  //     let uid = Faker.random.alphaNumeric(9);

  //     await firebase
  //       .firestore()
  //       .collection("presences")
  //       .doc(presenceUid)
  //       .collection("students")
  //       .doc(uid)
  //       .set({
  //         name: name,
  //         email: email,
  //         time: new Date().getTime(),
  //         status: status,
  //       })
  //       .then(() => {
  //         console.count(true);
  //       })
  //       .catch(() => {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: "Something went wrong !",
  //         });
  //       });
  //   }
  //   setButtonClicked(false);
  // };

  const getStatus = (status) => {
    // console.log("getStatus()");
    switch (status) {
      case "hadir":
        return (
          <div className="flex items-baseline">
            <div className="bg-green-400 h-2 mr-1 rounded-full w-2"></div>
            <span>Hadir</span>
          </div>
        );
        break;

      case "sakit":
        return (
          <div className="flex items-baseline">
            <div className="bg-red-500 h-2 mr-1 rounded-full w-2"></div>
            <span>Sakit</span>
          </div>
        );
        break;

      case "izin":
        return (
          <div className="flex items-baseline">
            <div className="bg-light-yellow-400 h-2 mr-1 rounded-full w-2"></div>
            <span>Izin</span>
          </div>
        );
        break;

      default:
        break;
    }
  };

  const persentase = () => {
    // console.log("persentase()");
    const hadir = parseInt((getHadir() / students.length) * 100);
    const sakit = parseInt((getSakit() / students.length) * 100);
    const izin = parseInt((getIzin() / students.length) * 100);
    const hadirFloat = (getHadir() / students.length) * 100;
    const sakitFloat = (getSakit() / students.length) * 100;
    const izinFloat = (getIzin() / students.length) * 100;

    return {
      hadir: hadir || 0,
      sakit: sakit || 0,
      izin: izin || 0,
      hadirFloat: hadirFloat || 0,
      sakitFloat: sakitFloat || 0,
      izinFloat: izinFloat || 0,
    };
  };

  // const countdown = () => {
  //   console.count("countdown()");
  //   const countDownDate = new Date(presence.started_at).getTime();
  //   let stop = false;

  //   if (!stop) {
  //     const x = setInterval(() => {
  //       const now = new Date().getTime();
  //       const distance = countDownDate - now;

  //       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  //       const hours = Math.floor(
  //         (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  //       );
  //       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //       setWaitCountDown(`${days}d, ${hours}h, ${minutes}m, ${seconds}s`);
  //       if (distance < 0) {
  //         clearInterval(x);
  //         stop = true;
  //         // console.count("Action enabled");
  //         setStopCountDown(true);
  //       }
  //     }, 1000);
  //   }
  // };

  const useCheckIn = () => {
    // console.count("useCheckIn()");
    if (auth) {
      if (userCheckInStatus == false) {
        const ref1 = firebase
          .firestore()
          .collection("users")
          .doc(activeUser.uid);
        const ref2 = ref1.collection("visitedPresences").doc(presenceUid);

        // Add data
        ref2.get().then((res) => {
          if (res.exists) {
            // console.count("You have visited this presence");
          } else {
            ref2
              .set({
                visited: true,
                visibility: "private",
                classes: classes,
                school: school,
                lesson: lesson,
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .then(() => {
                setUserCheckinStatus(true);
                // console.count("Visiting this presence");
              })
              .catch((err) => {
                console.count(err);
              });
            logs.store(
              activeUser?.uid,
              `${activeUser?.displayName} just visiting presence : ${presenceUid}`
            );
          }
        });
      }
    }
  };

  const deletePresence = async () => {
    let check = false;
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0284C7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
        check = true;
      }
    });

    const deleteStudentsProcess = () => {
      return firebase
        .firestore()
        .collection("presences")
        .doc(presenceUid)
        .collection("students")
        .get();
    };

    const deletePresenceProcess = () => {
      return firebase
        .firestore()
        .collection("presences")
        .doc(presenceUid)
        .delete();
    };

    const deleteVisitedPresenceProcess = () => {
      return firebase
        .firestore()
        .collection("users")
        .doc(activeUser?.uid)
        .collection("visitedPresences")
        .doc(presenceUid)
        .delete();
    };

    let presenceDeleted, visitedPresenceDeleted;
    if (check) {
      setButtonClicked(true);
      try {
        const deletingStudents = await deleteStudentsProcess();
        deletingStudents.forEach((data) => {
          firebase
            .firestore()
            .collection("presences")
            .doc(presenceUid)
            .collection("students")
            .doc(data.id)
            .delete();
        });
      } catch (error) {
        console.log(error);
      }

      try {
        const deletingPresence = await deletePresenceProcess();
        // console.log("Presence deleted");
        presenceDeleted = true;
      } catch (error) {
        presenceDeleted = false;
        // console.log(error);
      }

      try {
        const deletingVisitedPresences = await deleteVisitedPresenceProcess();
        // console.log("Visited presence deleted");
        visitedPresenceDeleted = true;
      } catch (error) {
        presenceDeleted = false;
        // console.log(error);
      }

      if (presenceDeleted && visitedPresenceDeleted) {
        // setButtonClicked(false);
        await logs.store(
          activeUser?.uid,
          `${activeUser?.displayName} just deleting presence with the entire students data : ${presenceUid}`
        );
        Swal.fire({
          icon: "success",
          title: "Good",
          text: "Presence and the students was deleted !",
        });
        router.push("/current-presences");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong !",
        });
      }
    }
  };

  return (
    <>
      <Layout1
        title={`Presences ${
          presenceUid != undefined ? `- ${presenceUid}` : ""
        }`}
        robots="noindex, nofollow"
      >
        <Authenticated>
          {loaded ? (
            bypass == true ? (
              <main
                className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
                id="notPassed"
              >
                <div className="flex items-baseline justify-between relative">
                  <h1
                    className="break-words font-semibold leading-none line-clamp-2 md:pt-0 pt-2 text-2xl text-cool-gray-600"
                    id="schoolAndClass"
                  >
                    {school} - {classes}
                  </h1>
                  {presence?.userId == activeUser?.uid ? (
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="currentColor"
                        className="-mr-2.5 cursor-pointer flex-none hover:text-cool-gray-700 text-cool-gray-600"
                        onClick={() => setOption(!option)}
                      >
                        <path d="M0 0h24v24H0V0z" fill="none" />
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                      <div
                        id="option"
                        className={`absolute bg-white border ${
                          option ? "flex flex-col" : "hidden"
                        } md:w-1/6 p-2 right-4 rounded-md shadow-md w-2/4 focus:outline-none mt-2.5 md:mt-1 md:mr-2 px-3.5 top-0`}
                      >
                        <Link href={`/${presenceUid}/edit`}>
                          <a className="hover:text-cool-gray-700 text-cool-gray-600">
                            Edit
                          </a>
                        </Link>
                        <span
                          className="hover:text-cool-gray-700 text-cool-gray-600 cursor-pointer"
                          onClick={() => deletePresence()}
                        >
                          Delete
                        </span>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <h2
                  className="font-thin line-clamp-1 text-base text-cool-gray-600"
                  id="lesson"
                >
                  <span>{lesson}</span>
                  <span> with </span>
                  <span className="break-words capitalization font-semibold">
                    {presence.lecturer}
                  </span>
                </h2>
                <small className="flex font-thin text-cool-gray-600">
                  <span className="min-w-max">
                    <span>Created </span>
                    <RealtimeMoment
                      moment={presence.created_at.toDate()}
                      name="created_at"
                    />
                    <span> by </span>
                  </span>
                  <span className="break-words capitalization font-semibold line-clamp-1 ml-1">
                    {presence.name}
                  </span>
                </small>
                <small className="flex font-thin text-cool-gray-600">
                  <span>Expired</span>
                  <span className="font-medium ml-1 text-red-600">
                    <RealtimeMoment
                      moment={presence.deadline}
                      name="deadline"
                    />
                  </span>
                </small>
                <div className="flex flex-col md:flex-row">
                  <div className="border-t flex flex-col flex-grow flex-shrink md:order-1 mt-4 order-2">
                    <div
                      id="students"
                      className="mb-2 md:mb-0 text-cool-gray-600"
                    >
                      {studentsEmpty ? (
                        <p className="mt-4 text-cool-gray-500">
                          Currently not recorded
                        </p>
                      ) : (
                        students.map((student) => (
                          <div
                            key={student.uid}
                            className={`flex flex-col my-2`}
                          >
                            <div
                              className="flex items-center justify-between"
                              title={student?.email}
                            >
                              <span className="font-semibold break-all line-clamp-2">
                                {student.name}
                              </span>
                              {activeUser?.email == student?.email ? (
                                <img
                                  src="/star.svg"
                                  alt="Its you"
                                  title="Its you"
                                  className="h-4 ml-1.5"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                            <span
                              className={`font-thin capitalize text-xs flex`}
                            >
                              {getStatus(student.status)}
                              <span className="pl-1.5">
                                {student.time > presence.deadline ? (
                                  <span className="bg-red-500 ml-1.5 px-1 rounded-full text-white uppercase">
                                    Late
                                  </span>
                                ) : (
                                  ""
                                )}
                              </span>
                            </span>
                            <small className="font-thin text-cool-gray-500 text-xs">
                              <RealtimeMoment
                                moment={student.time}
                                name="studentTime"
                              />
                            </small>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col h-full md:order-2 md:w-1/4 order-1">
                    <div>
                      {new Date().getTime() <= presence.started_at ? (
                        <div
                          className="-mb-2 md:mb-2 md:ml-4 mt-2 text-cool-gray-600"
                          id="wait"
                        >
                          Please wait{" "}
                          <span className="font-medium">{waitCountDown}</span>
                        </div>
                      ) : (
                        <div
                          className="h-full md:mb-4 md:ml-4 md:order-last mt-5 rounded-md text-center text-white"
                          id="action"
                        >
                          {userExist ? (
                            <>
                              {/* {activeUser?.uid == presence?.userId ? (
                                <button
                                  className="disabled:cursor-not-allowed disabled:opacity-60 bg-cool-gray-500 cursor-pointer font-semibold hover:bg-cool-gray-600 mb-2 mt-2 p-1 rounded-md w-full"
                                  onClick={() => random()}
                                  disabled={buttonClicked}
                                >
                                  Random
                                </button>
                              ) : (
                                ""
                              )} */}
                              <button
                                className="bg-cool-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-semibold hover:bg-cool-gray-600 md:mt-2 p-1 rounded-md w-full"
                                onClick={() => cancel()}
                                disabled={buttonClicked}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <div>
                              <button
                                className="bg-light-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-semibold hover:bg-light-blue-600 mb-2 md:mt-2 p-1 rounded-md w-full"
                                onClick={() => addAndCheck("hadir")}
                                disabled={buttonClicked}
                              >
                                Hadir
                              </button>
                              <div className="flex">
                                <button
                                  className="disabled:cursor-not-allowed bg-light-yellow-400 disabled:opacity-60 cursor-pointer font-semibold hover:bg-light-yellow-500 mr-1 p-1 rounded-md w-full"
                                  onClick={() => addAndCheck("izin")}
                                  disabled={buttonClicked}
                                >
                                  Izin
                                </button>
                                <button
                                  className="disabled:cursor-not-allowed bg-rose-500 cursor disabled:opacity-60 cursor-pointer font-semibold hover:bg-rose-600 ml-1 p-1 rounded-md w-full"
                                  onClick={() => addAndCheck("sakit")}
                                  disabled={buttonClicked}
                                >
                                  Sakit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div
                      id="persentase"
                      className="bg-cool-gray-200 flex h-2 md:ml-4 md:mt-0 mt-4 overflow-hidden rounded-md"
                    >
                      <div
                        id="hadir"
                        className="bg-green-400 h-4 transition-all duration-1000 ease-in-out"
                        style={{
                          width: `${persentase().hadirFloat}%` ?? "xxx",
                        }}
                      ></div>
                      <div
                        id="sakit"
                        className="bg-rose-500 h-4 transition-all duration-1000 ease-in-out"
                        style={{
                          width: `${persentase().sakitFloat}%` ?? "xxx",
                        }}
                      ></div>
                      <div
                        id="izin"
                        className="bg-light-yellow-400 h-4 transition-all duration-1000 ease-in-out"
                        style={{
                          width: `${persentase().izinFloat}%` ?? "xxx",
                        }}
                      ></div>
                    </div>
                    <div
                      id="persentaseDetail"
                      className="-ml-1 flex justify-between md:ml-3 mt-2 text-xs"
                    >
                      <div className="flex items-baseline">
                        <div className="bg-green-400 h-2 mx-1 rounded-full w-2"></div>
                        <span>
                          Hadir{" "}
                          <span className="text-cool-gray-500">
                            {persentase().hadir}%
                          </span>
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <div className="bg-red-500 h-2 mx-1 rounded-full w-2"></div>
                        <span>
                          Sakit{" "}
                          <span className="text-cool-gray-500">
                            {persentase().sakit}%
                          </span>
                        </span>
                      </div>
                      <div className="flex items-baseline">
                        <div className="bg-light-yellow-400 h-2 mx-1 rounded-full w-2"></div>
                        <span>
                          Izin{" "}
                          <span className="text-cool-gray-500">
                            {persentase().izin}%
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            ) : (
              <div
                id="passed"
                className={`max-w-5xl md:py-10 mx-auto px-4 py-4 ${Css.heightFull}`}
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="md:mt-10 mt-14"
                >
                  <div id="password" className="mb-4">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      ref={register}
                      className="bg-white block border focus:border-cool-gray-400 focus:outline-none md:w-2/5 mt-2 px-2.5 py-2 rounded-br-md rounded-tl-md text-cool-gray-600 w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-500 p-2 rounded text-white"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )
          ) : notFound ? (
            <Loading message="Presences Not Found" />
          ) : (
            <Loading />
          )}
        </Authenticated>
      </Layout1>
    </>
  );
};

export default ShowPresences;
