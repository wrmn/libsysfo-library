import { postWithAuth } from "../api";

const path = "/admin/library/update";

export const updateGeneral = async (data) => {
  const response = await postWithAuth(data, `${path}`);

  if (response.status == 200) {
    return response;
  }
  return {};
};

export const updateImage = async (data) =>
  await postWithAuth(data, `${path}/image`);

export const updateImageContent = async (data) =>
  await postWithAuth(data, `${path}/image/content`);

export const updateLocation = async (data) =>
  await postWithAuth(data, `${path}/location`);
