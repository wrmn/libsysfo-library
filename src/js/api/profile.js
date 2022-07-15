import { notLogin, userData } from "../store";
import { getWithAuth } from "../api";
import { f7 } from "framework7-svelte";
import { getDataSet } from "./dataset";

export const checkLogin = () => {
  notLogin.set(localStorage.getItem("account-credential") == null);
};

export const getData = async () => {
  const msg = await getWithAuth(`/admin/library`);
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
