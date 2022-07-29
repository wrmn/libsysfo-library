import { getWithAuth, postWithAuth, whenUnsuccess } from "../api";
import { f7 } from "framework7-svelte";

const path = "/admin/library/borrow";

export const getBorrows = async () => {
  const response = await getWithAuth(path);
  if (response.status == 200) {
    return response.data.borrow;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const findBorrow = async (param) => {
  if (!(param.cid && param.uid)) {
    f7.dialog.alert("field can't be empty or invalid", "");
    return;
  }
  console.log(param);
  const response = await getWithAuth(
    `${path}/find?cid=${param.cid}&uid=${param.uid}`
  );
  if (response.status == 200 && response.data) {
    return response.data;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
  return {};
};

export const borrowAction = async (body) => {
  const response = await postWithAuth(body, `${path}/action`);
  return response;
};
