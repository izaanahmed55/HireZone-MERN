import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
   {
      jobTitle: {
         type: String,
         required: [true, "Please provide the job title."],
      },
      location: {
         type: String,
         required: [true, "Please provide the job location."],
      },
      jobType: {
         type: String,
         enum: [
            "Full-time",
            "Part-time",
            "Temporary",
            "Contract",
            "Internship",
            "Commission",
         ],
         required: [true, "Please provide the job type."],
      },
      numberOfPositions: {
         type: Number,
         required: [
            true,
            "Please specify the number of positions for this job.",
         ],
      },
      salaryRangeEnabled: {
         type: Boolean,
         required: [
            true,
            "Please specify whether the salary range is enabled.",
         ],
      },
      salaryRange: {
         min: {
            type: Number,
            required: function () {
               return this.salaryRangeEnabled;
            },
         },
         max: {
            type: Number,
            required: function () {
               return this.salaryRangeEnabled;
            },
         },
      },
      salary: {
         type: Number,
         required: false,
      },
      jobDescription: {
         type: String,
         required: [true, "Please provide the job description."],
      },
      organizationId: {
         type: Schema.Types.ObjectId,
         ref: "Organization",
         required: [true, "Please provide the organization ID."],
      },
   },
   { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
