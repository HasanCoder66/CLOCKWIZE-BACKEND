import LogModel from "../Models/LogModel.js";
import ResidentModel from "../Models/ResidentModel.js";

//====================  NEW LOG =========================//
// http://localhost:8800/api/log/
export const createLog = async (req, res, next) => {
  const residentId = req.params.residentId; // Get the resident ID from request parameters
  // console.log(req)
  const newLog = new LogModel({ ...req.body, residentId: residentId }); //createdBy: req.user.user._id
  try {
    const saveLog = await newLog.save();
    // console.log(saveLog)
    const { _id } = saveLog;

    res.status(200).send({
      status: "Successful",
      message: "New log Added Successfully",
      data: saveLog,
    });
  } catch (error) {
    next(error);
  }
};

// //UPDATE LOG
// http://localhost:8800/api/log/660b37d3da1211544662db30
export const updateLog = async (req, res, next) => {
  console.log(req.params._id);
  try {
    const updateLog = await LogModel.findByIdAndUpdate(
      req.params.logId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send({
      status: "Successful",
      message: "Log Updated Successfully",
      data: updateLog,
    });
    console.log(updateLog);
  } catch (error) {
    next(error);
  }
};

// //DELETE LOG
// http://localhost:8800/api/log/660b37d3da1211544662db30

export const deleteLog = async (req, res, next) => {
  try {
    await LogModel.findByIdAndDelete(req.params.logId);
    res.status(200).send({
      status: "Successful",
      message: "Log deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

//GET ALL RESIDENTS LOG
// http://localhost:8800/api/log/find/:residentId
// export const getResidentsLog = async (req, res, next) => {
//   try {
//     const residentId = req.params.residentId;
//     // console.log(residentId)
//     const log = await LogModel.find({ residentId: residentId });
//     // console.log(log)
//     !log &&
//       res.status(404).send({
//         status: "Failed",
//         message: "Resident Logs not found",
//       });
//     res.status(200).send({
//       status: "Successful",
//       message: "Resident Logs Found",
//       data: log,
//     });
//   } catch (error) {
//     next(error);
//   }
// };




export const getResidentsLog = async (req, res, next) => {
  try {
    const { residentId } = req.params;
    const { date } = req.query; // Get date from query parameters

    // Convert date string to a JavaScript Date object
    const queryDate = new Date(date);

    // Set the time to cover the entire day (from midnight to 11:59:59 PM)
    const startDate = new Date(queryDate);
    startDate.setUTCHours(0, 0, 0, 0); // Set time to start of day
    const endDate = new Date(queryDate);
    endDate.setUTCHours(23, 59, 59, 999); // Set time to end of day

    // Query logs for the specified residentId and createdAt date range
    const logs = await LogModel.find({
      residentId: residentId,
      createdAt: {
        $gte: startDate, // Greater than or equal to start of day
        $lte: endDate, // Less than or equal to end of day
      },
    });

    if (!logs || logs.length === 0) {
      return res.status(404).send({
        status: "Failed",
        message: "Resident logs not found for the specified date",
      });
    }

    res.status(200).send({
      status: "Success",
      message: "Resident logs found",
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
