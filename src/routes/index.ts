import express from "express";
import links from "./links";
import tracks from "./tracks";

const router = express.Router();

router.use("/links", links);
router.use("/tracks", tracks);

export default router;
