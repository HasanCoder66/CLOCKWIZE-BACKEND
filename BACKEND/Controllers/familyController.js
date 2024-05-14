// import FamilyModel from "../Models/FamilyModel.js";
import Family from "../Models/FamilyModel.js";
import Resident from "../Models/ResidentModel.js";

//====================  NEW FAMILY =========================//
// http://localhost:8800/api/family/

export const createFamilyMember = async (req, res, next) => {
  try {
    const residentId = req.params.residentId; // Get the resident ID from request parameters

    // Create a new Family object with the resident ID from the request parameters
    const newFamily = new Family({
      ...req.body,
      residentId: residentId, // Set the residentId property of the Family object
    });

    // Save the new family member to the database
    const saveFamily = await newFamily.save();
    // console.log(saveFamily)

    res.status(200).send({
      status: "Successful",
      message: "Family Added Successfully",
      data: saveFamily,
    });
  } catch (error) {
    next(error);
  }
};

// //UPDATE FAMILY
// http://localhost:8800/api/family/660b37d3da1211544662db30
export const updateFamilyMember = async (req, res, next) => {
  try {
    const updateFamily = await Family.findByIdAndUpdate(
      req.params.familyId,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send({
      status: "Successful",
      message: "Family Member Updated Successfully",
      data: updateFamily,
    });
  } catch (error) {
    next(error);
  }
};

// //DELETE FAMILY
// http://localhost:8800/api/family/660b37d3da1211544662db30

export const deleteFamilyMember = async (req, res, next) => {
  try {
    await Family.findByIdAndDelete(req.params.familyId);
    res.status(200).send({
      status: "Successful",
      message: "Family Member deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

// //GET FAMILY
// http://localhost:8800/api/family/find/660b413793cbd11706eb9a32

export const getFamilyMember = async (req, res, next) => {
  try {
    const family = await Family.find({ residentId: req.params.residentId });
    !family &&
      res.status(404).send({
        status: "Failed",
        message: "Family Member not found",
      });
    res.status(200).send({
      status: "Successful",
      message: "Family Member Found",
      data: family,
    });
  } catch (error) {
    next(error);
  }
};
