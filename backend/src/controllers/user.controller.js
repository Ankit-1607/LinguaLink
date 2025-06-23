import FriendRequest from "../models/FriendRequest.model.js";
import User from "../models/User.model.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const thisUserID = req.user.id;
    const thisUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: thisUserID } }, // exclude self
        { _id: { $nin: thisUser.friends } }, // exclude friends
        { _id: { $nin: thisUser.blockedUsers } }, // exclude blocked
        { hasCompletedProfile: true }, // only complete profiles
        // {
        //   $or: [
        //     { nativeLanguage: { $in: learningLanguageCodes } },
        //     { 'learningLanguages.code': nativeLanguage }
        //   ]
        // }
      ]
    });

    res.status(200).json({
      success: true,
      recommendedUsers
    })
  } catch(error) {
    console.error("Error in getRecommended controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const getMyFriends = async (req, res) => {
  try {
    const thisUserID = req.user.id;

    const user = await User.findById(thisUserID).select('friends')
      .populate("friends", "fullName profilePic nativeLanguage learningLanguages");

    res.status(200).json({
      success: true,
      friends: user.friends
    });
  } catch(error) {
    console.error("Error in getMyFriends controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const sendFriendRequest = async (req, res) => {
  try {
    const thisUserID = req.user.id;
    const recipientID = req.params.id;

    // prevent sending request to self
    if (thisUserID === recipientID) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself"
      });
    }
    // check if recipient exists
    const recipient = await User.findById(recipientID);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found"
      });
    }
    // check if already friends
    if(recipient.friends.includes(thisUserID)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user"
      });
    }
    // check if already sent a request
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: thisUserID, recipient: recipientID },
        { sender: recipientID, recipient: thisUserID }
      ]
    })
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists"
      });
    }

    // create new friend request
    const newRequest = await FriendRequest.create({
      sender: thisUserID,
      recipient: recipientID
    });
    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      request: newRequest
    });
  } catch(error) {
    console.error("Error in sendFriendRequest controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const thisUserID = req.user.id;
    const requestID = req.params.id;

    // find the request
    const request = await FriendRequest.findById(requestID);
    if(!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found"
      });
    }

    // check if this user is the recipient
    if(request.recipient.toString() !== thisUserID) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request"
      });
    }

    request.status = "accepted";
    await request.save();

    // add each other as friends 
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: {friends: request.recipient},
    });

    await User.findByIdAndUpdate(request.recipient, {
      $addToSet: {friends: request.sender},
    });

    res.status(200).json({
      success: true,
      message: "Friend request aceepted successfully."
    })
  } catch(error) {
    console.error("Error in acceptFriendRequest controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const rejectFriendRequest = async (req, res) => {
  try {
    const thisUserID = req.user.id;
    const requestID = req.params.id;

    const request = await FriendRequest.findById(requestID);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found"
      });
    }

    // Only recipient can reject
    if (request.recipient.toString() !== thisUserID) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this request"
      });
    }

    // Update status to rejected
    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Friend request rejected successfully"
    });
  } catch (error) {
    console.error("Error in rejectFriendRequest controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const cancelFriendRequest = async (req, res) => {
  try {
    const thisUserID = req.user.id;
    const requestID = req.params.id;

    // Find the request
    const request = await FriendRequest.findById(requestID);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found"
      });
    }

    // Only sender can cancel
    if (request.sender.toString() !== thisUserID) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this request"
      });
    }

    // Delete the request from the database
    await FriendRequest.findByIdAndDelete(requestID);

    res.status(200).json({
      success: true,
      message: "Friend request cancelled and deleted successfully"
    });
  } catch (error) {
    console.error("Error in cancelFriendRequest controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const getFriendRequests = async (req, res) => {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending"
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguages");

    const sentRequests = await FriendRequest.find({
      sender: req.user.id,
      // status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({
      success: true,
      incomingRequests,
      sentRequests
    });
  } catch(error) {
    console.error("Error in getFriendRequests controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending"
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguages");

    res.status(200).json({
      success: true,
      outgoingRequests
    });
  } catch(error) {
    console.error("Error in getOutgoingFriendRequests controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}