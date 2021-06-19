import moment from "moment";
import { useEffect, useState } from "react";

const RealtimeMoment = (props) => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    let second;
    switch (props.name) {
      case "studentTime":
        second = 300;
        break;

      case "deadline":
        second = 7200;
        break;

      case "created_at":
        second = 7200;
        break;

      default:
        second = 3600;
        break;
    }
    if (number >= second) return;

    const interval = setInterval(() => {
      setNumber(number + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [number]);

  switch (props.name) {
    case "studentTime":
      return <span>{moment(props.moment).fromNow()}</span>;
      break;

    case "deadline":
      return (
        <span>
          {moment(new Date().getTime()).to(
            moment(new Date(props.moment).getTime())
          )}
        </span>
      );
      break;

    case "created_at":
      return <span>{moment(props.moment).fromNow()}</span>;
      break;

    default:
      return <span>Nothing here</span>;
      break;
  }
};

export default RealtimeMoment;
