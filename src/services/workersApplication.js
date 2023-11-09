import sql from "mssql";
import config from "./../config/index.js";
import imageService from "./imageService.js";

async function insertApplicationData(req) {
  const { labels, finalFormData } = req.body;
  const arrayOfObjects = Array.isArray(labels)
    ? labels.map(JSON.parse)
    : [JSON.parse(JSON.stringify(labels))];
  const formDataObj = JSON.parse(finalFormData);
  console.log("arrayOfObjects", arrayOfObjects);
  let connection;
  try {
    connection = await sql.connect(config.db);
    const request = new sql.Request(connection);

    await request
      .input("Full_Name", sql.NVarChar, formDataObj.Full_Name)
      .input("Gender", sql.NVarChar, formDataObj.Gender)
      .input("Address_City", sql.NVarChar, formDataObj.Address_City)
      .input("Address_Street", sql.NVarChar, formDataObj.Address_Street)
      .input("Address_Region", sql.NVarChar, formDataObj.Address_Region)
      .input("Address_BuildingNo", sql.NVarChar, formDataObj.Address_BuildingNo)
      .input("Address_Phone1", sql.NVarChar, formDataObj.Address_Phone1)
      .input("Address_Phone2", sql.NVarChar, formDataObj.Address_Phone2)
      .input("Demand_Position", sql.NVarChar, formDataObj.Demand_Position)
      .input("Work_Place", sql.NVarChar, formDataObj.Work_Place)
      .input("Birth_Date", sql.Date, formDataObj.Birth_Date)
      .input("Birth_Place", sql.NVarChar, formDataObj.Birth_Place)
      .input("Nationality", sql.NVarChar, formDataObj.Nationality)
      .input("Mother_Name", sql.NVarChar, formDataObj.Mother_Name)
      .input("Relegin", sql.NVarChar, formDataObj.Relegin)
      .input(
        "National_Num",
        sql.NVarChar,
        formDataObj.National_Num === null ? null : formDataObj.National_Num
      )
      .input(
        "Passport_Num",
        sql.NVarChar,
        formDataObj.Passport_Num === null ? null : formDataObj.Passport_Num
      )
      .input(
        "IDentity_Num",
        sql.NVarChar,
        formDataObj.IDentity_Num === null ? null : formDataObj.IDentity_Num
      )
      .input("Marriage_Status", sql.NVarChar, formDataObj.Marriage_Status)
      .input("Marriage_Date", sql.Date, formDataObj.Marriage_Date)
      .input("Chlidren_Num", sql.Int, formDataObj.Chlidren_Num)
      .input("Description", sql.NVarChar, formDataObj.Description)
      .input("Priority", sql.NVarChar, formDataObj.Priority)
      .input("Status", sql.NVarChar, formDataObj.Status).query(`
        INSERT INTO Application_WorkerForm (Full_Name, Gender, Address_City, Address_Street, Address_Region, Address_BuildingNo, Address_Phone1, Demand_Position, Work_Place, Birth_Date, Birth_Place, Nationality, Mother_Name, Relegin, National_Num, Passport_Num, IDentity_Num, Marriage_Status, Marriage_Date, Chlidren_Num, [Description],Priority,Status,Address_Phone2)
        VALUES (@Full_Name, @Gender, @Address_City, @Address_Street, @Address_Region, @Address_BuildingNo, @Address_Phone1, @Demand_Position, @Work_Place, @Birth_Date, @Birth_Place, @Nationality, @Mother_Name, @Relegin, @National_Num, @Passport_Num, @IDentity_Num, @Marriage_Status, @Marriage_Date, @Chlidren_Num, @Description,@Priority,@Status,@Address_Phone2)
      `);

    const insertedRecord = await selectInsertedRecord(
      formDataObj.Full_Name,
      connection,
      formDataObj
    );
    console.log("arrayOfObjects", arrayOfObjects);
    if (insertedRecord) {
      await imageService.insertImagesData(arrayOfObjects, insertedRecord.ID);
      return {
        statusCode: 200,
        message: "Data inserted successfully",
        record: insertedRecord,
      };
    } else {
      return {
        statusCode: 500,
        message: "Error when Insert to DB",
      };
    }
  } catch (err) {
    if (err.number === 2601) {
      return {
        statusCode: 400,
        message: "Duplicate record found",
      };
    } else {
      console.error("Error:", err);
      return {
        statusCode: 500,
        message: "Error during database operations",
      };
    }
  } finally {
    if (connection) {
      connection.close();
    }
  }
}

async function selectInsertedRecord(fullName, connection, formDataObj) {
  try {
    const selectRequest = new sql.Request(connection);

    const result = await selectRequest
      .input("Full_Name", sql.NVarChar, fullName)
      .input("National_Num", sql.NVarChar, formDataObj.National_Num)
      .input("Passport_Num", sql.NVarChar, formDataObj.Passport_Num).query(`
        SELECT *
        FROM Application_WorkerForm
        WHERE Full_Name = @Full_Name
        AND (National_Num = @National_Num OR Passport_Num = @Passport_Num)
      `);

    if (result?.recordset?.length > 0) {
      console.log("Selected record:", result?.recordset[0]);
      return result?.recordset[0];
    }

    return null;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
async function getAllApplicationsData(req) {
  const { query } = req;
  const {
    pageNumber,
    recordsPerPage,
    Gender,
    Address_City,
    Work_Place,
    Nationality,
    Demand_Position,
    Marriage_Status,
    Search_Query,
    Priority,
  } = query;

  let connection;

  try {
    connection = await sql.connect(config.db);
    const request = new sql.Request(connection);

    let query = `
      SELECT *
      FROM Application_WorkerForm
      `;

    const params = [];

    if (Gender) {
      query += `WHERE Gender = @Gender`;
      params.push({ name: "Gender", type: sql.VarChar, value: Gender });
    }

    if (Address_City) {
      if (params.length > 0) {
        query += ` AND Address_City = @Address_City`;
      } else {
        query += `WHERE Address_City = @Address_City`;
      }
      params.push({
        name: "Address_City",
        type: sql.NVarChar,
        value: Address_City,
      });
    }
    if (Priority) {
      if (params.length > 0) {
        query += ` AND Priority = @Priority`;
      } else {
        query += `WHERE Priority = @Priority`;
      }
      params.push({
        name: "Priority",
        type: sql.NVarChar,
        value: Priority,
      });
    }
    if (Work_Place) {
      if (params.length > 0) {
        query += ` AND Work_Place = @Work_Place`;
      } else {
        query += `WHERE Work_Place = @Work_Place`;
      }
      params.push({
        name: "Work_Place",
        type: sql.NVarChar,
        value: Work_Place,
      });
    }
    if (Nationality) {
      if (params.length > 0) {
        query += ` AND Nationality = @Nationality`;
      } else {
        query += `WHERE Nationality = @Nationality`;
      }
      params.push({
        name: "Nationality",
        type: sql.NVarChar,
        value: Nationality,
      });
    }
    if (Demand_Position) {
      if (params.length > 0) {
        query += ` AND Demand_Position = @Demand_Position`;
      } else {
        query += `WHERE Demand_Position = @Demand_Position`;
      }
      params.push({
        name: "Demand_Position",
        type: sql.NVarChar,
        value: Demand_Position,
      });
    }
    if (Marriage_Status) {
      if (params.length > 0) {
        query += ` AND Marriage_Status = @Marriage_Status`;
      } else {
        query += `WHERE Marriage_Status = @Marriage_Status`;
      }
      params.push({
        name: "Marriage_Status",
        type: sql.NVarChar,
        value: Marriage_Status,
      });
    }
    if (Search_Query) {
      if (params.length > 0) {
        query += ` AND (Passport_Num LIKE @Search_Query OR National_Num LIKE @Search_Query OR Full_Name LIKE @Search_Query OR IDentity_Num LIKE @Search_Query)`;
      } else {
        query += `WHERE (Passport_Num LIKE @Search_Query OR National_Num LIKE @Search_Query OR Full_Name LIKE @Search_Query OR IDentity_Num LIKE @Search_Query)`;
      }
      params.push({
        name: "Search_Query",
        type: sql.NVarChar,
        value: `%${Search_Query}%`,
      });
    }
    if (true) {
      if (params.length > 0) {
        query += ` AND Status = @Status`;
      } else {
        query += `WHERE Status = @Status`;
      }
      params.push({
        name: "Status",
        type: sql.VarChar,
        value: "available",
      });
    }

    if (pageNumber && recordsPerPage) {
      query += `
      ORDER BY ID DESC
      OFFSET ${(pageNumber - 1) * recordsPerPage} ROWS
      FETCH NEXT ${recordsPerPage} ROWS ONLY;
      `;
    } else {
      query += `
      ORDER BY ID DESC;
      `;
    }

    params.forEach((param) => {
      request.input(param.name, param.type, param.value);
    });

    const selectedRecords = await request.query(query);

    const countQuery = `
        SELECT COUNT(*) AS totalRecords
        FROM Application_WorkerForm
        WHERE Status IN ('available');
    `;

    const countResult = await request.query(countQuery);
    const totalRecords = countResult.recordset[0].totalRecords;

    return {
      statusCode: 200,
      message: "Success",
      records: selectedRecords.recordsets[0],
      totalCount: totalRecords,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Error during Select",
    };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
async function updatePriorityWorker(params, body) {
  const { userId } = params;
  const { priority } = body;

  let connection;
  try {
    connection = await sql.connect(config.db);

    const request = new sql.Request(connection);

    const result = await request
      .input("Priority", sql.Char, priority)
      .input("ID", sql.Int, userId).query(`
        UPDATE Application_WorkerForm
        SET Priority = @Priority
        WHERE ID = @ID;
      `);

    if (result.rowsAffected[0] > 0) {
      return {
        statusCode: 200,
        message: "Success",
      };
    } else {
      return {
        statusCode: 500,
        message: "Record not found or no updates were made.",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
async function getAllEmployeesData(req) {
  const { query } = req;
  const {
    pageNumber,
    recordsPerPage,
    Gender,
    Address_City,
    Work_Place,
    Nationality,
    Demand_Position,
    Marriage_Status,
    Search_Query,
    Status,
  } = query;

  let connection;

  try {
    connection = await sql.connect(config.db);
    const request = new sql.Request(connection);

    let query = `
      SELECT *
      FROM Application_WorkerForm
      `;

    const params = [];

    if (Gender) {
      query += `WHERE Gender = @Gender`;
      params.push({ name: "Gender", type: sql.VarChar, value: Gender });
    }

    if (Address_City) {
      if (params.length > 0) {
        query += ` AND Address_City = @Address_City`;
      } else {
        query += `WHERE Address_City = @Address_City`;
      }
      params.push({
        name: "Address_City",
        type: sql.NVarChar,
        value: Address_City,
      });
    }
    if (Status) {
      if (params.length > 0) {
        query += ` AND Status = @Status`;
      } else {
        query += `WHERE Status = @Status`;
      }
      params.push({
        name: "Status",
        type: sql.NVarChar,
        value: Status,
      });
    }
    if (Work_Place) {
      if (params.length > 0) {
        query += ` AND Work_Place = @Work_Place`;
      } else {
        query += `WHERE Work_Place = @Work_Place`;
      }
      params.push({
        name: "Work_Place",
        type: sql.NVarChar,
        value: Work_Place,
      });
    }
    if (Nationality) {
      if (params.length > 0) {
        query += ` AND Nationality = @Nationality`;
      } else {
        query += `WHERE Nationality = @Nationality`;
      }
      params.push({
        name: "Nationality",
        type: sql.NVarChar,
        value: Nationality,
      });
    }
    if (Demand_Position) {
      if (params.length > 0) {
        query += ` AND Demand_Position = @Demand_Position`;
      } else {
        query += `WHERE Demand_Position = @Demand_Position`;
      }
      params.push({
        name: "Demand_Position",
        type: sql.NVarChar,
        value: Demand_Position,
      });
    }
    if (Marriage_Status) {
      if (params.length > 0) {
        query += ` AND Marriage_Status = @Marriage_Status`;
      } else {
        query += `WHERE Marriage_Status = @Marriage_Status`;
      }
      params.push({
        name: "Marriage_Status",
        type: sql.NVarChar,
        value: Marriage_Status,
      });
    }
    if (Search_Query) {
      if (params.length > 0) {
        query += ` AND (Passport_Num LIKE @Search_Query OR National_Num LIKE @Search_Query OR Full_Name LIKE @Search_Query)`;
      } else {
        query += `WHERE (Passport_Num LIKE @Search_Query OR National_Num LIKE @Search_Query OR Full_Name LIKE @Search_Query)`;
      }
      params.push({
        name: "Search_Query",
        type: sql.NVarChar,
        value: `%${Search_Query}%`,
      });
    }
    if (true) {
      const allowedStatuses = ["employee", "resigned"];

      if (params.length > 0) {
        query += ` AND Status IN (${allowedStatuses
          .map((_, i) => `@Status${i}`)
          .join(", ")})`;
      } else {
        query += `WHERE Status IN (${allowedStatuses
          .map((_, i) => `@Status${i}`)
          .join(", ")})`;
      }

      allowedStatuses.forEach((status, i) => {
        params.push({
          name: `Status${i}`,
          type: sql.NVarChar,
          value: status,
        });
      });
    }

    if (pageNumber && recordsPerPage) {
      query += `
      ORDER BY Status
      OFFSET ${(pageNumber - 1) * recordsPerPage} ROWS
      FETCH NEXT ${recordsPerPage} ROWS ONLY;
      `;
    } else {
      query += `
      ORDER BY Status ;
      `;
    }

    params.forEach((param) => {
      request.input(param.name, param.type, param.value);
    });

    const selectedRecords = await request.query(query);

    const countQuery = `
      SELECT COUNT(*) AS totalRecords
      FROM Application_WorkerForm
      WHERE Status IN ('employee', 'resigned');
    `;

    const countResult = await request.query(countQuery);
    const totalRecords = countResult.recordset[0].totalRecords;

    return {
      statusCode: 200,
      message: "Success",
      records: selectedRecords.recordsets[0],
      totalCount: totalRecords,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Error during Select",
    };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
async function updateStatusWorker(params, body) {
  const { userId } = params;
  const { status, startDate, endDate, reason, resignationNote } = body;

  let connection;
  try {
    connection = await sql.connect(config.db);

    const request = new sql.Request(connection);
    let result;
    if (status && startDate) {
      result = await request
        .input("Status", sql.VarChar, status)
        .input("Start_Date", sql.Date, startDate)
        .input("ID", sql.Int, userId).query(`
        UPDATE Application_WorkerForm
        SET Status = @Status, Start_Date = @Start_Date
        WHERE ID = @ID;
      `);
    } else if (status && endDate && reason) {
      result = await request
        .input("Status", sql.VarChar, status)
        .input("End_Date", sql.Date, endDate)
        .input("Reason", sql.NVarChar, reason)
        .input("Resignation_Note", sql.NVarChar, resignationNote || null)
        .input("ID", sql.Int, userId).query(`
        UPDATE Application_WorkerForm
        SET Status = @Status, End_Date = @End_Date,Reason=@Reason,Resignation_Note=@Resignation_Note
        WHERE ID = @ID;
      `);
    }
    if (result.rowsAffected[0] > 0) {
      return {
        statusCode: 200,
        message: "Success",
      };
    } else {
      return {
        statusCode: 500,
        message: "Record not found or no updates were made.",
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  } finally {
    if (connection) {
      connection.close();
    }
  }
}
export default {
  insertApplicationData,
  getAllApplicationsData,
  updatePriorityWorker,
  getAllEmployeesData,
  updateStatusWorker,
};
