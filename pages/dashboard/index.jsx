import Layout1 from "../../components/layouts/Layout1";
import Css from "../../styles/CustomCss.module.css";
import Admin from "../../components/middleware/Admin";
import Authenticated from "../../components/middleware/Authenticated";
import PresencesStatistic from "../../components/dashboard/PresencesStatistic";
import UsersStatistic from "../../components/dashboard/UsersStatistic";
import firebase from "../../components/firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { AuthState } from "../../components/recoil/Store";

const DashboardIndex = () => {
  const [logs, setLogs] = useState([]);
  const auth = useRecoilValue(AuthState);

  useEffect(() => {
    if (auth) {
      const unsub = firebase
        .firestore()
        .collection("logs")
        .orderBy("created_at", "desc")
        .onSnapshot((snap) => {
          let arr = [];
          snap.forEach((data) => {
            arr.push({ uid: data.id, ...data.data() });
          });
          setLogs(arr);
        });

      return () => {
        console.count("Unsubscribe logs");
        setLogs([]);
        unsub();
      };
    }
  }, [auth]);

  return (
    <Layout1 title="Dashboard">
      <Authenticated>
        <Admin>
          <main
            className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
          >
            <h1 className="font-semibold mb-4 md:pt-0 pt-1 text-2xl text-cool-gray-600">
              Dashboard
            </h1>
            <div className="gap-5 grid md:grid-cols-2 text-cool-gray-600">
              <div className="border col-span-2 md:col-span-1 p-4 rounded-md">
                <h2 className="font-semibold mb-2 text-2xl">
                  Presences Statistic
                </h2>
                <PresencesStatistic />
              </div>
              <div className="border col-span-2 md:col-span-1 p-4 rounded-md">
                <h2 className="font-semibold mb-2 text-2xl">Users Statistic</h2>
                <UsersStatistic />
              </div>
              <div className="border col-span-2 p-4 rounded-md">
                <h2 className="font-semibold mb-2 text-2xl">Logs</h2>
                <table className="border border-collapse mt-4">
                  <thead>
                    <tr>
                      <th className="border text-center p-2">NO</th>
                      <th className="border p-2 text-left">USER</th>
                      <th className="border p-2 text-left">MESSAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs?.map((log, index) => (
                      <tr key={log.uid}>
                        <td className="border p-2 text-center align-top">
                          {index + 1}
                        </td>
                        <td className="border p-2 break-all w-1/5 align-top">
                          <span className="line-clamp-2">{log.userId}</span>
                        </td>
                        <td className="border p-2 w-full align-top">
                          <span className="line-clamp-2 md:line-clamp-3">
                            {log.action}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </Admin>
      </Authenticated>
    </Layout1>
  );
};

export default DashboardIndex;
