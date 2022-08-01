import dateFormat from "dateformat";

export const switchTheme = () => {
  const theme = localStorage.getItem("theme");
  const opposite = theme === "dark" ? "light" : "dark";
  document.documentElement.classList.add(opposite);
  document.documentElement.classList.remove(theme);
  localStorage.setItem("theme", opposite);
};

export const isoToDmy = (dateStr, format) => {
  const date = new Date(dateStr);
  return dateFormat(date, format);
};

export const monthValues = {
  values: "0 1 2 3 4 5 6 7 8 9 10 11".split(" "),
  displayValues:
    "January February March April May June July August September October November December".split(
      " "
    ),
  textAlign: "center",
};

export const yearValues = {
  values: (function () {
    var arr = [];
    for (var i = 1950; i <= 2030; i++) {
      arr.push(i);
    }
    return arr;
  })(),
};

export const capitalize = (str) =>
  str.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

export const sorting = (a, b, field, desc) => {
  let fa = a[field],
    fb = b[field];
  if (desc) {
    fa = b[field];
    fb = a[field];
  }
  if (fa < fb) {
    return -1;
  }
  if (fa > fb) {
    return 1;
  }
  return 0;
};
