const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: colors.blue,
        // "light-blue": colors.lightBlue,
        "light-blue": colors.sky,
        "cool-gray": colors.coolGray,
        "blue-gray": colors.blueGray,
        rose: colors.rose,
        teal: colors.teal,
        "light-yellow": colors.yellow,
      },
      blur: {
        xs: "2px",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ["disabled"],
      display: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    // ...
  ],
};
