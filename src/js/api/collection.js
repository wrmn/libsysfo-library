import { getWithAuth, getWithoutAuth, postWithAuth } from "../api";
import { f7 } from "framework7-svelte";
const path = "/admin/library/collection";

const whenUnsuccess = (desc) => (desc ? desc : "server timeout");

export const searchBooks = async (keyword) => {
  let response = await getWithoutAuth(`/book?source=local&keyword=${keyword}`);
  if (response.status == 200 && response.data.book.length > 0) {
    return response.data.book;
  }
  response = await getWithoutAuth(`/book?source=gramedia&keyword=${keyword}`);
  if (response.status == 200 && response.data.book.length > 0) {
    return response.data.book;
  }
  return [];
};

export const getBook = async (slug) => {
  const response = await getWithoutAuth(`/book/${slug}`);
  if (response.status == 200) {
    return response.data.book;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const getCollections = async () => {
  const response = await getWithAuth(path);
  if (response.status == 200) {
    return response.data.book;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const getCollection = async (id) => {
  const response = await getWithAuth(`${path}/${id}`);
  if (response.status == 200) {
    return response.data;
  }
  f7.dialog.alert(whenUnsuccess(response.description), "");
};

export const newCollection = async (data) => {
  const response = await postWithAuth(data, `${path}/new`);

  f7.dialog.alert(
    response.description ? response.description : "server timeout",
    ""
  );
  if (response.status == 200) {
    return response;
  }
};

export const updateCollection = async (id, collection) => {
  const response = await postWithAuth(collection, `${path}/${id}/update`);
  f7.dialog.alert(
    response.description ? response.description : "server timeout",
    ""
  );
  if (response.status == 200) {
    return response;
  }
};
