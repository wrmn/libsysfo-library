import { getWithAuth } from "../api";
import { isoToDmy } from "../utility";
import {
  accessChartData,
  bookChartData,
  borrowChartData,
  lineDataTemplate,
  paperChartData,
} from "../store";
import { get } from "svelte/store";

export const lineOption = (title) => {
  return {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

export const getDataSet = async () => {
  const respBody = await getWithAuth("/admin/library/dashboard");
  if (respBody.status == 200) {
    getBorrowDataset(respBody.data.dataset.borrow);
    getAccessDataset(respBody.data.dataset.access);
    getBookDataset(respBody.data.dataset.bookStatus);
    getPaperDataset(respBody.data.dataset.paperType);
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
  datasetFinished.borderColor = "#C1CC10";
  datasetFinished.backgroundColor = "#C1CC1055";

  datasetCanceled.label = "Canceled";
  datasetCanceled.data = [];
  datasetCanceled.borderColor = "#F00699";
  datasetCanceled.backgroundColor = "#F0069955";

  borrowData.forEach((e) => {
    data.labels.push(isoToDmy(e.month, "mmm 'yy"));
    datasetTotal.data.push(e.count);
    datasetFinished.data.push(e.finished);
    datasetCanceled.data.push(e.canceled);
  });

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
  accessData.forEach((e) => {
    data.labels.push(isoToDmy(e.month, "mmm 'yy"));
    datasetTotal.data.push(e.count);
  });

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
