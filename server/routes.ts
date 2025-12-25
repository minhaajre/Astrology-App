import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { evaluations } from "@shared/schema";
import { desc } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.post("/api/evaluations", async (req, res) => {
    try {
      const [evaluation] = await db.insert(evaluations).values(req.body).returning();
      res.json(evaluation);
    } catch (error) {
      console.error("Error saving evaluation:", error);
      res.status(500).json({ message: "Failed to save evaluation" });
    }
  });

  app.get("/api/evaluations", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.claims?.email;
      if (!ADMIN_EMAIL || userEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ message: "Forbidden - Admin access only" });
      }

      const allEvaluations = await db
        .select()
        .from(evaluations)
        .orderBy(desc(evaluations.createdAt));
      res.json(allEvaluations);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      res.status(500).json({ message: "Failed to fetch evaluations" });
    }
  });

  app.get("/api/admin/check", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.claims?.email;
      const isAdmin = ADMIN_EMAIL && userEmail === ADMIN_EMAIL;
      res.json({ isAdmin, email: userEmail });
    } catch (error) {
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  return httpServer;
}
