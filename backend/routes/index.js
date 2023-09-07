import { Router } from "express";
import auth from "../controller/authController.js";
import {
   authenticate,
   verifyOrganizationOwnership,
} from "../middlewares/auth.js";
import organization from "../controller/organizationController.js";
import job from "../controller/jobController.js";
const router = Router();

router.post("/api/auth/login", auth.login);

// Signup Route
router.post("/api/auth/signup", auth.register);

// Signup route
router.post("/api/auth/logout", authenticate, auth.logout);

// Create a new organization route
router.post("/api/organization/create", authenticate, organization.create);

// Create a new Job route
router.post(
   "/api/job/create",
   authenticate,
   verifyOrganizationOwnership,
   job.create
);

// View a specific job route
router.get("/api/jobs/:jobId", authenticate, job.getJobById);

// Edit a job route
router.put("/api/jobs/:id", (req, res) => {
   // Handles editing a job by ID
});

// Delete a job route
router.delete("/api/jobs/:id", (req, res) => {
   // Handles deleting a job by ID
});

// View all jobs route
router.get("/api/jobs/all", (req, res) => {
   // Handles viewing all jobs
});

// View candidates for a job route
router.get("/api/jobs/:id/candidates", (req, res) => {
   // Handles viewing candidates for a specific job by ID
});

// View details of a candidate route
router.get("/api/candidates/:id/details", (req, res) => {
   // Handles viewing details of a specific candidate by ID
});

// Update candidate status for a job route
router.put("/api/jobs/:jobId/candidates/:candidateId/status", (req, res) => {
   // Handles updating the status of a candidate for a specific job
});



export default router;
