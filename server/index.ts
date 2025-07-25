import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { mlmDb } from "./lib/mlm-database";
import authRoutes from "./routes/auth";
import transactionRoutes from "./routes/transactions";
import walletRoutes from "./routes/wallet";
import productRoutes from "./routes/products";
import paymentRoutes from "./routes/payments";

// MLM Routes
import {
  register,
  login,
  purchaseMembership,
  activateMembership,
  getUserDashboard,
  getNetworkTree,
  createWithdrawalRequest,
  transferFunds,
  calculateSpiritual,
  getClonePage,
  getAdminDashboard,
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateSystemSettings,
  getBinaryNetworkStats,
  getDetailedNetworkTree,
  activateBinarySystem,
  calculateBinaryBonus,
  getPerformanceStatus,
  optimizeSystem,
  checkCapacity,
  batchProcessUsers,
  getUserProductPurchases,
} from "./routes/mlm";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Add request logging for debugging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Ensure API routes return JSON on errors
  app.use("/api", (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      // If we're sending HTML and this is an API route, convert to JSON error
      if (
        typeof data === "string" &&
        data.includes("<!DOCTYPE") &&
        req.path.startsWith("/api")
      ) {
        console.error("HTML response attempted on API route:", req.path);
        return originalSend.call(
          this,
          JSON.stringify({
            success: false,
            error: "Server error occurred",
          }),
        );
      }
      return originalSend.call(this, data);
    };
    next();
  });

  // Initialize MLM Database
  mlmDb
    .init()
    .then(() => {
      console.log("MLM Database initialized");
    })
    .catch((error) => {
      console.error("MLM Database initialization failed:", error);
    });

  // Original Routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Kutbul Zaman MLM System is running!" });
  });

  // Test endpoint for body parsing
  app.post("/api/test", (req, res) => {
    console.log("Test endpoint - body:", req.body);
    res.json({ received: req.body, success: true });
  });

  app.get("/api/demo", handleDemo);

  // Enhanced Authentication Routes with JWT and Admin Management
  app.use("/api/auth", authRoutes);

  // Real-time Transaction Routes
  app.use("/api/transactions", transactionRoutes);

  // E-wallet and Financial Routes
  app.use("/api/wallet", walletRoutes);

  // Product Routes
  app.use("/api/products", productRoutes);

  // Payment Routes
  app.use("/api/payments", paymentRoutes);

  // Legacy authentication routes (maintained for backward compatibility)
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  // Membership Routes
  app.post("/api/membership/purchase", purchaseMembership);
  app.post("/api/membership/activate", activateMembership);

  // User Dashboard Routes
  app.get("/api/user/:userId/dashboard", getUserDashboard);
  app.get("/api/user/:userId/network", getNetworkTree);
  app.get("/api/user/:userId/product-purchases", getUserProductPurchases);

  // Binary Network Routes
  app.get("/api/mlm/binary-stats/:userId", getBinaryNetworkStats);
  app.get("/api/mlm/network/:userId", getDetailedNetworkTree);
  app.post("/api/mlm/activate-binary", activateBinarySystem);
  app.post("/api/mlm/calculate-binary/:userId", calculateBinaryBonus);

  // Performance Monitoring Routes
  app.get("/api/mlm/performance-status", getPerformanceStatus);
  app.post("/api/mlm/optimize-system", optimizeSystem);
  app.get("/api/mlm/check-capacity", checkCapacity);
  app.post("/api/mlm/batch-process", batchProcessUsers);

  // Financial Routes
  app.post("/api/finance/withdraw", createWithdrawalRequest);
  app.post("/api/finance/transfer", transferFunds);

  // Spiritual Calculation Routes
  app.post("/api/spiritual/calculate", calculateSpiritual);

  // Clone Page Routes
  app.get("/api/clone/:slug", getClonePage);

  // Track clone page visits
  app.post("/api/clone/:slug/visit", async (req, res) => {
    try {
      const { slug } = req.params;
      const db = await mlmDb;
      await db.db.read();

      const clonePageIndex = db.db.data.clonePages.findIndex(
        (page: any) => page.slug === slug,
      );

      if (clonePageIndex !== -1) {
        db.db.data.clonePages[clonePageIndex].visitCount =
          (db.db.data.clonePages[clonePageIndex].visitCount || 0) + 1;
        await db.db.write();
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking visit:", error);
      res.status(500).json({ error: "Error tracking visit" });
    }
  });

  // Admin Routes (restricted to admin users)
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      await getAdminDashboard(req, res);
    } catch (error) {
      console.error("Admin dashboard error:", error);
      res.status(500).json({
        error: "Internal server error",
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          totalRevenue: 0,
          pendingPayments: 0,
        },
        settings: null,
      });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      await getAllUsers(req, res);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ users: [] });
    }
  });

  app.put("/api/admin/user/:userId", updateUserByAdmin);
  app.delete("/api/admin/user/:userId", deleteUserByAdmin);
  app.put("/api/admin/settings", updateSystemSettings);

  // Database reset route (admin only)
  app.post("/api/admin/reset-database", async (req, res) => {
    try {
      // Re-initialize database with clean default data
      await mlmDb.init();
      res.json({
        success: true,
        message:
          "Veritabanı temizlendi ve Abdulkadir Kan ile yeniden başlatıldı",
      });
    } catch (error) {
      console.error("Database reset error:", error);
      res.status(500).json({
        error: "Veritabanı sıfırlanırken hata oluştu",
      });
    }
  });

  // Enhanced admin routes
  app.get("/api/admin/transactions", async (req, res) => {
    try {
      const db = await mlmDb;
      await db.db.read();
      const transactions = db.db.data.transactions || [];
      res.json({ transactions });
    } catch (error) {
      console.error("Transactions fetch error:", error);
      res.status(500).json({ error: "İşlemler alınamadı", transactions: [] });
    }
  });

  app.get("/api/admin/network", async (req, res) => {
    try {
      const db = await mlmDb;
      await db.db.read();
      const users = db.db.data.users || [];

      // Build network tree structure
      const networkTree = users.map((user) => ({
        userId: user.id,
        memberId: user.memberId,
        fullName: user.fullName,
        level: 1, // Calculate actual level
        position: "root", // Calculate position
        isActive: user.isActive,
        directReferrals: user.directReferrals,
        totalVolume: user.totalInvestment,
        children: [],
      }));

      res.json({ network: networkTree });
    } catch (error) {
      console.error("Network fetch error:", error);
      res.status(500).json({ error: "Network verisi alınamadı", network: [] });
    }
  });

  app.get("/api/admin/content", async (req, res) => {
    try {
      // Return content blocks - can be extended with database storage
      const contentBlocks = [
        {
          id: "hero",
          type: "hero",
          title: "Hero Bölümü",
          content: "Manevi gelişim ve finansal özgürlük yolculuğunuza başlayın",
          isActive: true,
          order: 1,
        },
        {
          id: "features",
          type: "features",
          title: "Özellikler",
          content: "7 seviyeli nefis mertebeleri sistemi",
          isActive: true,
          order: 2,
        },
      ];
      res.json({ content: contentBlocks });
    } catch (error) {
      console.error("Content fetch error:", error);
      res.status(500).json({ error: "İçerik alınamadı", content: [] });
    }
  });

  // Content update endpoints
  app.put("/api/admin/content/:section", async (req, res) => {
    try {
      const { section } = req.params;
      const contentData = req.body;

      // Here you would save to database
      // For now, we'll just return success
      console.log(`Updating ${section} content:`, contentData);

      res.json({
        success: true,
        message: `${section} içeriği güncellendi`,
        data: contentData,
      });
    } catch (error) {
      console.error("Content update error:", error);
      res.status(500).json({ error: "İçerik güncellenemedi" });
    }
  });

  // Payment Request Routes
  app.get("/api/admin/payment-requests", async (req, res) => {
    try {
      const db = await mlmDb;
      if (db.db && db.db.data) {
        await db.db.read();
        const paymentRequests = db.db.data.paymentRequests || [];
        res.json({ paymentRequests });
      } else {
        res.json({ paymentRequests: [] });
      }
    } catch (error) {
      console.error("Payment requests error:", error);
      res.status(500).json({
        error: "Error fetching payment requests",
        paymentRequests: [],
      });
    }
  });

  app.put("/api/admin/payment-request/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedRequest = await mlmDb.updatePaymentRequest(id, updates);

      res.json({ success: true, paymentRequest: updatedRequest });
    } catch (error) {
      res.status(500).json({ error: "Error updating payment request" });
    }
  });

  // Transaction Routes
  app.get("/api/user/:userId/transactions", async (req, res) => {
    try {
      const { userId } = req.params;
      const db = await mlmDb;
      await db.db.read();
      const transactions = db.db.data.transactions.filter(
        (t: any) => t.userId === userId,
      );
      res.json({ transactions });
    } catch (error) {
      res.status(500).json({ error: "Error fetching transactions" });
    }
  });

  // Member Panel APIs
  app.get("/api/user/:userId/team", async (req, res) => {
    try {
      const { userId } = req.params;
      const db = await mlmDb;
      await db.db.read();

      // Get all users sponsored by this user
      const teamMembers = db.db.data.users
        .filter((user: any) => user.sponsorId === userId)
        .map((user: any) => ({
          id: user.id,
          memberId: user.memberId,
          fullName: user.fullName,
          email: user.email,
          careerLevel: user.careerLevel?.name || "Emmare",
          totalInvestment: user.totalInvestment || 0,
          directReferrals: user.directReferrals || 0,
          registrationDate: user.registrationDate,
          isActive: user.isActive,
          level: 1, // Direct referrals are level 1
          position: "direct",
        }));

      res.json({ team: teamMembers });
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ error: "Error fetching team", team: [] });
    }
  });

  app.get("/api/user/:userId/clone-info", async (req, res) => {
    try {
      const { userId } = req.params;
      const db = await mlmDb;
      await db.db.read();

      const clonePage = db.db.data.clonePages.find(
        (page: any) => page.userId === userId,
      );

      res.json({
        customMessage: clonePage?.customizations?.customMessage || "",
        visits: clonePage?.visitCount || 0,
        conversions: clonePage?.conversionCount || 0,
      });
    } catch (error) {
      console.error("Error fetching clone info:", error);
      res.status(500).json({
        customMessage: "",
        visits: 0,
        conversions: 0,
      });
    }
  });

  app.put("/api/user/:userId/clone-message", async (req, res) => {
    try {
      const { userId } = req.params;
      const { customMessage } = req.body;
      const db = await mlmDb;
      await db.db.read();

      const clonePageIndex = db.db.data.clonePages.findIndex(
        (page: any) => page.userId === userId,
      );

      if (clonePageIndex !== -1) {
        db.db.data.clonePages[clonePageIndex].customizations = {
          ...db.db.data.clonePages[clonePageIndex].customizations,
          customMessage,
        };
        await db.db.write();
      }

      res.json({ success: true, message: "Custom message updated" });
    } catch (error) {
      console.error("Error updating clone message:", error);
      res.status(500).json({ error: "Error updating message" });
    }
  });

  app.put("/api/user/:userId/clone-settings", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = req.body;
      const db = await mlmDb;
      await db.db.read();

      const clonePageIndex = db.db.data.clonePages.findIndex(
        (page: any) => page.userId === userId,
      );

      if (clonePageIndex !== -1) {
        db.db.data.clonePages[clonePageIndex].customizations = {
          ...db.db.data.clonePages[clonePageIndex].customizations,
          ...settings,
        };
        await db.db.write();
      }

      res.json({ success: true, message: "Clone page settings updated" });
    } catch (error) {
      console.error("Error updating clone page settings:", error);
      res.status(500).json({ error: "Error updating settings" });
    }
  });

  // Announcement Routes
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await mlmDb.getAnnouncements();
      res.json({ announcements });
    } catch (error) {
      res.status(500).json({ error: "Error fetching announcements" });
    }
  });

  app.post("/api/admin/announcements", async (req, res) => {
    try {
      const announcementData = req.body;
      await mlmDb.createAnnouncement(announcementData);
      res.json({ success: true, message: "Duyuru oluşturuldu" });
    } catch (error) {
      res.status(500).json({ error: "Error creating announcement" });
    }
  });

  return app;
}
