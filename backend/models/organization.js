import mongoose from "mongoose";

const { Schema } = mongoose;

const organizationSchema = new Schema(
   {
      organizationName: {
         type: String,
         required: [true, "Organization name is required"],
         trim: true,
      },
      email: {
         type: String,
         required: [true, "Email is required"],
         unique: true,
         trim: true,
      },
      numberOfEmployees: {
         type: String,
         required: [true, "Number of employees is required"],
      },
      // firstName: {
      //    type: String,
      //    required: [true, "First name is required"],
      // },
      // lastName: {
      //    type: String,
      //    required: [true, "Last name is required"],
      // },
      phoneNumber: {
         type: String,
         required: [true, "Phone number is required"],
      },
      country: {
         type: String,
         required: [true, "Country is required"],
         default: "Pakistan",
      },
      language: {
         type: String,
         required: [true, "Language is required"],
         default: "English",
      },
      industries: {
         type: String,
         required: [true, "Company industries is required"],
      },
      description: {
         type: String,
         required: [true, "Company description is required"],
      },
      userId: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: [true, "User Id is requried"],
      },
   },
   { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);
