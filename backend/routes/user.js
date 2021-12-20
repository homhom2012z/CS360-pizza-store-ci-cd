const router = require("express").Router();
const {
  getUserProfile,
  getUserProfileById,
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/user");
const { verifyToken } = require("../validators/tokenValidator");

router.get("/user/profile", verifyToken, getUserProfile);
//post get userProfile with no verifyToken
router.post("/user/profile", getUserProfile);

// Address Routes
//router.post("/user/address/add", verifyToken, addAddress);
router.post("/user/address/add", addAddress);
router.put("/user/address/edit", verifyToken, editAddress);
router.delete("/user/address/delete/:addressId", verifyToken, deleteAddress);

module.exports = router;
