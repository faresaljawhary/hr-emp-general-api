import generalService from "../../../services/generalApplications.js";

export const addGeneralApplication = async (req, res, next) => {
  try {
    const result = await generalService.createApplicationData(req);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const getAllGeneralApplication = async (req, res, next) => {
  try {
    res.header(
      "Access-Control-Allow-Origin",
      "https://npc-hr-general-employment.onrender.com"
    );
    const result = await generalService.getAllApplicationsData(req);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const updateDownloadValue = async (req, res, next) => {
  const { params, body } = req;
  try {
    const result = await generalService.updateDownloadValueForUser(
      params,
      body
    );
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
export const checkDuplicationUser = async (req, res, next) => {
  const { params } = req;
  try {
    const result = await generalService.checkUserDuplication(params);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
