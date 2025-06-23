import User from "../models/User.model.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  const {fullName,
    email,
    password,
    nativeLanguage
  } = req.body;

  try {
    if(!email || !password || !fullName || !nativeLanguage) {
      return res.status(400).json({
        message: "All fields are required."
      })
    }

    if(password.length < 7) {
      return res.status(400).json({
        message: "Password must be atleast of length 7."
      })
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Invalid email format." 
      });
    }

    const existingUser = await User.findOne({
      email
    })
    if(existingUser) {
      return res.status(400).json({ 
        message: "Email already in use." 
      });
    }

    const seed = Math.floor(Math.random() * 100000);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

    const newUser = await User.create({fullName,
      email,
      password,
      profilePic: avatarUrl,
      nativeLanguage
    })

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || ""
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch(error) {
      console.error("Error creating stream user: ", error);
    }

    const token = jwt.sign({
      userId: newUser._id
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "14d"
      }
    );

    res.cookie("jwt-token", token, {
      maxAge: 14*24*60*60*100, // in milli-seconds
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", // prevent CSRF attack
      secure: process.env.NODE_ENV === "production", // secure in production
    })

    res.status(201).json({
      success: true,
      user: newUser
    }) // resource created in db

  } catch(error) {
    console.error("Error in signup controller", error);
    res.status(500).json({ 
      message: "Internal Server Error"
    }); 
  }
}

export const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if(!email || !password) {
      return res.status(400).json({
        message:"All fields are required."
      })
    };

    // validate user
    const user = await User.findOne({
      email
    })
    if(!user) 
      return res.status(401).json({
        message:"Invalid email or password."
      })

    const isPasswordCorrect = await user.matchPassword(password);
    if(!isPasswordCorrect)
        return res.status(401).json({
        message:"Invalid email or password."
      })

    const token = jwt.sign({
      userId: user._id
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "14d"
      }
    );

    res.cookie("jwt-token", token, {
      maxAge: 14*24*60*60*100, // in milli-seconds
      httpOnly: true, // prevent XSS attack
      sameSite: "strict", // prevent CSRF attack
      secure: process.env.NODE_ENV === "production", // secure in production
    })

    res.status(200).json({
      success: true,
      user: user
    });
  } catch(error) {
    console.error("Error in login controller", error)
    res.status(500).json({ 
      message: "Internal Server Error"
    }) 
  }
}

export const logout = (req, res) => {
  res.clearCookie("jwt-token");
  res.status(200).json({
      success: true,
      message: "Logout successful"
  });
}

export const bio = async (req, res) => {
  try {
    const userID = req.user._id;
    // Add profile pic here?
    const {fullName, bio, nativeLanguage, learningLanguages, timeZone, availability, location, profilePic} = req.body;

    if(!fullName || !bio || !nativeLanguage || (!Array.isArray(learningLanguages) || learningLanguages.length === 0) || !timeZone || (!Array.isArray(availability) || availability.length === 0) || !location) {
      return res.status(400).json({
        message: "All fields are required.",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          (!Array.isArray(learningLanguages) || learningLanguages.length === 0) && "learningLanguages",
          !timeZone && "timeZone",
          (!Array.isArray(availability) || availability.length === 0) && "availability",
          !location && "location"
        ].filter(Boolean)
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userID, {
      ...req.body,
      profilePic: profilePic || req.user.profilePic, // use existing profile pic if not provided
      hasCompletedProfile: true
    }, {new: true});

    if(!updatedUser) 
      return res.status(404).json({
        message: "User not found - please try again"
    });


    // updating data in stream
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || ""
      })
      console.log(`Stream user updated for ${updatedUser.fullName}`);
    } catch(streamError) {
      console.error("Stream error while completing profile: ", streamError.message);
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch(error) {
    console.error("Error in completing profile: ", error);
    res.status(500).json({ 
      message: "Internal Server Error"
    });
  }
}

export const me = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
}