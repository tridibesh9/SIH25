import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
// Define schema
const userSchema = new mongoose.Schema(
  {
    id: { type: String, 
        default: uuidv4, 
        required: true, 
        unique: true, 
        index: true 
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "buyer", "seller"],
      default: "buyer",
    },
    projects: {
        type: [String],
        default: [],
    },
  },
  {
    timestamps: true,
    collection: "greenHashUsers",
  }
);

// STATIC METHOD: register a new user
userSchema.statics.register = async function (name, email, password, role) {
  try {
    console.log('🔐 [USER MODEL] Starting registration validation');
    console.log('🔐 [USER MODEL] Password being validated:', password);
    console.log('🔐 [USER MODEL] Password length:', password.length);
    
    // Validate email and password
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format.");
    }
    
    // Test individual regex components
    const hasLetter = /(?=.*[A-Za-z])/.test(password);
    const hasNumber = /(?=.*\d)/.test(password);
    const hasSpecialChar = /(?=.*[!@#$%^&*+=\-_])/.test(password);
    const onlyAllowedChars = /^[A-Za-z\d!@#$%^&*+=\-_]{8,}$/.test(password);
    const fullRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=\-_])[A-Za-z\d!@#$%^&*+=\-_]{8,}$/.test(password);
    
    // console.log('🔐 [USER MODEL] Password validation breakdown:');
    // console.log('  - Has letter:', hasLetter);
    // console.log('  - Has number:', hasNumber);
    // console.log('  - Has special char [!@#$%^&*+=\-_]:', hasSpecialChar);
    // console.log('  - Only allowed chars:', onlyAllowedChars);
    // console.log('  - Full regex passes:', fullRegex);
    
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=\-_])[A-Za-z\d!@#$%^&*+=\-_]{8,}$/.test(
        password
      )
    ) {
      throw new Error(
        "Password must be at least 8 characters long and include one letter, one number, and one special character."
      );
    }

    console.log('✅ [USER MODEL] Password validation passed');

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const user = new this({
      name,
      email,
      password: hashedPassword,
      role,
      projects: [],
    });

    if (role !== "admin" && role !== "buyer" && role !== "seller") {
      throw new Error("Invalid role. Role must be either 'admin', 'seller' or 'buyer' .");
    }

    // Check if user already exists and password is not empty
    const existingUser = await this.findOne({ email });
    if (existingUser && existingUser.password) {
      throw new Error("User already exists with this email.");
    }

    const newUser = await user.save();
    return newUser;
  } catch (error) {
    throw new Error("Error registering user: " + error.message);
  }
};

// Static method to update password
userSchema.statics.updatenewPassword = async function (
  userEmail,
  oldPassword,
  newPassword
) {
  try {
    // Validate new password
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*+=\-_])[A-Za-z\d!@#$%^&*+=\-_]{8,}$/.test(
        newPassword
      )
    ) {
      throw new Error(
        "New password must be at least 8 characters long and include one letter, one number, and one special character."
      );
    }

    const user = await this.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not found.");
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect.");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    return await user.save();
  } catch (error) {
    throw new Error("Error updating password: " + error.message);
  }
};


// STATIC METHOD: get user by email
userSchema.statics.getUser = async function (email) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error.message);
  }
};

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password.");
    }

    return user;
  } catch (error) {
    throw new Error("Error logging in: " + error.message);
  }
};

// Export model
const User = mongoose.model("User", userSchema);
export default User;