import express from "express";
import links from "./links";

const router = express.Router();

router.use("/links", links);

export default router;
