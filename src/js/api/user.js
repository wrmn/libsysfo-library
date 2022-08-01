import { getWithAuth, whenUnsuccess } from "../api";
import { f7 } from "framework7-svelte";

const path = "/admin/library/user";

export const getUsers = async (keyword) => {
  const response = await getWithAuth(`${path}/find?keyword=${keyword}`);
  if (response.status == 200) {
    return response.data.user;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const getUser = async (id, subPath) => {
  let link = `${path}/${id}`;
  if (subPath) {
    link = `${link}/${subPath}`;
  }
  const response = await getWithAuth(link);
  if (response.status == 200) {
    return response.data;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};
