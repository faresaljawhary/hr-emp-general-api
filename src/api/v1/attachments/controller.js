import imageService from "../../../services/imageService.js";

export const getAttachmentsByUserId = async (req, res, next) => {
  const { params } = req;

  try {
    const result = await imageService.selectImagesDataByUserId(params);
    res.status(result.statusCode).send(result);
  } catch (err) {
    return next(err);
  }
};
