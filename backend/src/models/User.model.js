import mongoose from 'mongoose'
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 7
    },
    bio: {
      type: String,
      default: ""
    },
    profilePic: {
      type: String,
      default: ""
    },
    nativeLanguage: {
      type: String,
      required: true
    },
    learningLanguages: [ // support multiple lang learning
      {
        code: String, // e.g. "es", "fr"
        level: { 
          type: String, 
          enum: ["beginner","intermediate","advanced","native"] 
        },
        learningSince: Date
      }
    ],
    // Matching & availability
    timeZone: {// for showing time at place to other users
      type: String 
    },        
    availability: [ // weekly availability slots
      {
        dayOfWeek:  { 
          type: String, 
          enum: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] 
        },
        from: String,
        to: String
      }
    ],
    location: {
      type: String,
      default: ""
    },
    hasCompletedProfile: {
      type: Boolean,
      default: false
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    blockedUsers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
    streak: { // daily practice streak
      count: { 
        type: Number, 
        default: 0 
      },
      lastActive: Date
    }
  }, {
    timestamps: true // createdAt, updatedAt
})

// pre-save hook - to hash user's password
userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next(); // to avoid rehashing of password when not changed
  try {
    const salt = await bcrypt.genSalt(12); // hash password 2^12 times
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch(error) {
    next(error);
  }
})

userSchema.methods.matchPassword = async function(enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
}

const User = mongoose.model("User", userSchema);

export default User;