import sql from "mssql";
import config from "./../config/index.js";

async function insertImagesData(imagesArray, id) {
  console.log("imagesArray", imagesArray);
  const convertToArray = JSON.parse(imagesArray);
  console.log("convertToArray", convertToArray);
  try {
    // Connect to the SQL Server database
    const pool = await sql.connect(config.db);

    for (const labelData of convertToArray) {
      for (const imageName of labelData?.images) {
        const request = new sql.Request(pool);

        // Construct the SQL query with embedded parameter values
        const query = `
          INSERT INTO Application_WorkerForm_Attachments (App_WorkerForm_ID, Document_Type, Document_FullName)
          VALUES (${id}, '${labelData.label}', '${imageName}')
        `;
        await request.query(query);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the connection when done
    sql.close();
  }
}
async function selectImagesDataByUserId(params) {
  const { userId } = params;

  try {
    const pool = await sql.connect(config.db);
    const request = new sql.Request(pool);
    const query = `
            SELECT *
            FROM Application_WorkerForm_Attachments
            WHERE Application_WorkerForm_Attachments.App_WorkerForm_ID = ${userId}
        `;
    const result = await request.query(query);

    return {
      statusCode: 200,
      message: "Data selected successfully",
      records: result.recordset,
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      message: "Error selecting data",
      error: err.message,
    };
  } finally {
    sql.close();
  }
}
export default {
  insertImagesData,
  selectImagesDataByUserId,
};
