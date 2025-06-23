import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({
      success: true,
      token
    });
  } catch(error) {
    console.error("Error in getStreamToken controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}