const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,
  },
});

// Virtual for plain password
userSchema
  .virtual("password")
  .set(function (plain) {
    this._plainPassword = plain;
  })
  .get(function () {
    return undefined;
  });

userSchema.pre("validate", async function (next) {
  try {
    if (this._plainPassword != null) {
      if (this._plainPassword.length < 8) {
        this.invalidate("password", "Password must be at least 8 characters");
        return next();
      }
      this.passwordHash = await bcrypt.hash(this._plainPassword, 10);
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Query updates: hash if { password: 'plain' } is provided
async function hashPasswordInUpdate(query) {
  const update = query.getUpdate() || {};
  const set = update.$set ?? update;

  const plain = set.password;
  if (!plain) return;

  if (plain.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const hash = await bcrypt.hash(plain, 10);
  set.passwordHash = hash;
  delete set.password;

  if (update.$set) update.$set = set;
  query.setUpdate(update);
}

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    await hashPasswordInUpdate(this);
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.pre("updateOne", async function (next) {
  try {
    await hashPasswordInUpdate(this);
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.isCorrectPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = model("User", userSchema);
