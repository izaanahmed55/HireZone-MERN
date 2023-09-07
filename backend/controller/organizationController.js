import Organization from "../models/organization.js";

const create = async (req, res, next) => {
   const {
      organizationName,
      email,
      numberOfEmployees,
      phoneNumber,
      country,
      language,
      description,
      userId,
   } = req.body;

   if (req.user._id == req.body.userId) {
      try {
         const organization = await Organization.create({
            organizationName,
            email,
            numberOfEmployees,
            phoneNumber,
            country,
            language,
            description,
            userId,
         });

         return res.status(201).json({ success: true, data: organization });
      } catch (error) {
         return next(error);
      }
   } else {
      const error = {
         status: 401,
         message: "Unauthorized",
      };

      return next(error);
   }
};

const update = async (req, res, next) => {
   try {
      const organization = await Organization.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true }
      );

      if (!organization) {
         const error = new Error("Organization not found");
         error.status = 404;
         return next(error);
      }

      res.status(200).json({ success: true, data: organization });
   } catch (error) {
      next(error);
   }
};

const remove = async (req, res, next) => {
   try {
      const organization = await Organization.findByIdAndDelete(req.params.id);

      if (!organization) {
         const error = new Error("Organization not found");
         error.status = 404;
         return next(error);
      }

      res.status(200).json({ success: true, data: organization });
   } catch (error) {
      next(error);
   }
};

export default { create, update, remove };
