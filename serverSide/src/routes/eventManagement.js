const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
} = require("../controllers/eventManagement");
const authentication = require("../middleware/auth");

const router = require("express").Router();

router.post("/createEvent", authentication, createEvent);
router.get("/getAllEvent", authentication, getAllEvents);
router.get("/getEventById", authentication, getEventById);
router.post("/updateEvent", authentication, updateEvent);
router.delete("/deleteEvent", authentication, deleteEvent);
router.post("/joinEvent", authentication, joinEvent);
router.delete("/leaveEvent", authentication, leaveEvent);
module.exports = router;
