import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleUser: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

//Checks the enters password with stored hashed password by using bcrypt
userSchema.methods.matchPassword = async function (enterpassword) {
  return await bcrypt.compare(enterpassword, this.password);
};

//Before storing the password convert into hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleUser) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
