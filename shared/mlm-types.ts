// MLM System Types for Kutbul Zaman - Manevi Rehberim

export interface User {
  id: string;
  memberId: string; // Unique member ID like ak000001
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin" | "user" | "moderator";

  // MLM Structure
  sponsorId?: string;
  referralCode: string;
  leftChild?: string;
  rightChild?: string;

  // Membership Status
  membershipType: "free" | "entry" | "monthly" | "yearly";
  membershipStartDate?: Date;
  membershipEndDate?: Date;
  isActive: boolean;

  // Career Level (Nefis Mertebeleri)
  careerLevel: CareerLevel;
  totalInvestment: number;
  directReferrals: number;
  totalTeamSize: number;

  // Financial
  wallet: {
    balance: number;
    totalEarnings: number;
    sponsorBonus: number;
    careerBonus: number;
    passiveIncome: number;
    leadershipBonus: number;
  };

  // Banking Details
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    iban: string;
    accountHolderName: string;
  };

  // KYC Status
  kycStatus: "pending" | "approved" | "rejected";
  kycDocuments?: {
    idDocument?: string;
    addressProof?: string;
    bankStatement?: string;
  };

  // Personal Info
  dateOfBirth?: Date;
  motherName?: string; // For spiritual calculations
  address?: string;

  // Activity Tracking
  lastLoginDate?: Date;
  registrationDate: Date;
  lastPaymentDate?: Date;
  lastActivityDate?: Date;
  monthlyActivityStatus: "active" | "inactive" | "warning";
  yearlyRenewalDate: Date;
  daysSinceLastActivity: number;
  monthlyActivityStreak: number;
  nextRenewalWarning?: Date;
}

export interface CareerLevel {
  id: number;
  name: string;
  description: string;
  minInvestment: number;
  minDirectReferrals: number;
  commissionRate: number;
  passiveIncomeRate: number;
  bonus: number;
  requirements: string[];
}

export const CAREER_LEVELS: CareerLevel[] = [
  {
    id: 1,
    name: "Nefs-i Emmare",
    description: "Kötülüğü emreden nefis - Giriş seviyesi",
    minInvestment: 0,
    minDirectReferrals: 0,
    commissionRate: 2,
    passiveIncomeRate: 0,
    bonus: 0,
    requirements: ["Giriş seviyesi"],
  },
  {
    id: 2,
    name: "Nefs-i Levvame",
    description: "Kendini kınayan nefis",
    minInvestment: 500,
    minDirectReferrals: 2,
    commissionRate: 3,
    passiveIncomeRate: 0.5,
    bonus: 50,
    requirements: ["2 direkt üye", "$500 yatırım"],
  },
  {
    id: 3,
    name: "Nefs-i Mülhime",
    description: "İlham alan nefis",
    minInvestment: 1500,
    minDirectReferrals: 4,
    commissionRate: 4,
    passiveIncomeRate: 1,
    bonus: 150,
    requirements: ["4 aktif üye", "$1500 yatırım"],
  },
  {
    id: 4,
    name: "Nefs-i Mutmainne",
    description: "Tatmin olmuş, huzurlu nefis",
    minInvestment: 3000,
    minDirectReferrals: 10,
    commissionRate: 5,
    passiveIncomeRate: 1.5,
    bonus: 300,
    requirements: ["10 ekip üyesi", "$3000 yatırım"],
  },
  {
    id: 5,
    name: "Nefs-i Râziye",
    description: "Allah'ın takdirine razı olan nefis",
    minInvestment: 5000,
    minDirectReferrals: 2,
    commissionRate: 6,
    passiveIncomeRate: 2,
    bonus: 500,
    requirements: ["2 lider", "$5000 yatırım"],
  },
  {
    id: 6,
    name: "Nefs-i Mardiyye",
    description: "Allah'ın razı olduğu nefis",
    minInvestment: 10000,
    minDirectReferrals: 50,
    commissionRate: 8,
    passiveIncomeRate: 3,
    bonus: 1000,
    requirements: ["50 toplam üye", "$10000 yatırım"],
  },
  {
    id: 7,
    name: "Nefs-i Kâmile",
    description: "Olgunlaşmış, kemale ermiş nefis",
    minInvestment: 25000,
    minDirectReferrals: 3,
    commissionRate: 12,
    passiveIncomeRate: 4,
    bonus: 2500,
    requirements: ["3 lider", "$25000 yatırım"],
  },
];

export interface MembershipPackage {
  id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
  type: "entry" | "monthly" | "yearly";
  discount?: number;
}

export const MEMBERSHIP_PACKAGES: MembershipPackage[] = [
  {
    id: "entry",
    name: "Giriş Paketi",
    price: 100,
    duration: 0,
    type: "entry",
    features: [
      "Sistem aktivasyonu",
      "Kişisel klon sayfa",
      "Manevi panel erişimi",
      "Simülasyon sistemi",
      "Binary sistem dahil",
    ],
  },
  {
    id: "monthly",
    name: "Aylık Aktiflik",
    price: 20,
    duration: 30,
    type: "monthly",
    features: [
      "Komisyon hakları",
      "Tüm özellikler aktif",
      "MLM sistem erişimi",
      "Klon sayfa yönetimi",
      "Destek sistemi",
      "Manevi içerik erişimi",
    ],
  },
  {
    id: "yearly",
    name: "Yıllık Plan",
    price: 200,
    duration: 365,
    type: "yearly",
    discount: 15,
    features: [
      "Tüm aylık özellikler",
      "%15 indirim",
      "Ek bonuslar",
      "Safiye üyeler için +%1",
      "Öncelikli destek",
    ],
  },
];

export interface Transaction {
  id: string;
  userId: string;
  type:
    | "deposit"
    | "withdrawal"
    | "commission"
    | "bonus"
    | "transfer"
    | "payment";
  amount: number;
  description: string;
  status: "pending" | "completed" | "rejected";
  date: Date;
  referenceId?: string;
  adminNote?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: "bank_transfer" | "credit_card" | "crypto";
  status: "pending" | "approved" | "rejected";
  bankDetails?: any;
  receipt?: string;
  adminNote?: string;
  requestDate: Date;
  processedDate?: Date;
}

export interface NetworkNode {
  userId: string;
  level: number;
  position: "left" | "right";
  children: NetworkNode[];
  totalTeamSize: number;
  totalVolume: number;
}

export interface CommissionDistribution {
  totalAmount: number;
  sponsorBonus: number; // 10%
  careerBonus: number; // 25%
  passiveIncome: number; // 5%
  systemFund: number; // 60%
  distributionDate: Date;
}

export interface SpiritualCalculation {
  userId: string;
  name: string;
  motherName: string;
  birthDate: Date;
  ebcedValue: number;
  spiritualNumber: number;
  destiny: string;
  recommendations: string[];
  calculationDate: Date;
}

export interface ClonePage {
  userId: string;
  slug: string;
  customDomain?: string;
  isActive: boolean;
  visitCount: number;
  conversionCount: number;
  customizations: {
    headerImage?: string;
    testimonials?: string[];
    customMessage?: string;
  };
}

// Commission calculation utilities
export const calculateCommissions = (
  investment: number,
): CommissionDistribution => {
  const total = investment;
  const distributionAmount = total * 0.4; // 40% for distribution

  return {
    totalAmount: total,
    sponsorBonus: total * 0.1, // 10%
    careerBonus: total * 0.25, // 25%
    passiveIncome: total * 0.05, // 5%
    systemFund: total * 0.6, // 60%
    distributionDate: new Date(),
  };
};

export const getCareerLevel = (
  investment: number,
  directReferrals: number,
): CareerLevel => {
  let level = CAREER_LEVELS[0];

  for (const careerLevel of CAREER_LEVELS) {
    if (
      investment >= careerLevel.minInvestment &&
      directReferrals >= careerLevel.minDirectReferrals
    ) {
      level = careerLevel;
    }
  }

  return level;
};

export const calculatePassiveIncome = (
  userLevel: CareerLevel,
  downlineInvestment: number,
): number => {
  return (downlineInvestment * userLevel.passiveIncomeRate) / 100;
};

// Product System Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  features: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductPurchase {
  id: string;
  productId: string;
  buyerId: string;
  buyerEmail: string;
  referralCode?: string;
  sponsorId?: string;
  purchaseAmount: number;
  status: "pending" | "completed" | "cancelled" | "refunded";
  paymentMethod: "credit_card" | "bank_transfer" | "crypto" | "system_wallet" | "iyzico";
  shippingAddress: {
    fullName: string;
    company?: string;
    address: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email?: string;
    addressType?: "home" | "work" | "other";
    instructions?: string;
  };
  purchaseDate: Date;
  commissionDistributed: boolean;
  trackingNumber?: string;
  deliveryDate?: Date;
  paymentId?: string;
  conversationId?: string;
  shippingCost?: number;
  paymentVerifiedAt?: Date;
}

export interface ProductCommission {
  id: string;
  purchaseId: string;
  productId: string;
  totalAmount: number;
  sponsorBonus: number; // 10%
  careerBonus: number; // 25%
  passiveIncome: number; // 5%
  systemFund: number; // 60%
  distributedAt: Date;
  recipients: Array<{
    userId: string;
    type: "sponsor" | "career" | "passive";
    amount: number;
    level?: number;
  }>;
}

// Shipping and Address Management
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
  provider: string;
}

export interface ShippingAddress {
  id?: string;
  userId?: string;
  fullName: string;
  company?: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email?: string;
  isDefault?: boolean;
  addressType: "home" | "work" | "other";
  instructions?: string;
}

export interface ShippingCalculation {
  basePrice: number;
  distance: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  shippingOptions: ShippingOption[];
}

// Payment Integration
export interface IyzicoPayment {
  conversationId: string;
  price: string;
  paidPrice: string;
  currency: "TRY" | "USD" | "EUR";
  basketId: string;
  paymentChannel: "WEB" | "MOBILE";
  paymentGroup: "PRODUCT" | "LISTING" | "SUBSCRIPTION";
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    gsmNumber: string;
    registrationDate: string;
    lastLoginDate: string;
    registrationAddress: string;
    city: string;
    country: string;
    zipCode: string;
    ip: string;
  };
  shippingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  billingAddress: {
    address: string;
    zipCode: string;
    contactName: string;
    city: string;
    country: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2?: string;
    itemType: "PHYSICAL" | "VIRTUAL";
    price: string;
  }>;
}
