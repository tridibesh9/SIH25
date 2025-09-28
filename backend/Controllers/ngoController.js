import NGO from "../models/Ngo.js";

// POST /ngos - Create a new NGO
export const createNgo = async (req, res) => {
  try {
    const { name, location, volunteer_count } = req.body;

    // Validation
    if (!name || !location || volunteer_count === undefined) {
      return res.status(400).json({
        message: "Name, location, and volunteer count are required."
      });
    }

    const newNgo = new NGO({
      name,
      location,
      volunteer_count,
    });

    const savedNgo = await newNgo.save();

    res.status(201).json({
      message: "NGO created successfully.",
      ngo: savedNgo,
    });
  } catch (error) {
    console.error("Error creating NGO:", error);
    res.status(500).json({
      message: "Server error while creating NGO.",
      error: error.message,
    });
  }
};

// GET /ngos - Retrieve all NGOs
export const getAllNgos = async (req, res) => {
  try {
    const ngos = await NGO.find({});
    res.status(200).json({
      ngos,
    });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({
      message: "Server error while fetching NGOs.",
      error: error.message,
    });
  }
};

// GET /ngos/:id - Get details of a single NGO
export const getNgoById = async (req, res) => {
  try {
    const ngoId = req.params.id;
    const ngo = await NGO.findById(ngoId);

    if (!ngo) {
      return res.status(404).json({
        message: "NGO not found."
      });
    }

    res.status(200).json({
      ngo,
    });
  } catch (error) {
    console.error("Error fetching NGO:", error);
    res.status(500).json({
      message: "Server error while fetching NGO.",
      error: error.message,
    });
  }
};

// PATCH /ngos/:id - Update an NGO's details
export const updateNgo = async (req, res) => {
  try {
    const ngoId = req.params.id;
    const updateData = req.body;

    // Remove fields that should not be updated
    delete updateData._id;
    delete updateData.__v;

    const updatedNgo = await NGO.findByIdAndUpdate(
      ngoId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNgo) {
      return res.status(404).json({
        message: "NGO not found."
      });
    }

    res.status(200).json({
      message: "NGO updated successfully.",
      ngo: updatedNgo,
    });
  } catch (error) {
    console.error("Error updating NGO:", error);
    res.status(500).json({
      message: "Server error while updating NGO.",
      error: error.message,
    });
  }
};