import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCallRecordSchema, insertApiConfigSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API routes prefixed with /api
  const apiRouter = express.Router();

  // Get all call records
  apiRouter.get("/calls", async (req, res) => {
    try {
      const calls = await storage.getAllCallRecords();
      res.json(calls);
    } catch (error) {
      console.error("Error getting calls:", error);
      res.status(500).json({ message: "Failed to fetch call records" });
    }
  });

  // Start a new call
  apiRouter.post("/calls", async (req, res) => {
    try {
      // Validate the request body
      const { agentId, apiKey } = req.body;
      
      if (!agentId || !apiKey) {
        return res.status(400).json({ message: "Agent ID and API Key are required" });
      }

      // Call the Retell API to start a call (simplified for now)
      // In a real implementation, we would use the Retell SDK or API
      // Here we're just simulating a call being created
      const callId = `call_${Date.now()}`;
      
      // Format the current time for display
      const now = new Date();
      const timestamp = now.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // Create a new call record in our storage
      const callRecord = await storage.createCallRecord({
        callId,
        agentId,
        agentName: "Customer Support Agent", // Default name
        status: "created",
        duration: "0:00",
        startTime: now,
        endTime: null,
        timestamp: `Today at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`
      });

      res.json({ callId, status: "created" });
    } catch (error) {
      console.error("Error starting call:", error);
      res.status(500).json({ message: "Failed to start call" });
    }
  });

  // End a call
  apiRouter.post("/calls/:callId/end", async (req, res) => {
    try {
      const { callId } = req.params;
      
      // Get the call record
      const callRecord = await storage.getCallRecordByCallId(callId);
      if (!callRecord) {
        return res.status(404).json({ message: "Call not found" });
      }

      // Calculate duration
      const startTime = callRecord.startTime;
      const endTime = new Date();
      const durationInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      const minutes = Math.floor(durationInSeconds / 60);
      const seconds = durationInSeconds % 60;
      const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Update the call record
      const updatedCall = await storage.updateCallRecord(callId, {
        status: "completed",
        duration: durationStr,
        endTime
      });

      res.json({ status: "ended", callId });
    } catch (error) {
      console.error("Error ending call:", error);
      res.status(500).json({ message: "Failed to end call" });
    }
  });

  // Toggle mute on a call
  apiRouter.post("/calls/:callId/mute", async (req, res) => {
    try {
      const { callId } = req.params;
      const { muted } = req.body;

      // This would normally call the Retell API to mute/unmute
      // For now, we'll just return success
      res.json({ status: "success", callId, muted });
    } catch (error) {
      console.error("Error toggling mute:", error);
      res.status(500).json({ message: "Failed to toggle mute" });
    }
  });

  // Save API configuration
  apiRouter.post("/config", async (req, res) => {
    try {
      const config = insertApiConfigSchema.parse(req.body);
      await storage.saveApiConfig(config);
      res.json({ status: "success" });
    } catch (error) {
      console.error("Error saving config:", error);
      res.status(500).json({ message: "Failed to save configuration" });
    }
  });

  // Register the API routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
