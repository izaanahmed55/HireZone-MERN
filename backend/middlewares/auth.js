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
            message: "Unauthorized. ",
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

      const organizationId = req.body.organizationId;
      const  userId  = req.user._id;
      console.log("User Id: ", userId);
      console.log("organizationId: ", organizationId);

      // Check if the organization exists and if the user ID matches the organization's user ID
      const organization = await Organization.findById(organizationId);
      console.log("organization.userId: ", organization.userId , " | ",organization.userId !== userId);
      if (!organization || organization.userId.toString() !== userId.toString()) {
         const error = {
            status: 401,
            message: "Accessing Unauthorized Organization",
         };
         return next(error);
      }
      console.log("lexgoo")
      next();
   } catch (error) {

      return next(error);
   }
};

export { authenticate, verifyOrganizationOwnership };
