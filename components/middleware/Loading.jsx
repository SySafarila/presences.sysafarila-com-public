import Css from "../../styles/CustomCss.module.css";

const Loading = (props) => {
  return (
    <main
      className={`max-w-5xl md:pt-10 md:py-10 mx-auto px-4 py-4 relative ${Css.heightFull}`}
    >
      <div className="-translate-x-2/4 -translate-y-2/4 absolute left-2/4 md:mt-0 md:pt-28 mt-5 pt-10 top-2/4 transform">
        <span className="font-bold text-2xl text-cool-gray-500">
          {props.message ?? "Loading..."}
        </span>
      </div>
    </main>
  );
};

export default Loading;
