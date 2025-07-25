import { Router } from "express";
import { mlmDb } from "../lib/mlm-database";
import { verifyAccessToken, sanitizeUserData } from "../lib/utils";

const router = Router();

// Authentication middleware
const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Yetkilendirme başlığı gereklidir.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token gereklidir.",
      });
    }

    const decoded = verifyAccessToken(token);
    const user = await mlmDb.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Geçersiz kullanıcı.",
      });
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Geçersiz token.",
    });
  }
};

// Get wallet balance and data
router.get("/balance", requireAuth, async (req: any, res) => {
  try {
    const user = req.user;

    const walletData = {
      balance: user.wallet.balance || 0,
      totalEarnings: user.wallet.totalEarnings || 0,
      sponsorBonus: user.wallet.sponsorBonus || 0,
      careerBonus: user.wallet.careerBonus || 0,
      passiveIncome: user.wallet.passiveIncome || 0,
      leadershipBonus: user.wallet.leadershipBonus || 0,
      pendingWithdrawals: 0, // Calculate from pending withdrawals
      totalInvestment: user.totalInvestment || 0,
      availableForWithdrawal: user.wallet.totalEarnings || 0,
      lastTransaction: new Date().toISOString(),
    };

    return res.json({
      success: true,
      wallet: walletData,
    });
  } catch (error) {
    console.error("Get wallet balance error:", error);
    return res.status(500).json({
      success: false,
      error: "Cüzdan bilgileri alınırken hata oluştu.",
    });
  }
});

// Make investment with IBAN and receipt
router.post("/invest", requireAuth, async (req: any, res) => {
  try {
    const { type, amount, iban, accountHolder, paymentMethod } = req.body;
    const user = req.user;

    // Validation
    if (!type || !amount || !iban || !accountHolder) {
      return res.status(400).json({
        success: false,
        error: "Tüm alanlar gereklidir.",
      });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Miktar pozitif olmalıdır.",
      });
    }

    // Validate IBAN format
    const ibanRegex =
      /^TR\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}$/;
    if (!ibanRegex.test(iban.replace(/\s/g, ""))) {
      return res.status(400).json({
        success: false,
        error: "Geçersiz IBAN formatı.",
      });
    }

    // Create investment record
    const investment = {
      id: Date.now().toString(),
      userId: user.id,
      memberId: user.memberId,
      type,
      amount: parseFloat(amount),
      iban: iban.replace(/\s/g, ""),
      accountHolder,
      paymentMethod: paymentMethod || "bank_transfer",
      status: "pending",
      requestDate: new Date().toISOString(),
      receiptUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    // Add to database
    await mlmDb.db.read();
    if (!mlmDb.db.data.investments) {
      mlmDb.db.data.investments = [];
    }
    mlmDb.db.data.investments.push(investment);
    await mlmDb.db.write();

    // Create member activity log
    await mlmDb.createMemberActivity({
      memberId: user.memberId,
      userId: user.id,
      activityType: "INVESTMENT",
      description: `Yatırım talebi: ${type} paketi - ${formatCurrency(parseFloat(amount))}`,
      data: {
        investmentId: investment.id,
        type,
        amount: parseFloat(amount),
        paymentMethod,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Yatırım talebi başarıyla oluşturuldu.",
      investment,
    });
  } catch (error) {
    console.error("Investment error:", error);
    return res.status(500).json({
      success: false,
      error: "Yatırım talebi oluşturulurken hata oluştu.",
    });
  }
});

// Get user investments
router.get("/investments", requireAuth, async (req: any, res) => {
  try {
    const user = req.user;

    await mlmDb.db.read();
    const investments = (mlmDb.db.data.investments || []).filter(
      (inv: any) => inv.userId === user.id,
    );

    return res.json({
      success: true,
      investments,
    });
  } catch (error) {
    console.error("Get investments error:", error);
    return res.status(500).json({
      success: false,
      error: "Yatırımlar alınırken hata oluştu.",
    });
  }
});

// Submit withdrawal request
router.post("/withdraw", requireAuth, async (req: any, res) => {
  try {
    const { amount, iban, accountHolder } = req.body;
    const user = req.user;

    // Validation
    if (!amount || !iban || !accountHolder) {
      return res.status(400).json({
        success: false,
        error: "Tüm alanlar gereklidir.",
      });
    }

    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Miktar pozitif olmalıdır.",
      });
    }

    // Check minimum withdrawal amount
    if (withdrawAmount < 100) {
      return res.status(400).json({
        success: false,
        error: "Minimum çekim tutarı 100 TL'dir.",
      });
    }

    // Check available balance
    const availableBalance = user.wallet.totalEarnings || 0;
    if (withdrawAmount > availableBalance) {
      return res.status(400).json({
        success: false,
        error: "Yetersiz bakiye.",
      });
    }

    // Calculate fee (2%)
    const fee = withdrawAmount * 0.02;
    const netAmount = withdrawAmount - fee;

    // Create withdrawal record
    const withdrawal = {
      id: Date.now().toString(),
      userId: user.id,
      memberId: user.memberId,
      amount: withdrawAmount,
      iban: iban.replace(/\s/g, ""),
      accountHolder,
      fee,
      netAmount,
      status: "pending",
      requestDate: new Date().toISOString(),
    };

    // Add to database
    await mlmDb.db.read();
    if (!mlmDb.db.data.withdrawals) {
      mlmDb.db.data.withdrawals = [];
    }
    mlmDb.db.data.withdrawals.push(withdrawal);

    // Update user's pending withdrawals
    const userIndex = mlmDb.db.data.users.findIndex(
      (u: any) => u.id === user.id,
    );
    if (userIndex !== -1) {
      mlmDb.db.data.users[userIndex].wallet.totalEarnings -= withdrawAmount;
    }

    await mlmDb.db.write();

    // Create member activity log
    await mlmDb.createMemberActivity({
      memberId: user.memberId,
      userId: user.id,
      activityType: "WITHDRAWAL",
      description: `Para çekme talebi: ${formatCurrency(withdrawAmount)} (Net: ${formatCurrency(netAmount)})`,
      data: {
        withdrawalId: withdrawal.id,
        amount: withdrawAmount,
        fee,
        netAmount,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Para çekme talebi başarıyla oluşturuldu.",
      withdrawal,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return res.status(500).json({
      success: false,
      error: "Para çekme talebi oluşturulurken hata oluştu.",
    });
  }
});

// Get user withdrawals
router.get("/withdrawals", requireAuth, async (req: any, res) => {
  try {
    const user = req.user;

    await mlmDb.db.read();
    const withdrawals = (mlmDb.db.data.withdrawals || []).filter(
      (withdrawal: any) => withdrawal.userId === user.id,
    );

    return res.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error("Get withdrawals error:", error);
    return res.status(500).json({
      success: false,
      error: "Para çekme işlemleri alınırken hata oluştu.",
    });
  }
});

// Transfer money to another member
router.post("/transfer", requireAuth, async (req: any, res) => {
  try {
    const { targetMemberId, amount, description } = req.body;
    const user = req.user;

    // Validation
    if (!targetMemberId || !amount) {
      return res.status(400).json({
        success: false,
        error: "Hedef üye ID ve miktar gereklidir.",
      });
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Miktar pozitif olmalıdır.",
      });
    }

    // Check balance
    if (transferAmount > user.wallet.balance) {
      return res.status(400).json({
        success: false,
        error: "Yetersiz bakiye.",
      });
    }

    // Find target user
    const targetUser = await mlmDb.getUserByMemberId(targetMemberId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: "Hedef üye bulunamadı.",
      });
    }

    // Perform transfer
    await mlmDb.db.read();

    // Update sender balance
    const senderIndex = mlmDb.db.data.users.findIndex(
      (u: any) => u.id === user.id,
    );
    if (senderIndex !== -1) {
      mlmDb.db.data.users[senderIndex].wallet.balance -= transferAmount;
    }

    // Update receiver balance
    const receiverIndex = mlmDb.db.data.users.findIndex(
      (u: any) => u.id === targetUser.id,
    );
    if (receiverIndex !== -1) {
      mlmDb.db.data.users[receiverIndex].wallet.balance += transferAmount;
    }

    await mlmDb.db.write();

    // Create transfer records in real-time transactions
    await mlmDb.createRealTimeTransaction({
      userId: user.id,
      type: "transfer",
      subType: "outgoing",
      amount: transferAmount,
      description: description || `Transfer to ${targetMemberId}`,
      metadata: {
        targetUserId: targetUser.id,
        targetMemberId,
      },
    });

    await mlmDb.createRealTimeTransaction({
      userId: targetUser.id,
      type: "transfer",
      subType: "incoming",
      amount: transferAmount,
      description: description || `Transfer from ${user.memberId}`,
      metadata: {
        sourceUserId: user.id,
        sourceMemberId: user.memberId,
      },
    });

    return res.json({
      success: true,
      message: "Transfer başarıyla gerçekleştirildi.",
    });
  } catch (error) {
    console.error("Transfer error:", error);
    return res.status(500).json({
      success: false,
      error: "Transfer sırasında hata oluştu.",
    });
  }
});

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
}

export default router;
