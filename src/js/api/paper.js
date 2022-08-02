import { getWithAuth, postWithAuth, whenUnsuccess } from "../api";
import { f7 } from "framework7-svelte";

const path = "/admin/library/paper";

export const getPapers = async () => {
  const response = await getWithAuth(path);
  if (response.status == 200) {
    return response.data.paper;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const singlePaper = async (id) => {
  const response = await getWithAuth(`${path}/${id}`);
  if (response.status == 200) {
    return response.data;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const newPaper = async (data) => await postWithAuth(data, `${path}/new`);

export const updatePaper = async (id, data) => {
  let link = `${path}/${id}/update`;
  if (data.file) {
    link = `${link}/file`;
  }
  const response = await postWithAuth(data, link);

  if (response.status == 200) {
    return response;
  }
  return {};
};
