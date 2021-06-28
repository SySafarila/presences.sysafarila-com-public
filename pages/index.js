import Layout1 from "../components/layouts/Layout1";
import Font from "../styles/Font.module.css";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { AuthState } from "../components/recoil/Store";
import Css from "../styles/CustomCss.module.css";

const Home = () => {
  const auth = useRecoilValue(AuthState);

  return (
    <>
      <Layout1 title="Presences">
        <main
          className={`max-w-5xl md:pb-10 md:pt-20 mx-auto pb-4 pt-16 px-4 ${Css.heightFull}`}
        >
          <div
            id="jumbotron"
            className="h-40 md:h-80 md:pt-0 mt-1 pt-2 relative text-center"
          >
            <img
              src="/photos/marvin-meyer-SYTO3xs06fU-unsplash.jpg"
              alt="Jumbotron"
              className="blur-xs filter h-full object-cover rounded-br-md rounded-tl-md w-full"
            />
            <div
              className={`absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 text-white ${Font.fraunces}`}
            >
              <h1 className="mb-2 md:mb-9 md:text-6xl text-xl">Welcome To</h1>
              <h2 className="flex mb-2 md:mb-9 md:text-4xl text-xl whitespace-nowrap">
                <span className="bg-cool-gray-500 bg-opacity-50 pb-1 px-1 rounded-tl-sm">
                  Presences by
                </span>
                <span className="bg-opacity-80 bg-white pb-1 px-1 rounded-br-sm text-gray-600">
                  SySafarila
                </span>
              </h2>
            </div>
          </div>
          <div id="gs" className="mb-6 md:mt-10 mt-6 text-center">
            <p className="mb-7 text-cool-gray-600">
              Presences will help you to organize your presence at your classes,
              dont worry about overwrited, and feel free to use.
            </p>
            {!auth ? (
              <Link href="/create">
                <a className="bg-light-blue-500 duration-200 font font-semibold hover:bg-light-blue-600 md:p-4 p-2.5 rounded subpixel-antialiased text-white transition-all">
                  Getting Started
                </a>
              </Link>
            ) : (
              <div className="flex flex-col justify-center md:flex-row">
                <Link href="/create">
                  <a className="mx-1 my-1 bg-light-blue-500 duration-200 font font-semibold hover:bg-light-blue-600 md:p-4 p-2.5 rounded subpixel-antialiased text-white transition-all">
                    Create Now
                  </a>
                </Link>
                <Link href="/current-presences">
                  <a className="mx-1 my-1 bg-green-500 duration-200 font font-semibold hover:bg-green-600 md:p-4 p-2.5 rounded subpixel-antialiased text-white transition-all">
                    Current Presences
                  </a>
                </Link>
              </div>
            )}
          </div>
          <div id="x" className="text-center mb-10">
            <p className="text-cool-gray-600">
              Have a problems ?{" "}
              <a
                href="#"
                className="text-light-blue-500 hover:text-light-blue-600 underline"
              >
                you can get help here.
              </a>
            </p>
          </div>
          <div
            id="y"
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 mt-10 items-center"
          >
            <img
              src="/photos/kelly-sikkema-jr61kHaWKek-unsplash.jpg"
              alt="Organized"
              className="rounded-br-md rounded-tl-md"
            />
            <div>
              <h2 className="font-semibold text-cool-gray-700 text-xl mb-2">
                Why Should Presences ?
              </h2>
              <p className="text-cool-gray-600">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod,
                minus? Ducimus ea provident labore ab id dolore excepturi
                nostrum facere et aliquam. Numquam est aliquid veniam quis
                soluta nobis. Illo. Officiis, reiciendis repellendus. Corporis
                quia, ipsa, ipsam beatae inventore, distinctio nisi optio quae
                ullam nam sed doloremque obcaecati dicta repellat molestias
                quaerat in corrupti! Adipisci quis neque deleniti illo
                reprehenderit. Soluta rerum aliquam et magni fuga voluptate quod
                inventore? Laboriosam laudantium adipisci fugiat, numquam ipsum
                amet ex voluptas eligendi perferendis aut ratione consequuntur
                dicta, suscipit quos iste beatae, maxime quae.
              </p>
            </div>
          </div>
          <div
            id="y"
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 mt-10 items-center"
          >
            <div className="order-last md:order-first">
              <h2 className="font-semibold text-cool-gray-700 text-xl md:text-right mb-2">
                How We Work ?
              </h2>
              <p className="text-cool-gray-600 md:text-right">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti velit voluptate harum vero tempore eius magnam
                provident, eaque dignissimos quisquam adipisci eveniet amet
                reprehenderit. Ab nam repellendus laudantium recusandae non!
                Recusandae ea, ut molestiae at repellendus illo eveniet. Vero
                reiciendis asperiores doloremque hic ut maiores illum, explicabo
                eaque impedit corrupti? Expedita, error recusandae vero
                doloribus possimus ipsam pariatur natus adipisci. Officiis
                nesciunt itaque praesentium accusantium! Officia quod quas
                consequatur labore a dolorum maxime ut, id, sint, cumque veniam
                earum recusandae tempora nam blanditiis ad autem saepe
                voluptatum eaque sequi similique!
              </p>
            </div>
            <img
              src="/photos/bill-oxford--fGqsewtsJY-unsplash.jpg"
              alt="Learning"
              className="rounded-bl-md rounded-tr-md"
            />
          </div>
        </main>
      </Layout1>
    </>
  );
};

export default Home;
