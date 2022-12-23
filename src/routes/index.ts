import express from "express";
import links from "./links";
import tracks from "./tracks";

const router = express.Router();

router.use("/tracks", tracks);
router.use("/links", links);

export default router;
