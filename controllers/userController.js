//prisma and cookie

const prisma = require("../prisma/index");

const cookieToken = require("../utils/cookieToken");

const bcrypt = require("bcryptjs");

//user signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // Hash the password before storing it in the database
    // Example using bcrypt:
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!name || !email || !password) {
      throw new Error("please provide all fields");
    }

    //creating user using prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    //creating token using cookieToken
    const token = cookieToken(user, res);
  } catch (error) {
    throw new Error(error.message);
  }
};

//user login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("please provide all fields");
    }

    //find user by email and password
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //user not found
    if (!user) {
      return res.status(401).json({ error: "User not found" });
      //throw new Error("user not found");
    }

    //checking password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
      //throw new Error("Incorrect password");
    }

    //creating token using cookieToken
    cookieToken(user, res);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
    //throw new Error(error.message);
  }
};

//logout user
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "successfully logged out",
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
