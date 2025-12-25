import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { db } from "./db";
import { evaluations, insertEvaluationSchema } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

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

  // Update evaluation (admin only) - only allow name and birthDate updates
  app.put("/api/evaluations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.claims?.email;
      if (!ADMIN_EMAIL || userEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ message: "Forbidden - Admin access only" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid evaluation ID" });
      }

      // Whitelist only allowed fields for update
      const allowedFields = ["name", "birthDate"];
      const updateData: Record<string, string> = {};
      
      for (const field of allowedFields) {
        if (req.body[field] !== undefined && typeof req.body[field] === "string") {
          updateData[field] = req.body[field].trim();
        }
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // Validate name is not empty if provided
      if (updateData.name !== undefined && updateData.name.length === 0) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }

      // Validate birthDate format if provided (YYYY-MM-DD)
      if (updateData.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(updateData.birthDate)) {
        return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
      }

      const [updated] = await db
        .update(evaluations)
        .set(updateData)
        .where(eq(evaluations.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ message: "Evaluation not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating evaluation:", error);
      res.status(500).json({ message: "Failed to update evaluation" });
    }
  });

  // Bulk delete evaluations (admin only)
  app.post("/api/evaluations/bulk-delete", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.claims?.email;
      if (!ADMIN_EMAIL || userEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ message: "Forbidden - Admin access only" });
      }

      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "No IDs provided" });
      }

      // Validate all IDs are numbers
      const validIds = ids.filter((id: any) => typeof id === "number" && !isNaN(id));
      if (validIds.length === 0) {
        return res.status(400).json({ message: "No valid IDs provided" });
      }

      let deletedCount = 0;
      for (const id of validIds) {
        const [deleted] = await db
          .delete(evaluations)
          .where(eq(evaluations.id, id))
          .returning();
        if (deleted) deletedCount++;
      }

      res.json({ success: true, deletedCount });
    } catch (error) {
      console.error("Error bulk deleting evaluations:", error);
      res.status(500).json({ message: "Failed to delete evaluations" });
    }
  });

  // Delete evaluation (admin only)
  app.delete("/api/evaluations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userEmail = req.user?.claims?.email;
      if (!ADMIN_EMAIL || userEmail !== ADMIN_EMAIL) {
        return res.status(403).json({ message: "Forbidden - Admin access only" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid evaluation ID" });
      }

      const [deleted] = await db
        .delete(evaluations)
        .where(eq(evaluations.id, id))
        .returning();

      if (!deleted) {
        return res.status(404).json({ message: "Evaluation not found" });
      }

      res.json({ success: true, id });
    } catch (error) {
      console.error("Error deleting evaluation:", error);
      res.status(500).json({ message: "Failed to delete evaluation" });
    }
  });

  return httpServer;
}
