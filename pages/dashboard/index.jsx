import Layout1 from "../../components/layouts/Layout1";
import Css from "../../styles/CustomCss.module.css";
import Admin from "../../components/middleware/Admin";

const DashboardIndex = () => {
  return (
    <Layout1 title="Dashboard">
      <Admin>
        <main
          className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
        >
          <h1 className="font-semibold mb-4 md:pt-0 pt-1 text-2xl text-cool-gray-600">
            Dashboard
          </h1>
          <div className="gap-3 grid md:grid-cols-2 text-cool-gray-600">
            <div className="border p-4 rounded-md">
              <h2 className="font-semibold mb-2 text-2xl">
                Presences Statistic
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                delectus, excepturi possimus accusantium natus nesciunt corporis
                animi cum repellendus, dolores quisquam commodi. Iure, placeat
                esse provident accusantium reiciendis eos eveniet!
              </p>
            </div>
            <div className="border p-4 rounded-md">
              <h2 className="font-semibold mb-2 text-2xl">Users Statistic</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                delectus, excepturi possimus accusantium natus nesciunt corporis
                animi cum repellendus, dolores quisquam commodi. Iure, placeat
                esse provident accusantium reiciendis eos eveniet!
              </p>
            </div>
          </div>
        </main>
      </Admin>
    </Layout1>
  );
};

export default DashboardIndex;
