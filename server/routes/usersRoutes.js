const express = require("express")
const usersControllers = require("../controllers/usersControllers");


const auth = require("../auth.js");

const router = express.Router();

// Registration
router.post("/register", usersControllers.registerUser);

// Login
router.post("/login", usersControllers.loginUser);

// Profile Details
// router.get("/profile", auth.verify,usersControllers.getProfile);

// Retrive user details
router.get("/", auth.verify, usersControllers.getProfile);

router.get("/userDetails", auth.verify, usersControllers.retrieveUserDetails);

// Set user as an admin
router.post("/:id/admin", auth.verify, usersControllers.setUserAsAdmin);

module.exports = router;
