import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
   {
      name: {
         type: String,
         trim: true,
         required: [true, "Please provide your name."],
      },
      email: {
         type: String,
         trim: true,
         required: [true, "Please provide your email address."],
      },
      password: {
         type: String,
         required: [true, "Please provide a password."],
      },
   },
   { timestamps: true }
);

export default mongoose.model("User", userSchema);
