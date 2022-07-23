import { f7 } from "framework7-svelte";
import { postWithAuth } from "../api";

const path = "/profile/update"

const verifyPassword = (password) => {
  if (password.password != password.retypePassword) {
    f7.dialog.alert("Incorrect Retype Password", "");
    return false;
  }
  if (
    !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20}/g.test(password.password)
  ) {
    f7.dialog.alert(
      "New password need have at least one capital letter, one small leter, one number and one symbol",
      ""
    );
    return false;
  }
  return true;
};

export const updatePassword = async (password) => {
  if (!verifyPassword(password)) {
    return;
  }
  const response = await postWithAuth(password, `${path}/password`);
  f7.dialog.alert(response.description, "");
  return;
};

export const updateUsername = async (username, password) => {
  const reqBody = {
    newUsername: username,
  };
  const response = await postWithAuth(
    reqBody,
    `${path}/username`,
    password
  );
  f7.dialog.alert(response.description, "");
  return;
};
