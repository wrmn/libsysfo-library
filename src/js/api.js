const serverUrl = import.meta.env.VITE_SERVER_ADDRESS;

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

export const postWithAuth = async (data, path) => {
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${localStorage.getItem("account-credential")}`
  );
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

const handleError = (err) => {
  console.warn(err);
};
