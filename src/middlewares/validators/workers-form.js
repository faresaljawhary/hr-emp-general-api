import { celebrate, Joi } from "celebrate";

const workerFormValidation = celebrate(
  {
    body: Joi.object().keys({
      Full_Name: Joi.string().required(),
      Gender: Joi.string().required(),
      Address_City: Joi.string().required(),
      Address_Street: Joi.string().required(),
      Address_Region: Joi.string().required(),
      Address_BuildingNo: Joi.string().required(),
      Address_Phone1: Joi.string().required(),
      Address_Phone2: Joi.string().required(),
      Demand_Position: Joi.string().required(),
      Work_Place: Joi.string().required(),
      Birth_Date: Joi.date().required(),
      Birth_Place: Joi.string().required(),
      Nationality: Joi.string().required(),
      Mother_Name: Joi.string().required(),
      Relegin: Joi.string().required(),
      National_Num: Joi.string().allow("").optional(),
      Passport_Num: Joi.string().allow("").optional(),
      IDentity_Num: Joi.string().allow("").optional(),
      Marriage_Status: Joi.string().required(),
      Marriage_Date: Joi.string().allow("").optional(),
      Chlidren_Num: Joi.number().allow("").optional(),
      Description: Joi.string().allow("").optional(),
    }),
  },
  {
    abortEarly: false,
  },
  { mode: "full" }
);

export default workerFormValidation;
