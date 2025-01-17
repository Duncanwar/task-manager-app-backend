import { Router } from "express";
import prisma from "../client";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.post(
  "/tax",
  catchAsync(async (req, res) => {
    // const {itemName,}
    console.log(req.body);
    const { task, vatExclusivePrice, totalVat } = req.body;

    const tax = await prisma.tax.create({
      data: {
        itemName: task.itemName,
        exemptionStatus: task.exemptionStatus,
        vatAmount: parseFloat(totalVat),
        vatInclusiveAmount: parseFloat(task.vatInclusiveAmount),
        vatExclusivePrice: parseFloat(vatExclusivePrice),
      },
    });
    return res.status(201).json({ tax: tax });
  })
);

export default router;
