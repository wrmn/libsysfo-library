import { createStore } from "framework7/lite";
import { writable } from "svelte/store";

const store = createStore({
  state: {
    products: [
      {
        id: "1",
        title: "Apple iPhone 8",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.",
      },
      {
        id: "2",
        title: "Apple iPhone 8 Plus",
        description:
          "Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!",
      },
      {
        id: "3",
        title: "Apple iPhone X",
        description:
          "Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.",
      },
    ],
  },
  getters: {
    products({ state }) {
      return state.products;
    },
  },
  actions: {
    addProduct({ state }, product) {
      state.products = [...state.products, product];
    },
  },
});
export default store;

export const darkTheme = writable(false);

export const notLogin = writable(false);

export const userData = writable({});

export const collectionData = writable({});

export const collectionSearchList = writable([]);

export const booksList = writable([]);

export const booksSearchList = writable([]);

export const bookResult = writable({});

export const userSearchList = writable([]);

export const userResult = writable({});

export const userDetail = writable({});

export const borrowsResult = writable([]);

export const borrowResult = writable({});

export const papersList = writable([]);

export const paperData = writable({});

export const paperSubject = writable([]);

export const permissionResult = writable([]);

export const dashboardDataset = writable({});

export const lineDataTemplate = {
  label: "My First dataset",
  fill: true,
  lineTension: 0.3,
  backgroundColor: "rgba(225, 204,230, .1)",
  borderColor: "rgb(205, 130, 158)",
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderColor: "rgb(205, 130,1 58)",
  pointBackgroundColor: "rgb(255, 255, 255)",
  pointBorderWidth: 3,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: "rgb(0, 0, 0)",
  pointHoverBorderColor: "rgba(220, 220, 220,1)",
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: [1, 2, 3, 4, 5, 6, 7],
};

const lineTemplate = {
  labels: [],
  datasets: [],
};

export const accessChartData = writable({ ...lineTemplate });
export const borrowChartData = writable({ ...lineTemplate });
export const bookChartData = writable({
  labels: ["New", "Great", "Good", "Bad"],
  datasets: [
    {
      data: [100, 100, 100, 100],
      backgroundColor: ["#9395D3", "#C1EDCC", "#F4A259", "#F00699"],
    },
  ],
});

export const paperChartData = writable({
  labels: ["Journal", "Thesis", "Other"],
  datasets: [
    {
      data: [100, 100, 100],
      backgroundColor: ["#9395D3", "#C1EDCC", "#F4A259"],
    },
  ],
});

export const otherData = writable({
  borrow: 100,
  access: 100,
  book: 100,
  paper: 100,
});
