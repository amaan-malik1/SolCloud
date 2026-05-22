import { Router, type Request, type Response } from "express";
import { register, login, getMe } from "../services/auth.service";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const result = await register(email, password);
    res.status(201).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN";
    if (message === "EMAIL_TAKEN") {
      res.status(409).json({ error: "Email already in use" });
      return;
    }
    if (message === "PASSWORD_TOO_SHORT") {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    console.error("[auth/register]", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  try {
    const result = await login(email, password);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "UNKNOWN";
    if (message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    console.error("[auth/login]", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get(
  "/me",
  authMiddleware,
  async (
    req: Request & {
      user?: {
        userId: string;
        email: string;
      };
    },
    res: Response,
  ) => {
    try {
      if (!req.user) {
        return;
      }
      const user = await getMe(req.user.userId);
      res.json({ user });
    } catch {
      res.status(404).json({ error: "User not found" });
    }
  },
);

export default router;
