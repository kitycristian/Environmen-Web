import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai/index";
import budgetRequestsRouter from "./budget-requests";
import portalRouter from "./portal";
import portalAdminRouter from "./portal-admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiRouter);
router.use(budgetRequestsRouter);
router.use(portalRouter);
router.use(portalAdminRouter);

export default router;
