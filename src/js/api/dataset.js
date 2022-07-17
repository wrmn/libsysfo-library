import { getWithAuth } from "../api";
import { isoToDmy } from "../utility";
import {
  accessChartData,
  bookChartData,
  borrowChartData,
  lineDataTemplate,
  otherData,
  paperChartData,
} from "../store";
import { get } from "svelte/store";
import { value } from "dom7";

export const lineOption = (title) => {
  return {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scale: {
      ticks: {
        precision: 0,
      },
    },
  };
};

export let pieOption = {
  responsive: true,
};

export const getDataSet = async (datarange) => {
  let path = "/admin/library/dashboard";
  if (datarange != undefined) {
    path = `${path}?from=${datarange.fromDate}&to=${datarange.toDate}`;
  }
  const respBody = await getWithAuth(path);
  if (respBody.status == 200) {
    const paperType = respBody.data.dataset.paperType;
    const bookStats = respBody.data.dataset.bookStatus;
    getBorrowDataset(respBody.data.dataset.borrow);
    getAccessDataset(respBody.data.dataset.access);
    getBookDataset(bookStats);
    getPaperDataset(paperType);
    otherData.set({
      borrow: respBody.data.dataset.monthly.borrow,
      access: respBody.data.dataset.monthly.access,
      book: bookStats.new + bookStats.great + bookStats.good + bookStats.bad,
      paper: paperType.journal + paperType.thesis + paperType.other,
    });
  }
};

const getBorrowDataset = (borrowData) => {
  const data = get(borrowChartData);
  const datasetTotal = { ...lineDataTemplate };
  const datasetFinished = { ...lineDataTemplate };
  const datasetCanceled = { ...lineDataTemplate };

  data.labels = [];

  datasetTotal.label = "Total";
  datasetTotal.data = [];
  datasetTotal.borderColor = "#9395D3";
  datasetTotal.backgroundColor = "#9395D355";

  datasetFinished.label = "Finished";
  datasetFinished.data = [];
  datasetFinished.borderColor = "#81CC10";
  datasetFinished.backgroundColor = "#81CC1055";

  datasetCanceled.label = "Canceled";
  datasetCanceled.data = [];
  datasetCanceled.borderColor = "#F00999";
  datasetCanceled.backgroundColor = "#F0069955";

  if (borrowData) {
    borrowData.forEach((e) => {
      data.labels.push(isoToDmy(e.month, "mmm 'yy"));
      datasetTotal.data.push(e.count);
      datasetFinished.data.push(e.finished);
      datasetCanceled.data.push(e.canceled);
    });
  }
  data.datasets = [datasetTotal, datasetFinished, datasetCanceled];
  borrowChartData.set(data);
};

const getAccessDataset = (accessData) => {
  const data = get(accessChartData);
  const datasetTotal = { ...lineDataTemplate };

  data.labels = [];

  datasetTotal.label = "Total";
  datasetTotal.data = [];
  datasetTotal.borderColor = "#9395D3";
  datasetTotal.backgroundColor = "#9395D355";

  if (accessData) {
    accessData.forEach((e) => {
      data.labels.push(isoToDmy(e.month, "mmm 'yy"));
      datasetTotal.data.push(e.count);
    });
  }

  data.datasets = [datasetTotal];
  accessChartData.set(data);
};

const getBookDataset = (bookData) => {
  const data = get(bookChartData);
  data.datasets[0].data = [
    bookData.new,
    bookData.great,
    bookData.good,
    bookData.bad,
  ];
  bookChartData.set(data);
};

const getPaperDataset = (paperData) => {
  const data = get(paperChartData);
  data.datasets[0].data = [
    paperData.journal,
    paperData.thesis,
    paperData.other,
  ];
  paperChartData.set(data);
};
