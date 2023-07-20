import JWTService from "../services/JWTService.js";
import User from "../models/user.js";
import UserDTO from "../dto/user.js";
import Organization from "../models/organization.js";

const authenticate = async (req, res, next) => {
   try {
      // 1. refresh, access token validation
      const { refreshToken, accessToken } = req.cookies;
      console.log(refreshToken);
      if (!refreshToken || !accessToken) {
         const error = {
            status: 401,
            message: "Unauthorized",
         };

         return next(error);
      }

      let _id;

      try {
         _id = JWTService.verifyAccessToken(accessToken)._id;
      } catch (error) {
         return next(error);
      }

      let user;

      try {
         user = await User.findOne({ _id: _id });
      } catch (error) {
         return next(error);
      }

      const userDto = new UserDTO(user);

      req.user = userDto;

      next();
   } catch (error) {
      return next(error);
   }
};

const verifyOrganizationOwnership = async (req, res, next) => {
   try {
      const { organizationId } = req.params;
      const { userId } = req.user;

      // Check if the organization exists and if the user ID matches the organization's user ID
      const organization = await Organization.findById(organizationId);
      if (!organization || organization.userId !== userId) {
         const error = {
            status: 401,
            message: "Unauthorized",
         };
         return next(error);
      }

      next();
   } catch (error) {
      return next(error);
   }
};

export { authenticate, verifyOrganizationOwnership };
