import { postWithAuth } from "../api";

const path = "/admin/library/update";

export const updateGeneral = async (data) => {
  const response = await postWithAuth(data, `${path}`);

  if (response.status == 200) {
    return response;
  }
  return {};
};

export const updateImage = async (data) => {
  const response = await postWithAuth(data, `${path}/image`);

  if (response.status == 200) {
    return response;
  }
  return {};
};
