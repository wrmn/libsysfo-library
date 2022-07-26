import { getWithAuth, whenUnsuccess } from "../api";
import { f7 } from "framework7-svelte";

const path = "/admin/library/borrow";

export const getBorrows = async () => {
  const response = await getWithAuth(path);
  if (response.status == 200) {
    return response.data.borrow;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};