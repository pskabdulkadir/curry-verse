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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Crown,
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Copy,
  Eye,
  Award,
  Wallet,
  Network,
  MessageSquare,
  Settings,
  Link,
  QrCode,
  Target,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  Plus,
  Edit,
  Smartphone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Send,
  LinkIcon,
  Globe,
  Image,
  Palette,
  Save,
} from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

interface User {
  id: string;
  memberId: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  membershipType: string;
  isActive: boolean;
  totalInvestment: number;
  directReferrals: number;
  totalTeamSize: number;
  wallet: {
    balance: number;
    totalEarnings: number;
    sponsorBonus: number;
    careerBonus: number;
    passiveIncome: number;
    leadershipBonus: number;
  };
  careerLevel: {
    name: string;
    commissionRate: number;
  };
  registrationDate: string;
  referralCode: string;
  sponsorId?: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
}

interface TeamMember {
  id: string;
  memberId: string;
  fullName: string;
  email: string;
  careerLevel: string;
  totalInvestment: number;
  directReferrals: number;
  registrationDate: string;
  isActive: boolean;
  level: number;
  position: "left" | "right" | "direct";
}

export default function MemberPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [clonePageUrl, setClonePageUrl] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [shareStats, setShareStats] = useState({
    visits: 0,
    conversions: 0,
    conversionRate: 0,
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [clonePageSettings, setClonePageSettings] = useState({
    headerColor: "#3B82F6",
    buttonColor: "#10B981",
    backgroundColor: "#F8FAFC",
    showTestimonials: true,
    showFeatures: true,
    customCss: "",
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const currentUserData = localStorage.getItem("currentUser");
      const authToken = localStorage.getItem("authToken");

      if (!currentUserData) {
        navigate("/login");
        return;
      }

      const currentUser = JSON.parse(currentUserData);
      if (!currentUser.id) {
        navigate("/login");
        return;
      }

      // If we don't have an authToken, that's okay for older functionality
      // But some new features will require proper login
      if (!authToken) {
        console.warn(
          "No auth token found - some features may not work properly",
        );
      }

      await fetchUserData(currentUser.id);
    } catch (error) {
      console.error("Authentication check failed:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (clonePageUrl) {
      generateQRCode();
    }
  }, [clonePageUrl]);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserInfo(userId),
        fetchTransactions(userId),
        fetchTeamMembers(userId),
        fetchClonePageInfo(userId),
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setClonePageUrl(
            `${window.location.origin}/clone/${data.user.memberId}`,
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/transactions`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  };

  const fetchTeamMembers = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/team`);
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.team || []);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers([]);
    }
  };

  const fetchClonePageInfo = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/my-clone-page", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCustomMessage(data.clonePage.customizations?.customMessage || "");
          setClonePageUrl(data.cloneUrl);
          setShareStats({
            visits: data.clonePage.visitCount || 0,
            conversions: data.clonePage.conversionCount || 0,
            conversionRate:
              data.clonePage.visitCount > 0
                ? (data.clonePage.conversionCount / data.clonePage.visitCount) *
                  100
                : 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching clone page info:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Link kopyalandı!");
  };

  const updateCustomMessage = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/my-clone-page", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customMessage }),
      });

      if (response.ok) {
        alert("Özel mesajınız güncellendi!");
      }
    } catch (error) {
      console.error("Error updating custom message:", error);
      alert("Güncelleme hatası!");
    }
  };

  const shareViaWhatsApp = () => {
    const message = `${user?.fullName} üzerinden Kutbul Zaman'a katılın! Manevi gelişim ve finansal özgürlük için: ${clonePageUrl}`;
    window.open(
      `whatsapp://send?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const shareViaEmail = () => {
    const subject = "Kutbul Zaman Daveti";
    const body = `Merhaba,\n\n${user?.fullName} üzerinden Kutbul Zaman platformuna katılmanızı istiyorum. Bu platform hem manevi gelişim hem de finansal özgürlük sunuyor.\n\nKatılmak için: ${clonePageUrl}\n\nSaygılarımla,\n${user?.fullName}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      "_blank",
    );
  };

  const generateQRCode = () => {
    // Using QR Server API for QR code generation
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(clonePageUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `${user?.memberId}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareViaInstagram = () => {
    const text = `${user?.fullName} üzerinden Kutbul Zaman'a katılın! Manevi gelişim ve finansal özgürlük için: ${clonePageUrl}`;
    // Instagram doesn't have direct URL sharing, copy to clipboard
    navigator.clipboard.writeText(text);
    alert(
      "Instagram paylaşımı için metin kopyalandı! Instagram'da paylaşabilirsiniz.",
    );
  };

  const shareViaTwitter = () => {
    const text = `${user?.fullName} üzerinden Kutbul Zaman'a katılın! Manevi gelişim ve finansal özgürlük için:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(clonePageUrl)}`;
    window.open(url, "_blank");
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(clonePageUrl)}`;
    window.open(url, "_blank");
  };

  const shareViaTelegram = () => {
    const text = `${user?.fullName} üzerinden Kutbul Zaman'a katılın! ${clonePageUrl}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(clonePageUrl)}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const updateClonePageSettings = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/user/${user.id}/clone-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clonePageSettings),
      });

      if (response.ok) {
        alert("Klon sayfa ayarlarınız güncellendi!");
      }
    } catch (error) {
      console.error("Error updating clone page settings:", error);
      alert("Güncelleme hatası!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Üye paneliniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Erişim Hatası</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Üye bilgilerinize erişilemiyor.</p>
            <Button onClick={() => navigate("/login")}>Tekrar Giriş Yap</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <RouterLink to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-spiritual-purple bg-clip-text text-transparent">
                  Kutbul Zaman
                </span>
              </RouterLink>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">{user.fullName}</Badge>
              <Badge>{user.memberId}</Badge>
              {/* Show admin panel link if user is admin */}
              {user.role === "admin" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin-panel")}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/kazanc")}
                className="text-green-600 hover:text-green-700"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Kazançlar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  localStorage.removeItem("currentUser");
                  navigate("/");
                }}
              >
                Çıkış Yap
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Üye Paneliniz</h1>
          <p className="text-foreground/60">
            Hoş geldiniz {user.fullName} - Organizasyonunuzu büyütün ve
            kazançlarınızı takip edin
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">
                    Cüzdan Bakiyesi
                  </p>
                  <p className="text-2xl font-bold">
                    ${user.wallet.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Ekip Üyesi</p>
                  <p className="text-2xl font-bold">{user.totalTeamSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">Toplam Kazanç</p>
                  <p className="text-2xl font-bold">
                    ${user.wallet.totalEarnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">
                    Kariyer Seviyesi
                  </p>
                  <p className="text-lg font-bold">{user.careerLevel.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Ekibim</TabsTrigger>
            <TabsTrigger value="share">Paylaşım</TabsTrigger>
            <TabsTrigger value="earnings">Kazançlar</TabsTrigger>
            <TabsTrigger value="transactions">İşlemler</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kazanç Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                    <span className="text-sm font-medium">Sponsor Bonusu</span>
                    <span className="font-bold text-green-600">
                      ${user.wallet.sponsorBonus.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-sm font-medium">Kariyer Bonusu</span>
                    <span className="font-bold text-blue-600">
                      ${user.wallet.careerBonus.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                    <span className="text-sm font-medium">Pasif Gelir</span>
                    <span className="font-bold text-purple-600">
                      ${user.wallet.passiveIncome.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg">
                    <span className="text-sm font-medium">Liderlik Bonusu</span>
                    <span className="font-bold text-orange-600">
                      ${user.wallet.leadershipBonus.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hızlı Paylaşım</CardTitle>
                  <CardDescription>
                    Organizasyonunuzu büyütmek için link paylaşın
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input value={clonePageUrl} readOnly className="flex-1" />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(clonePageUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={shareViaWhatsApp}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={shareViaEmail}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Paylaşım İstatistikleri:
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold">{shareStats.visits}</p>
                        <p className="text-xs text-muted-foreground">Ziyaret</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">
                          {shareStats.conversions}
                        </p>
                        <p className="text-xs text-muted-foreground">Kayıt</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">
                          {shareStats.conversionRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Oran</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Son Ekip Üyeleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{member.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.memberId} • {member.careerLevel}
                        </p>
                      </div>
                      <Badge
                        variant={member.isActive ? "default" : "secondary"}
                      >
                        {member.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Henüz ekip üyeniz bulunmuyor. Link paylaşarak ekibinizi
                      büyütün!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Ekip Organizasyonum ({teamMembers.length})
                </CardTitle>
                <CardDescription>
                  Sizin referansınızla katılan tüm üyeler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Üye ID</TableHead>
                      <TableHead>İsim</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Seviye</TableHead>
                      <TableHead>Yatırım</TableHead>
                      <TableHead>Pozisyon</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-mono">
                          {member.memberId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {member.fullName}
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{member.careerLevel}</Badge>
                        </TableCell>
                        <TableCell>${member.totalInvestment}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.position === "direct"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {member.position === "direct"
                              ? "Direkt"
                              : member.position === "left"
                                ? "Sol Bacak"
                                : "Sağ Bacak"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={member.isActive ? "default" : "secondary"}
                          >
                            {member.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Share Tab - Enhanced Clone Page Management */}
          <TabsContent value="share" className="space-y-6">
            {/* Clone Page URL and QR Code */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Kişisel Klon Sayfanız
                  </CardTitle>
                  <CardDescription>
                    Kendi referans ID'niz ile özelleştirilmiş landing sayfanız
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <Label className="text-sm font-medium">
                      Klon Sayfa URL'iniz:
                    </Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        value={clonePageUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button onClick={() => copyToClipboard(clonePageUrl)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Üye ID'niz:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={user.memberId}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(user.memberId)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>Referans Kodunuz:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          value={user.referralCode}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={() => copyToClipboard(user.referralCode)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      className="flex-1"
                      onClick={() => window.open(clonePageUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Klon Sayfanızı Görüntüle
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(`${clonePageUrl}?preview=true`, "_blank")
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Önizleme
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    QR Kod
                  </CardTitle>
                  <CardDescription>Mobil paylaşım için QR kod</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {qrCodeUrl && (
                    <div className="text-center">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto border rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={downloadQRCode}
                      disabled={!qrCodeUrl}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      İndir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(clonePageUrl)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Sosyal Medya Paylaşımı
                </CardTitle>
                <CardDescription>
                  Klon sayfanızı farklı platformlarda paylaşın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  <Button
                    variant="outline"
                    onClick={shareViaWhatsApp}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <MessageSquare className="w-6 h-6 text-green-600" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaFacebook}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <Facebook className="w-6 h-6 text-blue-600" />
                    <span className="text-xs">Facebook</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaTwitter}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <Twitter className="w-6 h-6 text-blue-400" />
                    <span className="text-xs">Twitter</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaInstagram}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <Instagram className="w-6 h-6 text-pink-600" />
                    <span className="text-xs">Instagram</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaTelegram}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <Send className="w-6 h-6 text-blue-500" />
                    <span className="text-xs">Telegram</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={shareViaEmail}
                    className="flex flex-col h-20 space-y-1"
                  >
                    <Mail className="w-6 h-6 text-gray-600" />
                    <span className="text-xs">Email</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clone Page Customization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Edit className="w-5 h-5 mr-2" />
                    Sayfa Özelleştirme
                  </CardTitle>
                  <CardDescription>
                    Klon sayfanızın görünümünü özelleştirin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Özel Mesajınız:</Label>
                    <Textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Ziyaretçilerinize özel bir mesaj yazın..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Başlık Rengi:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="color"
                          value={clonePageSettings.headerColor}
                          onChange={(e) =>
                            setClonePageSettings({
                              ...clonePageSettings,
                              headerColor: e.target.value,
                            })
                          }
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={clonePageSettings.headerColor}
                          onChange={(e) =>
                            setClonePageSettings({
                              ...clonePageSettings,
                              headerColor: e.target.value,
                            })
                          }
                          className="flex-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Buton Rengi:</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          type="color"
                          value={clonePageSettings.buttonColor}
                          onChange={(e) =>
                            setClonePageSettings({
                              ...clonePageSettings,
                              buttonColor: e.target.value,
                            })
                          }
                          className="w-12 h-8 p-0 border-0"
                        />
                        <Input
                          value={clonePageSettings.buttonColor}
                          onChange={(e) =>
                            setClonePageSettings({
                              ...clonePageSettings,
                              buttonColor: e.target.value,
                            })
                          }
                          className="flex-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={clonePageSettings.showTestimonials}
                        onChange={(e) =>
                          setClonePageSettings({
                            ...clonePageSettings,
                            showTestimonials: e.target.checked,
                          })
                        }
                      />
                      <span>Yorumları Göster</span>
                    </Label>
                    <Label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={clonePageSettings.showFeatures}
                        onChange={(e) =>
                          setClonePageSettings({
                            ...clonePageSettings,
                            showFeatures: e.target.checked,
                          })
                        }
                      />
                      <span>Özellikleri Göster</span>
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={updateCustomMessage}>
                      <Save className="w-4 h-4 mr-2" />
                      Mesajı Kaydet
                    </Button>
                    <Button onClick={updateClonePageSettings} variant="outline">
                      <Palette className="w-4 h-4 mr-2" />
                      Tasarım�� Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Performans İstatistikleri
                  </CardTitle>
                  <CardDescription>
                    Klon sayfanızın performans verileriniz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{shareStats.visits}</p>
                      <p className="text-sm text-muted-foreground">
                        Toplam Ziyaret
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">
                        {shareStats.conversions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Yeni Kayıt
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold">
                        {shareStats.conversionRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dönüşüm Oranı
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-2">Paylaşım İpuçları:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• QR kodu kartvizitirinize ekleyin</li>
                      <li>• Sosyal medyada düzenli paylaşın</li>
                      <li>• WhatsApp durumunda paylaşın</li>
                      <li>• Email imzanıza ekleyin</li>
                      <li>• Özel mesajınızı düzenli güncelleyin</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Hızlı İşlemler</CardTitle>
                <CardDescription>
                  Sık kullanılan paylaşım ve yönetim işlemleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="default"
                    onClick={() => {
                      const authToken = localStorage.getItem("authToken");
                      if (!authToken) {
                        alert(
                          "Bu özellik için tekrar giriş yapmanız gerekiyor.",
                        );
                        navigate("/login");
                        return;
                      }
                      navigate("/e-wallet");
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    E-Cüzdan & Finansal
                  </Button>

                  <Button
                    variant="default"
                    onClick={() => {
                      const authToken = localStorage.getItem("authToken");
                      if (!authToken) {
                        alert(
                          "Bu özellik için tekrar giriş yapmanız gerekiyor.",
                        );
                        navigate("/login");
                        return;
                      }
                      navigate("/real-time-transactions");
                    }}
                    className="bg-gradient-to-r from-primary to-spiritual-purple"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Gerçek Zamanlı İşlemler
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const text = `${user?.fullName} - ${user?.memberId}\nKutbul Zaman Davet Linki:\n${clonePageUrl}`;
                      navigator.clipboard.writeText(text);
                      alert("Kartvizit metni kopyalandı!");
                    }}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Kartvizit Metni
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const emailSignature = `\n\n---\n${user?.fullName}\nKutbul Zaman Üyesi\n${clonePageUrl}`;
                      navigator.clipboard.writeText(emailSignature);
                      alert("Email imzası kopyalandı!");
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email İmzası
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Kutbul Zaman Daveti",
                          text: `${user?.fullName} üzerinden katılın!`,
                          url: clonePageUrl,
                        });
                      } else {
                        copyToClipboard(clonePageUrl);
                        alert("Link kopyalandı!");
                      }
                    }}
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Mobil Paylaş
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      window.print();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    QR Yazdır
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kazanç Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                      <span className="text-sm font-medium">
                        Sponsor Bonusu
                      </span>
                      <span className="font-bold text-green-600">
                        ${user.wallet.sponsorBonus.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                      <span className="text-sm font-medium">
                        Kariyer Bonusu
                      </span>
                      <span className="font-bold text-blue-600">
                        ${user.wallet.careerBonus.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                      <span className="text-sm font-medium">Pasif Gelir</span>
                      <span className="font-bold text-purple-600">
                        ${user.wallet.passiveIncome.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg">
                      <span className="text-sm font-medium">
                        Liderlik Bonusu
                      </span>
                      <span className="font-bold text-orange-600">
                        ${user.wallet.leadershipBonus.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kariyer İlerleme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className="text-lg p-3">
                        <Award className="w-5 h-5 mr-2" />
                        {user.careerLevel.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Mevcut Kariyer Seviyeniz
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Komisyon Oranı:</span>
                        <span className="font-bold">
                          %{user.careerLevel.commissionRate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Direkt Üye:</span>
                        <span className="font-bold">
                          {user.directReferrals}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Toplam Ekip:</span>
                        <span className="font-bold">{user.totalTeamSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Toplam Yatırım:</span>
                        <span className="font-bold">
                          ${user.totalInvestment}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>İşlem Geçmişi</CardTitle>
                <CardDescription>
                  Tüm kazanç ve ödeme işlemleriniz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tarih</TableHead>
                      <TableHead>İşlem Türü</TableHead>
                      <TableHead>Açıklama</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead>Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString(
                            "tr-TR",
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.type}</Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell
                          className={
                            transaction.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.amount >= 0 ? "+" : ""}$
                          {Math.abs(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {transaction.status === "completed"
                              ? "Tamamlandı"
                              : "Beklemede"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz işlem bulunmuyor
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profil Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Üye ID</Label>
                    <Input value={user.memberId} readOnly />
                  </div>
                  <div>
                    <Label>Ad Soyad</Label>
                    <Input value={user.fullName} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user.email} readOnly />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input value={user.phone} readOnly />
                  </div>
                  <div>
                    <Label>Kayıt Tarihi</Label>
                    <Input
                      value={new Date(user.registrationDate).toLocaleDateString(
                        "tr-TR",
                      )}
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Üyelik Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Üyelik Türü</Label>
                    <Input value={user.membershipType} readOnly />
                  </div>
                  <div>
                    <Label>Durum</Label>
                    <Input value={user.isActive ? "Aktif" : "Pasif"} readOnly />
                  </div>
                  <div>
                    <Label>Referans Kodu</Label>
                    <div className="flex space-x-2">
                      <Input value={user.referralCode} readOnly />
                      <Button
                        onClick={() => copyToClipboard(user.referralCode)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Rol</Label>
                    <Input value={user.role} readOnly />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
