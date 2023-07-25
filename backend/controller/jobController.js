import Job from "../models/job.js";

const create = async (req, res, next) => {
   try {
      const job = await Job.create(req.body);

      return res.status(201).json({ success: true, data: job });
   } catch (error) {
      return next(error);
   }
};

const update = async (req, res, next) => {
   try {
      const job = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
         new: true,
      });

      if (!job) {
         const error = new Error("Job not found");
         error.status = 404;
         return next(error);
      }

      res.status(200).json({ success: true, data: job });
   } catch (error) {
      next(error);
   }
};

const remove = async (req, res, next) => {
   try {
      const job = await Job.findByIdAndDelete(req.params.id);

      if (!job) {
         const error = new Error("Job not found");
         error.status = 404;
         return next(error);
      }

      res.status(200).json({ success: true, data: job });
   } catch (error) {
      next(error);
   }
};

const getJobById = (req, res, next) => {
   try {
      const { jobId } = req.params;
      const job = Job.findById(jobId);
      if (!job) {
         const error = new Error("Job not found");
         error.status = 404;
         return next(error);
      }
   } catch (error) {
      next(error);
   }
};

export default { create, update, remove, getJobById };
