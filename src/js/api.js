const serverUrl = import.meta.env.VITE_SERVER_ADDRESS;
import { f7 } from "framework7-svelte";
import { get } from "svelte/store";
import { notification, notificationCount } from "./store";

export const whenUnsuccess = (desc) => (desc ? desc : "server timeout");

export const delayer = async (data) => data;

export const postWithoutAuth = async (data, path) => {
  const request = new Request(`${serverUrl}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await fetch(request).catch(handleError);
  return response.json();
};

export const postWithAuth = async (data, path, password) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${localStorage.getItem("account-credential")}`
  );

  if (password != undefined) {
    myHeaders.append("Account-auth", password);
  }

  const request = new Request(`${serverUrl}${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: myHeaders,
  });
  const response = await fetch(request).catch(handleError);
  return response.json();
};

export const getWithoutAuth = async (path) => {
  const response = await fetch(`${serverUrl}${path}`).catch(handleError);
  return response.json();
};

export const getWithAuth = async (path) => {
  const myHeaders = new Headers();
  if (localStorage.getItem("account-credential")) {
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("account-credential")}`
    );
    const request = new Request(`${serverUrl}${path}`, {
      method: "GET",
      headers: myHeaders,
    });
    const response = await fetch(request).catch(handleError);
    return response.json();
  }
};

export const getReport = async (path) => {
  const myHeaders = new Headers();
  if (localStorage.getItem("account-credential")) {
    myHeaders.append(
      "Authorization",
      `Bearer ${localStorage.getItem("account-credential")}`
    );
    const request = new Request(`${serverUrl}/admin/library/report/${path}`, {
      method: "GET",
      headers: myHeaders,
    });

    const response = await fetch(request).catch(handleError);
    if (response.status != 200) {
      const js = await response.json();
      f7.dialog.alert(whenUnsuccess(resp.description), "");
      return;
    }
    const blob = await response.blob();
    let file = window.URL.createObjectURL(blob);
    window.location.assign(file);
  }
};

export const getNotification = async () => {
  notification.set(await getWithAuth(`/notification`));
  setTimeout(() => {
    let res = get(notification);
    if (res.data && res.data.notification) {
      let count = 0;
      res.data.notification.forEach((e) => {
        if (e.read == false) {
          count++;
        }
      });
      notificationCount.set(count);
    }
  }, 2000);
};

export const readNotification = async () => {
  const resp = await postWithAuth(undefined, `/notification`);
  f7.dialog.alert(resp.description ? resp.description : "server timeout", "");
  if (resp == 200) {
    notificationCount.set(0);
  }
};

const handleError = (err) => {
  console.warn(err);
  f7.dialog.close();
  f7.dialog.alert("server timeout", "");
};
