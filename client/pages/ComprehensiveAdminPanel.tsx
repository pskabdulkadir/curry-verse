import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AdminProductManagement from "./AdminProductManagement";
import {
  Crown,
  Users,
  DollarSign,
  Settings,
  FileText,
  MessageSquare,
  TrendingUp,
  Shield,
  Bell,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Ban,
  RefreshCw,
  Save,
  AlertTriangle,
  Target,
  Network,
  Zap,
  Home,
  Globe,
  Image,
  Layout,
  Database,
  Server,
  Monitor,
  Activity,
  Share2,
  Megaphone,
  Calendar,
  ShoppingCart,
  BookOpen,
  Mail,
  Phone,
  Building,
  Star,
  Code,
  Link,
  Palette,
  Menu,
  MoreHorizontal,
  Power,
  HardDrive,
  Cpu,
  Terminal,
  Heart,
  Quote,
  Video,
  ExternalLink,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Comprehensive Interfaces
interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  pendingPayments: number;
  systemHealth: "healthy" | "warning" | "critical";
  databaseSize: string;
  serverUptime: string;
  apiCalls: number;
}

interface MenuConfig {
  id: string;
  label: string;
  href: string;
  icon: string;
  visible: boolean;
  order: number;
  permissions: string[];
}

interface ButtonConfig {
  id: string;
  page: string;
  element: string;
  text: string;
  style: "primary" | "secondary" | "outline" | "destructive";
  visible: boolean;
  enabled: boolean;
  action: string;
}

interface ContentBlock {
  id: string;
  type: "hero" | "feature" | "testimonial" | "pricing" | "cta" | "text";
  title: string;
  content: string;
  image?: string;
  position: number;
  visible: boolean;
  page: string;
}

interface SystemConfig {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  registrationEnabled: boolean;
  maintenanceMode: boolean;
  maxCapacity: number;
  autoPlacement: boolean;
  sslEnabled: boolean;
  environment: "development" | "production" | "staging";
}

export default function ComprehensiveAdminPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  // System Data States
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    systemHealth: "healthy",
    databaseSize: "0 MB",
    serverUptime: "0 days",
    apiCalls: 0,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [menuConfig, setMenuConfig] = useState<MenuConfig[]>([]);
  const [buttonConfig, setButtonConfig] = useState<ButtonConfig[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    siteName: "Kutbul Zaman",
    siteDescription: "Manevi Rehberim - MLM Sistemi",
    logoUrl: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    registrationEnabled: true,
    maintenanceMode: false,
    maxCapacity: 100000,
    autoPlacement: true,
    sslEnabled: false,
    environment: "development",
  });

  // New User Registration Form
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "member",
    sponsorId: "",
    careerLevel: "1",
    membershipType: "entry",
    initialBalance: 0,
  });

  // Database Schema Management
  const [databaseSchema, setDatabaseSchema] = useState({
    users: true,
    wallets: true,
    payments: true,
    commissions: true,
    content: true,
    logs: true,
  });

  // Live Deployment Settings
  const [deploymentConfig, setDeploymentConfig] = useState({
    testMode: true,
    envProduction: false,
    sslActive: false,
    domainConfigured: false,
    backupEnabled: true,
  });

  // Spiritual Content Management States
  const [spiritualContent, setSpiritualContent] = useState({
    quranJuzList: [],
    hadiths: [],
    sunnahs: [],
    spiritualSciences: [],
    meaningfulQuotes: [],
    zodiacSigns: []
  });

  const [newHadith, setNewHadith] = useState({
    arabic: "",
    translation: "",
    source: "",
    category: "",
    explanation: "",
    narrator: "",
    bookNumber: ""
  });

  const [newSunnah, setNewSunnah] = useState({
    title: "",
    description: "",
    time: "",
    reward: "",
    evidence: "",
    subcategory: "",
    details: []
  });

  const [newQuote, setNewQuote] = useState({
    text: "",
    author: "",
    category: ""
  });

  useEffect(() => {
    checkAuthentication();
    loadSystemData();
  }, []);

  const checkAuthentication = async () => {
    try {
      const currentUserData = localStorage.getItem("currentUser");
      const authToken = localStorage.getItem("authToken");

      if (!currentUserData || !authToken) {
        console.log("Missing authentication data, redirecting to login");
        navigate("/login");
        return;
      }

      const currentUser = JSON.parse(currentUserData);
      if (currentUser.role !== "admin") {
        navigate("/member-panel");
        return;
      }

      // Validate token with API call
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("Token validation failed, redirecting to login");
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          navigate("/login");
          return;
        }
      } catch (apiError) {
        console.error("Token validation error:", apiError);
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
      navigate("/login");
    }
  };

  const loadSystemData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSystemStats(),
        loadUsers(),
        loadMenuConfig(),
        loadButtonConfig(),
        loadContentBlocks(),
        loadSystemConfig(),
      ]);
    } catch (error) {
      console.error("Error loading system data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/system-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSystemStats(data.stats);
      }
    } catch (error) {
      console.error("Error loading system stats:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadMenuConfig = async () => {
    // Mock data for menu configuration
    setMenuConfig([
      {
        id: "home",
        label: "Ana Sayfa",
        href: "/",
        icon: "Home",
        visible: true,
        order: 1,
        permissions: ["all"],
      },
      {
        id: "sistem",
        label: "Sistem",
        href: "/sistem",
        icon: "Settings",
        visible: true,
        order: 2,
        permissions: ["member"],
      },
      {
        id: "member-panel",
        label: "Üye Paneli",
        href: "/member-panel",
        icon: "Users",
        visible: true,
        order: 3,
        permissions: ["member"],
      },
      {
        id: "admin-panel",
        label: "Admin Paneli",
        href: "/admin-panel",
        icon: "Crown",
        visible: true,
        order: 4,
        permissions: ["admin"],
      },
    ]);
  };

  const loadButtonConfig = async () => {
    // Mock data for button configuration
    setButtonConfig([
      {
        id: "login-btn",
        page: "login",
        element: "login-form",
        text: "Giriş Yap",
        style: "primary",
        visible: true,
        enabled: true,
        action: "login",
      },
      {
        id: "register-btn",
        page: "register",
        element: "register-form",
        text: "Kayıt Ol",
        style: "primary",
        visible: true,
        enabled: true,
        action: "register",
      },
      {
        id: "join-btn",
        page: "clone",
        element: "hero",
        text: "Hemen Katıl",
        style: "primary",
        visible: true,
        enabled: true,
        action: "join",
      },
    ]);
  };

  const loadContentBlocks = async () => {
    // Mock data for content blocks
    setContentBlocks([
      {
        id: "hero-1",
        type: "hero",
        title: "Ana Hero",
        content: "Manevi gelişim ve finansal özgürlük",
        position: 1,
        visible: true,
        page: "home",
      },
      {
        id: "feature-1",
        type: "feature",
        title: "Özellikler",
        content: "7 seviyeli nefis mertebeleri",
        position: 2,
        visible: true,
        page: "home",
      },
    ]);
  };

  const loadSystemConfig = async () => {
    // Load current system configuration
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/system-config", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSystemConfig({ ...systemConfig, ...data.config });
        }
      }
    } catch (error) {
      console.error("Error loading system config:", error);
    }
  };

  const createUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/create-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserForm),
      });

      if (response.ok) {
        alert("Kullanıcı başarıyla oluşturuldu!");
        setNewUserForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          role: "member",
          sponsorId: "",
          careerLevel: "1",
          membershipType: "entry",
          initialBalance: 0,
        });
        loadUsers();
      } else {
        const error = await response.json();
        alert(`Hata: ${error.error}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Kullanıcı oluşturma sırasında hata oluştu.");
    }
  };

  const updateSystemConfig = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/system-config", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(systemConfig),
      });

      if (response.ok) {
        alert("Sistem ayarları güncellendi!");
      } else {
        alert("Sistem ayarları güncellenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error updating system config:", error);
    }
  };

  const updateMenuConfig = async (
    menuId: string,
    updates: Partial<MenuConfig>,
  ) => {
    setMenuConfig((prev) =>
      prev.map((menu) => (menu.id === menuId ? { ...menu, ...updates } : menu)),
    );

    try {
      const token = localStorage.getItem("authToken");
      await fetch("/api/auth/admin/menu-config", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menuId, updates }),
      });
    } catch (error) {
      console.error("Error updating menu config:", error);
    }
  };

  const updateButtonConfig = async (
    buttonId: string,
    updates: Partial<ButtonConfig>,
  ) => {
    setButtonConfig((prev) =>
      prev.map((button) =>
        button.id === buttonId ? { ...button, ...updates } : button,
      ),
    );

    try {
      const token = localStorage.getItem("authToken");
      await fetch("/api/auth/admin/button-config", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ buttonId, updates }),
      });
    } catch (error) {
      console.error("Error updating button config:", error);
    }
  };

  const updateContentBlock = async (
    blockId: string,
    updates: Partial<ContentBlock>,
  ) => {
    setContentBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block,
      ),
    );

    try {
      const token = localStorage.getItem("authToken");
      await fetch("/api/auth/admin/content-blocks", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blockId, updates }),
      });
    } catch (error) {
      console.error("Error updating content block:", error);
    }
  };

  const initializeDatabase = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/init-database", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(databaseSchema),
      });

      if (response.ok) {
        alert("Veritabanı şeması başarıyla oluşturuldu!");
      } else {
        alert("Veritabanı oluşturma sırasında hata oluştu.");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  };

  const deployToProduction = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/deploy-production", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deploymentConfig),
      });

      if (response.ok) {
        alert("Sistem başar��yla canlı ortama aktarıldı!");
        setDeploymentConfig((prev) => ({ ...prev, envProduction: true }));
      } else {
        alert("Canlı yayına alma sırasında hata oluştu.");
      }
    } catch (error) {
      console.error("Error deploying to production:", error);
    }
  };

  // Spiritual Content Management Functions
  const loadSpiritualContent = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/spiritual-content", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSpiritualContent(data.content || {
          quranJuzList: [],
          hadiths: [],
          sunnahs: [],
          spiritualSciences: [],
          meaningfulQuotes: [],
          zodiacSigns: []
        });
      }
    } catch (error) {
      console.error("Error loading spiritual content:", error);
    }
  };

  const addHadith = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/spiritual-content/hadith", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHadith),
      });

      if (response.ok) {
        alert("Hadis başarıyla eklendi!");
        setNewHadith({
          arabic: "",
          translation: "",
          source: "",
          category: "",
          explanation: "",
          narrator: "",
          bookNumber: ""
        });
        loadSpiritualContent();
      } else {
        alert("Hadis eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error adding hadith:", error);
    }
  };

  const addSunnah = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/spiritual-content/sunnah", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSunnah),
      });

      if (response.ok) {
        alert("Sünnet başarıyla eklendi!");
        setNewSunnah({
          title: "",
          description: "",
          time: "",
          reward: "",
          evidence: "",
          subcategory: "",
          details: []
        });
        loadSpiritualContent();
      } else {
        alert("Sünnet eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error adding sunnah:", error);
    }
  };

  const addQuote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/admin/spiritual-content/quote", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuote),
      });

      if (response.ok) {
        alert("Anlamlı söz başarıyla eklendi!");
        setNewQuote({
          text: "",
          author: "",
          category: ""
        });
        loadSpiritualContent();
      } else {
        alert("Anlamlı söz eklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Error adding quote:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-spiritual-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Admin paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-spiritual-purple bg-clip-text text-transparent">
                  Kapsamlı Admin Paneli
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant={
                  systemStats.systemHealth === "healthy"
                    ? "default"
                    : "destructive"
                }
              >
                {systemStats.systemHealth === "healthy"
                  ? "Sistem Sağlıklı"
                  : "Sistem Uyarısı"}
              </Badge>
              <Button
                onClick={() => navigate("/member-panel")}
                variant="outline"
                size="sm"
              >
                Üye Paneli
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" size="sm">
                Ana Sayfa
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger
              value="dashboard"
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Kullanıcılar</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Ürünler</span>
            </TabsTrigger>
            <TabsTrigger
              value="ui-control"
              className="flex items-center space-x-2"
            >
              <Layout className="w-4 h-4" />
              <span>UI Kontrolü</span>
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>İçerik</span>
            </TabsTrigger>
            <TabsTrigger
              value="spiritual"
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Manevi</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Veritabanı</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Sistem</span>
            </TabsTrigger>
            <TabsTrigger
              value="deployment"
              className="flex items-center space-x-2"
            >
              <Server className="w-4 h-4" />
              <span>Canlı Yayın</span>
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="flex items-center space-x-2"
            >
              <Monitor className="w-4 h-4" />
              <span>Monitoring</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Kullanıcı
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.totalUsers}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.activeUsers} aktif
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Toplam Gelir
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${systemStats.totalRevenue}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.pendingPayments} bekleyen ödeme
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sistem Durumu
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.systemHealth === "healthy" ? "✅" : "⚠️"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {systemStats.serverUptime}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Çağrıları
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemStats.apiCalls}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    DB: {systemStats.databaseSize}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                  <CardDescription>
                    Sık kullanılan admin işlemleri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => setActiveTab("users")}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Kullanıcı
                    </Button>
                    <Button
                      onClick={() => setActiveTab("content")}
                      variant="outline"
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      İçerik Düzenle
                    </Button>
                    <Button
                      onClick={() => setActiveTab("system")}
                      variant="outline"
                      className="w-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Sistem Ayarları
                    </Button>
                    <Button
                      onClick={() => setActiveTab("deployment")}
                      variant="outline"
                      className="w-full"
                    >
                      <Server className="w-4 h-4 mr-2" />
                      Canlı Yayın
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                  <CardDescription>
                    Sistem üzerindeki son hareketler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Yeni kullanıcı kaydı: Test User
                      </span>
                      <Badge variant="outline" className="text-xs">
                        2 dk önce
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">
                        Sistem ayarları güncellendi
                      </span>
                      <Badge variant="outline" className="text-xs">
                        5 dk önce
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Backup işlemi tamamlandı</span>
                      <Badge variant="outline" className="text-xs">
                        1 saat önce
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı & Üyelik Sistemi Kurulumu</CardTitle>
                <CardDescription>
                  Yeni üye kayıt modülü - Otomatik ID üretimi (ak000001,
                  ak000002...)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Ad Soyad</Label>
                        <Input
                          id="fullName"
                          value={newUserForm.fullName}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Kullanıcı adı ve soyadı"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              email: e.target.value,
                            })
                          }
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={newUserForm.phone}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+90 555 123 4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">Şifre</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUserForm.password}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              password: e.target.value,
                            })
                          }
                          placeholder="En az 6 karakter"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Rol</Label>
                        <Select
                          value={newUserForm.role}
                          onValueChange={(value) =>
                            setNewUserForm({ ...newUserForm, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Rol seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Üye</SelectItem>
                            <SelectItem value="leader">Lider</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="sponsorId">Sponsor ID</Label>
                        <Input
                          id="sponsorId"
                          value={newUserForm.sponsorId}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              sponsorId: e.target.value,
                            })
                          }
                          placeholder="Sponsor kullanıcı ID'si"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="careerLevel">Kariyer Seviyesi</Label>
                        <Select
                          value={newUserForm.careerLevel}
                          onValueChange={(value) =>
                            setNewUserForm({
                              ...newUserForm,
                              careerLevel: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seviye seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Nefs-i Emmare</SelectItem>
                            <SelectItem value="2">Nefs-i Levvame</SelectItem>
                            <SelectItem value="3">Nefs-i Mülhime</SelectItem>
                            <SelectItem value="4">Nefs-i Mutmainne</SelectItem>
                            <SelectItem value="5">Nefs-i Râziye</SelectItem>
                            <SelectItem value="6">Nefs-i Mardiyye</SelectItem>
                            <SelectItem value="7">Nefs-i Kâmile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="membershipType">Üyelik Tipi</Label>
                        <Select
                          value={newUserForm.membershipType}
                          onValueChange={(value) =>
                            setNewUserForm({
                              ...newUserForm,
                              membershipType: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tip seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Giriş Paketi</SelectItem>
                            <SelectItem value="monthly">
                              Aylık Aktiflik
                            </SelectItem>
                            <SelectItem value="yearly">
                              Yıllık Aktiflik
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="initialBalance">
                        Başlangıç Bakiyesi ($)
                      </Label>
                      <Input
                        id="initialBalance"
                        type="number"
                        value={newUserForm.initialBalance}
                        onChange={(e) =>
                          setNewUserForm({
                            ...newUserForm,
                            initialBalance: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                    </div>

                    <Button onClick={createUser} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Kullanıc�� Oluştur (Otomatik ID: ak
                      {String(users.length + 1).padStart(6, "0")})
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      Aktif/Pasif Statü Tanımlama
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium mb-2">Statü Kuralları</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Aktif: Aylık ödeme yapan üyeler</li>
                          <li>• Pasif: Ödeme yapmayan üyeler</li>
                          <li>• Otomatik: Ödeme durumuna göre güncelleme</li>
                          <li>• Manuel: Admin tarafından elle ayarlama</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Otomatik statü güncellemesi
                          </span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">E-posta bildirimleri</span>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            Sponsor bilgilendirmesi
                          </span>
                          <Switch checked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Existing Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Mevcut Kullanıcılar</CardTitle>
                <CardDescription>
                  Sistemde kayıtlı tüm kullanıcılar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Üye ID</TableHead>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>E-posta</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Statü</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono">
                          {user.memberId}
                        </TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "destructive"}
                          >
                            {user.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.registrationDate).toLocaleDateString(
                            "tr-TR",
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-primary/10 to-spiritual-purple/10 border-primary/20">
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Ürün Kataloğu</h3>
                  <p className="text-sm text-gray-600 mb-3">Müşteri görünümünü inceleyin</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/products', '_blank')}
                  >
                    Kataloğu Görüntüle
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-spiritual-gold/10 to-primary/10 border-spiritual-gold/20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-8 h-8 text-spiritual-gold mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Satış İstatistikleri</h3>
                  <p className="text-sm text-gray-600 mb-3">Ürün performansını takip edin</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Satış istatistikleri yakında eklenecek")}
                  >
                    İstatistikleri Gör
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
                <CardContent className="p-4 text-center">
                  <Network className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Komisyon Takibi</h3>
                  <p className="text-sm text-gray-600 mb-3">MLM dağıtım kontrolü</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert("Komisyon takibi yakında eklenecek")}
                  >
                    Komisyon Raporu
                  </Button>
                </CardContent>
              </Card>
            </div>

            <AdminProductManagement />
          </TabsContent>

          {/* UI Control Tab */}
          <TabsContent value="ui-control" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Menü Yönetimi</CardTitle>
                  <CardDescription>
                    Tüm sayfalardaki menü öğelerini yönetin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuConfig.map((menu) => (
                      <div key={menu.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">{menu.label}</span>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={menu.visible}
                              onCheckedChange={(checked) =>
                                updateMenuConfig(menu.id, { visible: checked })
                              }
                            />
                            <Badge variant="outline">{menu.href}</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={menu.label}
                            onChange={(e) =>
                              updateMenuConfig(menu.id, {
                                label: e.target.value,
                              })
                            }
                            placeholder="Menü etiketi"
                          />
                          <Input
                            type="number"
                            value={menu.order}
                            onChange={(e) =>
                              updateMenuConfig(menu.id, {
                                order: parseInt(e.target.value),
                              })
                            }
                            placeholder="Sıra"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buton Yönetimi</CardTitle>
                  <CardDescription>
                    Tüm sayfalardaki butonları kontrol edin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {buttonConfig.map((button) => (
                      <div key={button.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium">{button.text}</span>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={button.visible}
                              onCheckedChange={(checked) =>
                                updateButtonConfig(button.id, {
                                  visible: checked,
                                })
                              }
                            />
                            <Switch
                              checked={button.enabled}
                              onCheckedChange={(checked) =>
                                updateButtonConfig(button.id, {
                                  enabled: checked,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={button.text}
                            onChange={(e) =>
                              updateButtonConfig(button.id, {
                                text: e.target.value,
                              })
                            }
                            placeholder="Buton metni"
                          />
                          <Select
                            value={button.style}
                            onValueChange={(value: any) =>
                              updateButtonConfig(button.id, { style: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="primary">Primary</SelectItem>
                              <SelectItem value="secondary">
                                Secondary
                              </SelectItem>
                              <SelectItem value="outline">Outline</SelectItem>
                              <SelectItem value="destructive">
                                Destructive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Badge variant="outline" className="mt-2">
                          {button.page} - {button.element}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İçerik Blokları Yönetimi</CardTitle>
                <CardDescription>
                  Tüm sayfalardaki içerik bloklarını düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {contentBlocks.map((block) => (
                    <div key={block.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Badge>{block.type}</Badge>
                          <span className="font-medium">{block.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={block.visible}
                            onCheckedChange={(checked) =>
                              updateContentBlock(block.id, { visible: checked })
                            }
                          />
                          <Badge variant="outline">{block.page}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label>Başlık</Label>
                          <Input
                            value={block.title}
                            onChange={(e) =>
                              updateContentBlock(block.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Başlık"
                          />
                        </div>
                        <div>
                          <Label>Pozisyon</Label>
                          <Input
                            type="number"
                            value={block.position}
                            onChange={(e) =>
                              updateContentBlock(block.id, {
                                position: parseInt(e.target.value),
                              })
                            }
                            placeholder="Pozisyon"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>İçerik</Label>
                        <Textarea
                          value={block.content}
                          onChange={(e) =>
                            updateContentBlock(block.id, {
                              content: e.target.value,
                            })
                          }
                          placeholder="İçerik metni"
                          rows={4}
                        />
                      </div>

                      {block.type === "hero" && (
                        <div className="mt-4">
                          <Label>Görsel URL</Label>
                          <Input
                            value={block.image || ""}
                            onChange={(e) =>
                              updateContentBlock(block.id, {
                                image: e.target.value,
                              })
                            }
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni ��çerik Bloğu Ekle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spiritual Content Management Tab */}
          <TabsContent value="spiritual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Hadis Ekleme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="w-5 h-5" />
                    Hadis Yönetimi
                  </CardTitle>
                  <CardDescription>
                    Yeni hadis ekle ve mevcut hadisleri düzenle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="hadithArabic">Arapça Metin</Label>
                    <Textarea
                      id="hadithArabic"
                      value={newHadith.arabic}
                      onChange={(e) => setNewHadith({...newHadith, arabic: e.target.value})}
                      placeholder="Hadis-i şerifin Arapça metni"
                      className="font-arabic text-right"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hadithTranslation">Türkçe Çeviri</Label>
                    <Textarea
                      id="hadithTranslation"
                      value={newHadith.translation}
                      onChange={(e) => setNewHadith({...newHadith, translation: e.target.value})}
                      placeholder="Hadisin Türkçe çevirisi"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hadithSource">Kaynak</Label>
                      <Input
                        id="hadithSource"
                        value={newHadith.source}
                        onChange={(e) => setNewHadith({...newHadith, source: e.target.value})}
                        placeholder="Buhari, Muslim vb."
                      />
                    </div>
                    <div>
                      <Label htmlFor="hadithCategory">Kategori</Label>
                      <Input
                        id="hadithCategory"
                        value={newHadith.category}
                        onChange={(e) => setNewHadith({...newHadith, category: e.target.value})}
                        placeholder="Ahlak, İbadet vb."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="hadithExplanation">Açıklama</Label>
                    <Textarea
                      id="hadithExplanation"
                      value={newHadith.explanation}
                      onChange={(e) => setNewHadith({...newHadith, explanation: e.target.value})}
                      placeholder="Hadisin açıklaması ve yorumu"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hadithNarrator">Ravi</Label>
                      <Input
                        id="hadithNarrator"
                        value={newHadith.narrator}
                        onChange={(e) => setNewHadith({...newHadith, narrator: e.target.value})}
                        placeholder="Hz. Ebu Hüreyre (r.a.)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hadithBookNumber">Kitap No</Label>
                      <Input
                        id="hadithBookNumber"
                        value={newHadith.bookNumber}
                        onChange={(e) => setNewHadith({...newHadith, bookNumber: e.target.value})}
                        placeholder="Buhari 1, Muslim 1907"
                      />
                    </div>
                  </div>
                  <Button onClick={addHadith} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Hadis Ekle
                  </Button>
                </CardContent>
              </Card>

              {/* Sünnet Ekleme */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Sünnet Yönetimi
                  </CardTitle>
                  <CardDescription>
                    Yeni sünnet ekle ve mevcut sünnetleri düzenle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sunnahTitle">Başlık</Label>
                    <Input
                      id="sunnahTitle"
                      value={newSunnah.title}
                      onChange={(e) => setNewSunnah({...newSunnah, title: e.target.value})}
                      placeholder="Misvak Kullanmak"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sunnahDescription">Açıklama</Label>
                    <Textarea
                      id="sunnahDescription"
                      value={newSunnah.description}
                      onChange={(e) => setNewSunnah({...newSunnah, description: e.target.value})}
                      placeholder="Sünnetin detaylı açıklaması"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sunnahTime">Zamanı</Label>
                      <Input
                        id="sunnahTime"
                        value={newSunnah.time}
                        onChange={(e) => setNewSunnah({...newSunnah, time: e.target.value})}
                        placeholder="Her namaz öncesi"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sunnahSubcategory">Alt Kategori</Label>
                      <Input
                        id="sunnahSubcategory"
                        value={newSunnah.subcategory}
                        onChange={(e) => setNewSunnah({...newSunnah, subcategory: e.target.value})}
                        placeholder="Temizlik, Ahlak vb."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="sunnahReward">Faydası</Label>
                    <Input
                      id="sunnahReward"
                      value={newSunnah.reward}
                      onChange={(e) => setNewSunnah({...newSunnah, reward: e.target.value})}
                      placeholder="Ağzın temizlenmesi ve Allah'ın rızası"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sunnahEvidence">Delil</Label>
                    <Textarea
                      id="sunnahEvidence"
                      value={newSunnah.evidence}
                      onChange={(e) => setNewSunnah({...newSunnah, evidence: e.target.value})}
                      placeholder="Hadis veya ayet referansı"
                    />
                  </div>
                  <Button onClick={addSunnah} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Sünnet Ekle
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Anlamlı Sözler ve YouTube Yönetimi */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Anlamlı Sözler Yönetimi
                  </CardTitle>
                  <CardDescription>
                    İslam büyüklerinden hikmetli sözler ekle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quoteText">Söz</Label>
                    <Textarea
                      id="quoteText"
                      value={newQuote.text}
                      onChange={(e) => setNewQuote({...newQuote, text: e.target.value})}
                      placeholder="Hikmetli söz veya dua"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quoteAuthor">Yazar</Label>
                      <Input
                        id="quoteAuthor"
                        value={newQuote.author}
                        onChange={(e) => setNewQuote({...newQuote, author: e.target.value})}
                        placeholder="İmam Gazzali, Hz. Ali vb."
                      />
                    </div>
                    <div>
                      <Label htmlFor="quoteCategory">Kategori</Label>
                      <Input
                        id="quoteCategory"
                        value={newQuote.category}
                        onChange={(e) => setNewQuote({...newQuote, category: e.target.value})}
                        placeholder="Zikir, Sabır, İlim vb."
                      />
                    </div>
                  </div>
                  <Button onClick={addQuote} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Anlamlı Söz Ekle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    YouTube Kur'an Cüzleri Yönetimi
                  </CardTitle>
                  <CardDescription>
                    Ahmet el Acemi cüz linklerini güncelle
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Mevcut Playlist:</h4>
                    <p className="text-sm text-green-700 mb-2">
                      Ahmet el Acemi Kur'an Cüzleri - 30 Cüz Tam Playlist
                    </p>
                    <a
                      href="https://www.youtube.com/watch?v=B5KwA5gukHA&list=PLUJuhUbtCMFPO3bAPVeG_taebSHH3KIS7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      YouTube Playlist'i Görüntüle
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Özellikler:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 30 Cüz tamamı mevcut</li>
                      <li>• Otomatik playlist yönlendirmesi</li>
                      <li>• Her cüz için ayrı link</li>
                      <li>• Mobil uyumlu açılım</li>
                    </ul>
                  </div>

                  <Button className="w-full" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Manevi Panel'i Test Et
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Rüya Tabiri Sembol Yönetimi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Rüya Tabiri Sembol Yönetimi
                </CardTitle>
                <CardDescription>
                  Rüya sembollerini ve anlamlarını yönet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Mevcut Semboller:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["su", "ateş", "rüzgar", "toprak", "kedi", "köpek", "yılan", "kuş", "aslan", "anne", "baba", "çocuk"].map(symbol => (
                        <Badge key={symbol} variant="outline" className="text-xs">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Kategori</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="">Kategori Seçin</option>
                        <option value="nature">Doğa ve Elementler</option>
                        <option value="animals">Hayvanlar</option>
                        <option value="people">İnsanlar ve İlişkiler</option>
                        <option value="objects">Nesneler</option>
                        <option value="colors">Renkler</option>
                      </select>
                    </div>
                    <div>
                      <Label>Sembol Adı</Label>
                      <Input placeholder="Yeni sembol adı" />
                    </div>
                    <div>
                      <Label>Temel Anlam</Label>
                      <Input placeholder="Sembolün temel anlamı" />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Rüya Sembolü Ekle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Veritaban���� Yapısının Olu��turulması</CardTitle>
                <CardDescription>
                  Aşağıdaki tablolarla veritaban�� şeması oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Tablo Şemaları</h3>

                    <Accordion type="single" collapsible>
                      <AccordionItem value="users">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.users}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    users: checked,
                                  })
                                }
                              />
                            </div>
                            <span>users - Üye Bilgileri</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>id (string) - Benzersiz kullanıcı ID</li>
                              <li>
                                memberId (string) - Üye numarası (ak000001...)
                              </li>
                              <li>fullName (string) - Ad soyad</li>
                              <li>email (string) - E-posta adresi</li>
                              <li>phone (string) - Telefon numarası</li>
                              <li>password (string) - Şifrelenmiş şifre</li>
                              <li>role (string) - Kullanıcı rolü</li>
                              <li>isActive (boolean) - Aktif/pasif statü</li>
                              <li>sponsorId (string) - Sponsor kullanıcı ID</li>
                              <li>registrationDate (date) - Kayıt tarihi</li>
                              <li>
                                careerLevel (object) - Kariyer seviyesi
                                bilgileri
                              </li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="wallets">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.wallets}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    wallets: checked,
                                  })
                                }
                              />
                            </div>
                            <span>wallets - E-cüzdan Bakiyesi</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>userId (string) - Kullanıcı ID referansı</li>
                              <li>balance (number) - Mevcut bakiye</li>
                              <li>totalEarnings (number) - Toplam kazanç</li>
                              <li>sponsorBonus (number) - Sponsor bonusu</li>
                              <li>careerBonus (number) - Kariyer bonusu</li>
                              <li>passiveIncome (number) - Pasif gelir</li>
                              <li>
                                leadershipBonus (number) - Liderlik bonusu
                              </li>
                              <li>
                                lastUpdated (date) - Son güncelleme tarihi
                              </li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="payments">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.payments}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    payments: checked,
                                  })
                                }
                              />
                            </div>
                            <span>
                              payments - Yatırım ve Aktiflik Ödemeleri
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>id (string) - Ödeme ID</li>
                              <li>userId (string) - Kullanıcı ID referansı</li>
                              <li>
                                type (string) - Ödeme tipi
                                (entry/monthly/yearly)
                              </li>
                              <li>amount (number) - Ödeme miktarı</li>
                              <li>status (string) - Ödeme durumu</li>
                              <li>method (string) - Ödeme yöntemi</li>
                              <li>requestDate (date) - Talep tarihi</li>
                              <li>processedDate (date) - İşlem tarihi</li>
                              <li>receipt (string) - Makbuz/fiş</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="commissions">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.commissions}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    commissions: checked,
                                  })
                                }
                              />
                            </div>
                            <span>commissions - Tüm Kazançlar</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>id (string) - Komisyon ID</li>
                              <li>userId (string) - Alıcı kullanıcı ID</li>
                              <li>
                                sourceUserId (string) - Kaynak kullanıcı ID
                              </li>
                              <li>type (string) - Komisyon tipi</li>
                              <li>amount (number) - Komisyon miktarı</li>
                              <li>
                                level (number) - Seviye (sponsor, kariyer vs.)
                              </li>
                              <li>calculatedDate (date) - Hesaplama tarihi</li>
                              <li>paidDate (date) - Ödeme tarihi</li>
                              <li>status (string) - Durum</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="content">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.content}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    content: checked,
                                  })
                                }
                              />
                            </div>
                            <span>content - Manevi Gelişim İçerikleri</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>id (string) - İçerik ID</li>
                              <li>title (string) - İçerik başlığı</li>
                              <li>content (text) - İçerik metni</li>
                              <li>type (string) - İçerik tipi</li>
                              <li>category (string) - Kategori</li>
                              <li>level (number) - Seviye</li>
                              <li>isPublished (boolean) - Yayın durumu</li>
                              <li>authorId (string) - Yazar ID</li>
                              <li>createdDate (date) - Oluşturma tarihi</li>
                              <li>updatedDate (date) - Güncelleme tarihi</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="logs">
                        <AccordionTrigger>
                          <div className="flex items-center space-x-2">
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center"
                            >
                              <Switch
                                checked={databaseSchema.logs}
                                onCheckedChange={(checked) =>
                                  setDatabaseSchema({
                                    ...databaseSchema,
                                    logs: checked,
                                  })
                                }
                              />
                            </div>
                            <span>
                              logs - Sistemsel İşlemler ve Aktiviteler
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Alanlar:</strong>
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              <li>id (string) - Log ID</li>
                              <li>userId (string) - Kullanıcı ID</li>
                              <li>action (string) - Gerçekleştirilen işlem</li>
                              <li>details (text) - İşlem detayları</li>
                              <li>ipAddress (string) - IP adresi</li>
                              <li>userAgent (string) - Tarayıcı bilgisi</li>
                              <li>sessionId (string) - Oturum ID</li>
                              <li>timestamp (date) - İşlem zamanı</li>
                              <li>level (string) - Log seviyesi</li>
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Veritabanı İşlemleri</h3>

                    <div className="space-y-3">
                      <Button onClick={initializeDatabase} className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Seçili Tabloları Oluştur
                      </Button>

                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Veritabanı Yedeği Al
                      </Button>

                      <Button variant="outline" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Yedekten Geri Yükle
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Veritabanın�� Sıfırla
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Veritabanını Sıfırla
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem tüm verileri silecektir. Bu işlem geri
                              alınamaz. Devam etmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction>Sıfırla</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <h4 className="font-medium mb-2">Veritabanı Durumu</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Boyut:</span>
                          <span>{systemStats.databaseSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Toplam Kayıt:</span>
                          <span>{systemStats.totalUsers * 6} kayıt</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Son Backup:</span>
                          <span>2 saat önce</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Yapılandırması</CardTitle>
                <CardDescription>
                  Genel sistem ayarları ve konfigürasyonlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteName">Site Adı</Label>
                      <Input
                        id="siteName"
                        value={systemConfig.siteName}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            siteName: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="siteDescription">Site Açıklaması</Label>
                      <Textarea
                        id="siteDescription"
                        value={systemConfig.siteDescription}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            siteDescription: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="logoUrl">Logo URL</Label>
                      <Input
                        id="logoUrl"
                        value={systemConfig.logoUrl}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            logoUrl: e.target.value,
                          })
                        }
                        placeholder="https://example.com/logo.png"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Ana Renk</Label>
                        <Input
                          id="primaryColor"
                          type="color"
                          value={systemConfig.primaryColor}
                          onChange={(e) =>
                            setSystemConfig({
                              ...systemConfig,
                              primaryColor: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor">İkincil Renk</Label>
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={systemConfig.secondaryColor}
                          onChange={(e) =>
                            setSystemConfig({
                              ...systemConfig,
                              secondaryColor: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="maxCapacity">Maksimum Kapasite</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        value={systemConfig.maxCapacity}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            maxCapacity: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="environment">Ortam</Label>
                      <Select
                        value={systemConfig.environment}
                        onValueChange={(value: any) =>
                          setSystemConfig({
                            ...systemConfig,
                            environment: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">
                            Development
                          </SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Kayıt Açık</Label>
                        <Switch
                          checked={systemConfig.registrationEnabled}
                          onCheckedChange={(checked) =>
                            setSystemConfig({
                              ...systemConfig,
                              registrationEnabled: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Bakım Modu</Label>
                        <Switch
                          checked={systemConfig.maintenanceMode}
                          onCheckedChange={(checked) =>
                            setSystemConfig({
                              ...systemConfig,
                              maintenanceMode: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Otomatik Yerleştirme</Label>
                        <Switch
                          checked={systemConfig.autoPlacement}
                          onCheckedChange={(checked) =>
                            setSystemConfig({
                              ...systemConfig,
                              autoPlacement: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>SSL Aktif</Label>
                        <Switch
                          checked={systemConfig.sslEnabled}
                          onCheckedChange={(checked) =>
                            setSystemConfig({
                              ...systemConfig,
                              sslEnabled: checked,
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={updateSystemConfig} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Ayarları Kaydet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canlı Yayına Alma Süreci</CardTitle>
                <CardDescription>
                  Web sayfasını canlı ortama uygun hale getirin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Hazırlık Adımları</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">
                              Test API'lerini Kapat
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Tüm test endpoint'lerini devre dışı bırak
                            </p>
                          </div>
                          <Switch
                            checked={!deploymentConfig.testMode}
                            onCheckedChange={(checked) =>
                              setDeploymentConfig({
                                ...deploymentConfig,
                                testMode: !checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">
                              .env Üretim Ayarları
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Environment variables üretim için ayarla
                            </p>
                          </div>
                          <Switch
                            checked={deploymentConfig.envProduction}
                            onCheckedChange={(checked) =>
                              setDeploymentConfig({
                                ...deploymentConfig,
                                envProduction: checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">
                              SSL (HTTPS) Aktif
                            </span>
                            <p className="text-sm text-muted-foreground">
                              SSL sertifikası kurulumu ve yönlendirme
                            </p>
                          </div>
                          <Switch
                            checked={deploymentConfig.sslActive}
                            onCheckedChange={(checked) =>
                              setDeploymentConfig({
                                ...deploymentConfig,
                                sslActive: checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">
                              Domain Yapılandırması
                            </span>
                            <p className="text-sm text-muted-foreground">
                              DNS ayarları ve domain yönlendirmesi
                            </p>
                          </div>
                          <Switch
                            checked={deploymentConfig.domainConfigured}
                            onCheckedChange={(checked) =>
                              setDeploymentConfig({
                                ...deploymentConfig,
                                domainConfigured: checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">Backup Sistemi</span>
                            <p className="text-sm text-muted-foreground">
                              Otomatik yedekleme aktif
                            </p>
                          </div>
                          <Switch
                            checked={deploymentConfig.backupEnabled}
                            onCheckedChange={(checked) =>
                              setDeploymentConfig({
                                ...deploymentConfig,
                                backupEnabled: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Deployment Durumu</h3>
                      <div className="space-y-4">
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Mevcut Durum</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Ortam:</span>
                              <Badge
                                variant={
                                  systemConfig.environment === "production"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {systemConfig.environment}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>SSL:</span>
                              <Badge
                                variant={
                                  deploymentConfig.sslActive
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {deploymentConfig.sslActive ? "Aktif" : "Pasif"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Backup:</span>
                              <Badge
                                variant={
                                  deploymentConfig.backupEnabled
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {deploymentConfig.backupEnabled
                                  ? "Aktif"
                                  : "Pasif"}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">
                            Gerekli .env Değişkenleri
                          </h4>
                          <div className="space-y-1 text-xs font-mono">
                            <p>NODE_ENV=production</p>
                            <p>DATABASE_URL=***</p>
                            <p>JWT_SECRET=***</p>
                            <p>JWT_REFRESH_SECRET=***</p>
                            <p>SSL_CERT_PATH=***</p>
                            <p>SSL_KEY_PATH=***</p>
                            <p>DOMAIN_NAME=***</p>
                          </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-medium mb-2">Son Kontroller</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            <li>✅ Database bağlantısı test edildi</li>
                            <li>✅ API endpoint'leri kontrol edildi</li>
                            <li>✅ SSL sertifikası doğrulandı</li>
                            <li>✅ Backup sistemi çalışıyor</li>
                            <li>⚠️ Performance testi yapılacak</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="text-center space-y-4">
                      <h3 className="text-lg font-semibold">
                        Canlı Yayın Kontrolü
                      </h3>
                      <p className="text-muted-foreground">
                        Tüm adımları tamamladıktan sonra sistemi canlı yayına
                        alabilirsiniz.
                      </p>

                      {deploymentConfig.envProduction &&
                      deploymentConfig.sslActive &&
                      deploymentConfig.domainConfigured ? (
                        <Button
                          onClick={deployToProduction}
                          size="lg"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Power className="w-5 h-5 mr-2" />
                          Canlı Yayına Al
                        </Button>
                      ) : (
                        <Button disabled size="lg">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Önce Tüm Adımları Tamamlayın
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Performansı</CardTitle>
                  <CardDescription>
                    Gerçek zamanlı sistem metrikleri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>CPU Kullanımı</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-1/3 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">33%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Bellek Kullanımı</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">50%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Disk Kullanımı</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-muted rounded-full">
                          <div className="w-1/4 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm">25%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Network I/O</span>
                      <div className="flex items-center space-x-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Normal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktif Bağlantılar</CardTitle>
                  <CardDescription>Anlık kullanıcı aktivitesi</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Aktif Oturumlar</span>
                      <Badge>24</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Son 1 Saatte Giriş</span>
                      <Badge variant="secondary">12</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>API Çağrılar��/dk</span>
                      <Badge variant="outline">156</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Hata Oranı</span>
                      <Badge variant="destructive">0.2%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sistem Logları</CardTitle>
                <CardDescription>Son sistem etkinlikleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="text-xs font-mono space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-xs">
                        INFO
                      </Badge>
                      <span className="text-muted-foreground">
                        2024-01-21 22:50:30
                      </span>
                      <span>User login successful: test@test.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        DEBUG
                      </Badge>
                      <span className="text-muted-foreground">
                        2024-01-21 22:50:25
                      </span>
                      <span>API request: POST /api/auth/login</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="text-xs">
                        INFO
                      </Badge>
                      <span className="text-muted-foreground">
                        2024-01-21 22:50:20
                      </span>
                      <span>New user registration: Test User</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        WARN
                      </Badge>
                      <span className="text-muted-foreground">
                        2024-01-21 22:45:10
                      </span>
                      <span>High memory usage detected: 85%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="text-xs">
                        ERROR
                      </Badge>
                      <span className="text-muted-foreground">
                        2024-01-21 22:40:05
                      </span>
                      <span>Database connection timeout recovered</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
