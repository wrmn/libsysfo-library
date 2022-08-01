// r.HandleFunc("/admin/library/permission/{id}/access", accessHistory).Methods("GET")

import { getWithAuth, postWithAuth, whenUnsuccess } from "../api";
import { f7 } from "framework7-svelte";

const path = "/admin/library/permission";

export const getPermission = async () => {
  const response = await getWithAuth(path);
  if (response.status == 200) {
    return response.data.permission;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const findPermission = async (param) => {
  if (!(param.pid && param.uid)) {
    f7.dialog.alert("field can't be empty or invalid", "");
    return;
  }
  console.log(param);
  const response = await getWithAuth(
    `${path}/find?pid=${param.pid}&uid=${param.uid}`
  );
  if (response.status == 200 && response.data) {
    return response.data;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
  return {};
};

export const permissionAction = async (body) => {
  const response = await postWithAuth(body, `${path}/action`);
  return response;
};
