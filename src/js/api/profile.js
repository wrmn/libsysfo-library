import { notLogin, userData } from "../store";
import { getWithAuth } from "../api";
import { f7 } from "framework7-svelte";
import { getDataSet } from "./dataset";

export const checkLogin = () => {
  notLogin.set(localStorage.getItem("account-credential") == null);
};

export const getData = async () => {
  const msg = await getWithAuth(`/admin/library`);
  if (msg.status == 401) {
    f7.dialog.alert("Please login again", "Token Invalid", function () {
      localStorage.removeItem("account-credential");
      window.location.reload();
    });
  }
  userData.set(msg.data.profile);
  getDataSet();
};

export const logout = () => {
  f7.dialog.confirm("Logout user?", "", function () {
    localStorage.removeItem("account-credential");
    f7.dialog.alert("Logged Out", "Info", () => {
      window.location.reload();
    });
  });
};
