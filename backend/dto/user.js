class UserDTO {
   constructor(user) {
      this._id = user._id;
      // this.firstName = user.firstName;
      // this.lastName = user.lastName;
      this.email = user.email;
   }
}

export default UserDTO;
