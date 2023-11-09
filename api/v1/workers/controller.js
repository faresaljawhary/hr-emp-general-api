import workersService from "../../../services/workersApplication.js";

export const addWorkerApplication = async (req, res, next) => {
  try {
    const result = await workersService.insertApplicationData(req);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const getAllWorkersApplications = async (req, res, next) => {
  try {
    const result = await workersService.getAllApplicationsData(req);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const changePriorityWorker = async (req, res, next) => {
  const { params, body } = req;
  try {
    const result = await workersService.updatePriorityWorker(params, body);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const getAllWorkersEmployees = async (req, res, next) => {
  try {
    const result = await workersService.getAllEmployeesData(req);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const changeStatusWorker = async (req, res, next) => {
  const { params, body } = req;
  try {
    const result = await workersService.updateStatusWorker(params, body);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
