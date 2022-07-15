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