import PerfectDayModel from "../Models/PerfectDayModel.js";

// PERFECT DAY CREATION CONTROLLER
// http://localhost:8000/api/perfectDay/RESIDENTID/LOGINID
export const createPerfectDay = async (req, res, next) => {
  try {
    const residentId = req.params.residentId;
    const loginId = req.params.loginId;

    const perfectDay = new PerfectDayModel({
      ...req.body,
      residentId,
      loginId,
    });

    const savePerfectDays = await perfectDay.save();
    console.log(savePerfectDays);
    res.status(200).json({
      message: "Perfect Day Created Successfully",
      data: savePerfectDays,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PERFECT DAY API CONTROLLER
// http://localhost:8000/api/perfectDay/perfectDayid
export const updatePerfectDay = async (req, res, next) => {
  try {
    const updatePerfectDay = await PerfectDayModel.findByIdAndUpdate(
      req.params.perfectDayId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      status: "Successful",
      message: "Perfect Day Updated Successfully",
      data: updatePerfectDay,
    });
  } catch (error) {
    next(error);
  }
};

// GET PERFECT DAY
// http://localhost:8000/api/perfectDay/find/6638efdc36a4cfbacfad1a44
export const getPerfectDay = async (req, res, next) => {
  try {
    const getPerfectDay = await PerfectDayModel.findById(
      req.params.perfectDayId
    );
    res.status(200).json({
      status: "successful",
      message: "Perfect Day found Successfully",
      data: getPerfectDay,
    });
  } catch (error) {
    next(error);
  }
};



// DELETE PERFECT DAY
// http://localhost:8000/api/perfectDay/delete/perfectdayId
export const deletePerfectDay = async (req, res, next) => {
  try {
    const deletePerfectDay = await PerfectDayModel.findByIdAndDelete(
      req.params.perfectDayId
    );
    res.status(200).json({
      status: "successful",
      message: "Perfect Day Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PERFECT DAY
// http://localhost:8000/api/perfectDay/find
export const getAllPerfectDay = async (req, res, next) => {
  try {
    const { residentId } = req.params;
    const { date } = req.query; // Get date from query parameters

    const queryDate = new Date(date);

    // Set the time to cover the entire day (from midnight to 11:59:59 PM)
    const startDate = new Date(queryDate);
    startDate.setUTCHours(0, 0, 0, 0); // Set time to start of day
    const endDate = new Date(queryDate);
    endDate.setUTCHours(23, 59, 59, 999); // Set time to end of day

    const allPerfectDays = await PerfectDayModel.find({
      residentId: req.params.residentId, createdAt: {
        $gte: startDate, // Greater than or equal to start of day
        $lte: endDate, // Less than or equal to end of day
      },
    })
    if (!allPerfectDays || allPerfectDays.length === 0) {
      return res.status(404).send({
        status: "Failed",
        message: "Resident perfect day not found for the specified date",
      });
    }
    res.status(200).send({
      status: "Successful",
      message: "Perfect Day Found",
      data: allPerfectDays,
    });
  } catch (error) {
    next(error)
  }
}