import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/auth.middleware";
import { prisma } from "../db/client";
import { getBucket } from "../db/queries";
import { suspendStorage } from "../services/provisioner.service";

const router = Router();

router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.userId },
      select: {
        id: true,
        email: true,
        walletAddress: true,
        createdAt: true,
        emailVerified: true,
        balance: { select: { amountUsd: true } },
        _count: { select: { transactions: true } },
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      balanceUsd: user.balance ? Number(user.balance.amountUsd) : 0,
      totalTransactions: user._count.transactions,
      emailVerified: user.emailVerified,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.patch("/wallet", authMiddleware, async (req: Request, res: Response) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    res.status(400).json({ error: "Wallet address is required" });
    return;
  }
  const BASE58_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  if (!BASE58_REGEX.test(walletAddress)) {
    res.status(400).json({ error: "Invalid Solana wallet address" });
    return;
  }
  try {
    await prisma.user.update({
      where: { id: (req as any).user.userId },
      data: { walletAddress },
    });
    res.json({ message: "Wallet address updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update wallet" });
  }
});

router.patch(
  "/password",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Both passwords are required" });
      return;
    }
    if (newPassword.length < 8) {
      res
        .status(400)
        .json({ error: "New password must be at least 8 characters" });
      return;
    }
    if (newPassword === currentPassword) {
      res.status(400).json({ error: "New password must be different" });
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: (req as any).user.userId },
        select: { passwordHash: true },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: (req as any).user.userId },
        data: { passwordHash: newHash },
      });
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update password" });
    }
  },
);

router.get(
  "/notifications",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const row = await prisma.indexerState.findUnique({
        where: { key: `notif:${(req as any).user.userId}` },
      });
      const defaults = { lowBalanceThreshold: 2, emailAlerts: true };
      res.json(row ? { ...defaults, ...JSON.parse(row.value) } : defaults);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  },
);

router.patch(
  "/notifications",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { lowBalanceThreshold, emailAlerts } = req.body;
    try {
      await prisma.indexerState.upsert({
        where: { key: `notif:${(req as any).user.userId}` },
        create: {
          key: `notif:${(req as any).user.userId}`,
          value: JSON.stringify({ lowBalanceThreshold, emailAlerts }),
        },
        update: { value: JSON.stringify({ lowBalanceThreshold, emailAlerts }) },
      });
      res.json({ message: "Notification preferences saved" });
    } catch (err) {
      res.status(500).json({ error: "Failed to save preferences" });
    }
  },
);

router.delete(
  "/account",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: "Password required to delete account" });
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        where: { id: (req as any).user.userId },
        select: { passwordHash: true },
      });
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Incorrect password" });
        return;
      }
      const bucket = await getBucket((req as any).user.userId);
      if (bucket && bucket.status === "ACTIVE") {
        await suspendStorage((req as any).user.userId).catch(() => { });
      }
      await prisma.user.delete({ where: { id: (req as any).user.userId } });
      res.json({ message: "Account deleted" });
    } catch (err) {
      console.error("[settings/delete-account]", err);
      res.status(500).json({ error: "Failed to delete account" });
    }
  },
);

export default router;
