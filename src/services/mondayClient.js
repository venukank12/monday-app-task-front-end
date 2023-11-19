import mondaySdk from "monday-sdk-js";

const mondayClient = mondaySdk();

export const getAvailableColumns = (query) =>
  new Promise((resolve, reject) =>
    mondayClient.api(query).then(resolve).catch(reject)
  );

export const getSessionToken = () =>
  new Promise((resolve, reject) =>
    mondayClient.get("sessionToken").then(resolve).catch(reject)
  );

export default mondayClient;
