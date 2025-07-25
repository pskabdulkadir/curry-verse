import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Crown, Loader2, CheckCircle, Star, DollarSign } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const MEMBERSHIP_PACKAGES = [
  {
    id: "entry",
    name: "Giriş Paketi",
    price: 100,
    duration: "Tek seferlik",
    type: "entry",
    features: [
      "Sistem aktivasyonu",
      "Kişisel klon sayfa",
      "Manevi panel erişimi",
      "Gerçek kazanç takibi",
      "Binary sistem dahil",
    ],
    popular: false,
  },
  {
    id: "monthly",
    name: "Aylık Aktiflik",
    price: 20,
    duration: "Aylık",
    type: "monthly",
    features: [
      "Komisyon hakları",
      "Tüm özellikler aktif",
      "MLM sistem erişimi",
      "Klon sayfa yönetimi",
      "Destek sistemi",
      "Manevi içerik erişimi",
    ],
    popular: true,
  },
  {
    id: "yearly",
    name: "Yıllık Plan",
    price: 200,
    duration: "Yıllık",
    type: "yearly",
    originalPrice: 240,
    discount: 15,
    features: [
      "Tüm aylık özellikler",
      "%15 indirim avantajı",
      "Ek bonuslar",
      "Safiye üyeler için +%1",
      "Öncelikli destek",
      "Ekstra manevi içerik",
    ],
    popular: false,
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sponsorCode = searchParams.get("sponsor");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    sponsorCode: sponsorCode || "",
    selectedPackage: "entry",
    bankDetails: {
      bankName: "",
      accountNumber: "",
      iban: "",
      accountHolderName: "",
    },
    spiritualInfo: {
      motherName: "",
      birthDate: "",
      address: "",
    },
  });
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (registrationData.password !== registrationData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    if (registrationData.password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setStep(2);
  };

  const handlePackageSelection = (packageId: string) => {
    setRegistrationData({
      ...registrationData,
      selectedPackage: packageId,
    });
    setStep(3);
  };

  const handleFinalRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: registrationData.fullName,
          email: registrationData.email,
          phone: registrationData.phone,
          password: registrationData.password,
          sponsorCode: registrationData.sponsorCode,
          membershipType: registrationData.selectedPackage,
        }),
      });

      const userData = await response.json();

      if (response.ok && userData.success) {
        setRegisteredUser(userData.user);

        // Create membership purchase request
        const selectedPackage = MEMBERSHIP_PACKAGES.find(
          (pkg) => pkg.id === registrationData.selectedPackage,
        );

        if (selectedPackage) {
          await fetch("/api/membership/purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userData.user.id,
              packageType: selectedPackage.type,
              paymentMethod: "bank_transfer",
              bankReceipt: null, // Will be uploaded later
            }),
          });
        }

        setStep(4);
      } else {
        alert(userData.error || "Kayıt başarısız");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Kayıt sırasında hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = MEMBERSHIP_PACKAGES.find(
    (pkg) => pkg.id === registrationData.selectedPackage,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-spiritual-purple bg-clip-text text-transparent">
              Kutbul Zaman
            </span>
          </Link>
          <p className="text-foreground/60 mt-2">
            Manevi Rehberim - MLM Sistemi
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="w-16 h-1 bg-muted">
              <div
                className={`h-full bg-primary transition-all ${
                  step >= 2 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <div className="w-16 h-1 bg-muted">
              <div
                className={`h-full bg-primary transition-all ${
                  step >= 3 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
            <div className="w-16 h-1 bg-muted">
              <div
                className={`h-full bg-primary transition-all ${
                  step >= 4 ? "w-full" : "w-0"
                }`}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 4
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              4
            </div>
          </div>
        </div>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
              <CardDescription>
                MLM sistemine katılmak için bilgilerinizi girin
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePersonalInfoSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Ad Soyad</Label>
                    <Input
                      id="fullName"
                      required
                      value={registrationData.fullName}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={registrationData.email}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={registrationData.phone}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sponsorCode">
                      Sponsor Kodu{" "}
                      {sponsorCode ? "✅ Otomatik Dolduruldu" : "(Opsiyonel)"}
                    </Label>
                    {sponsorCode && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
                        <p className="text-green-800 text-sm font-semibold">
                          🎯 Sponsor otomatik olarak tespit edildi:{" "}
                          <span className="font-bold">{sponsorCode}</span>
                        </p>
                        <p className="text-green-700 text-xs mt-1">
                          Bu klon sayfadan geldiğiniz için sponsor kodunuz
                          otomatik olarak ayarlandı.
                        </p>
                      </div>
                    )}
                    <Input
                      id="sponsorCode"
                      value={registrationData.sponsorCode}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          sponsorCode: e.target.value,
                        })
                      }
                      placeholder={
                        sponsorCode ? sponsorCode : "Sponsor kodunu girin"
                      }
                      className={
                        sponsorCode ? "border-green-300 bg-green-50" : ""
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Şifre</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={registrationData.password}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      minLength={6}
                      value={registrationData.confirmPassword}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motherName">
                      Anne Adı (Manevi hesaplamalar için)
                    </Label>
                    <Input
                      id="motherName"
                      value={registrationData.spiritualInfo.motherName}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          spiritualInfo: {
                            ...registrationData.spiritualInfo,
                            motherName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Doğum Tarihi</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={registrationData.spiritualInfo.birthDate}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          spiritualInfo: {
                            ...registrationData.spiritualInfo,
                            birthDate: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link to="/login">
                  <Button variant="outline">Zaten hesabım var</Button>
                </Link>
                <Button type="submit">Devam Et</Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 2: Package Selection */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Üyelik Paketini Seçin</h2>
              <p className="text-muted-foreground">
                MLM sistemine katılmak için bir paket seçmeniz gerekiyor
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {MEMBERSHIP_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    pkg.popular ? "ring-2 ring-primary" : ""
                  } ${
                    registrationData.selectedPackage === pkg.id
                      ? "bg-primary/5 border-primary"
                      : ""
                  }`}
                  onClick={() => handlePackageSelection(pkg.id)}
                >
                  {pkg.popular && (
                    <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                      En Popüler
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-primary">
                        ${pkg.price}
                        {pkg.originalPrice && (
                          <span className="text-lg line-through text-muted-foreground ml-2">
                            ${pkg.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {pkg.duration}
                        {pkg.discount && (
                          <span className="ml-2 text-green-600 font-medium">
                            %{pkg.discount} indirim
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      Bu Paketi Seç
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Geri Dön
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Information */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Ödeme Bilgileri</CardTitle>
              <CardDescription>
                Seçtiğiniz paket: {selectedPackage?.name} - $
                {selectedPackage?.price}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleFinalRegistration}>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Banka Havalesi Bilgileri</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ödemenizi aşağıdaki hesaba yapabilirsiniz:
                  </p>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Hesap Adı:</strong> Kutbul Zaman MLM
                    </p>
                    <p>
                      <strong>IBAN:</strong> TR00 0000 0000 0000 0000 0000 00
                    </p>
                    <p>
                      <strong>Banka:</strong> Türkiye İş Bankası
                    </p>
                    <p>
                      <strong>Tutar:</strong> ${selectedPackage?.price}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">
                    Kişisel Banka Bilgileriniz
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bankName">Banka Adı</Label>
                      <Input
                        id="bankName"
                        value={registrationData.bankDetails.bankName}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            bankDetails: {
                              ...registrationData.bankDetails,
                              bankName: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolderName">Hesap Sahibi</Label>
                      <Input
                        id="accountHolderName"
                        value={registrationData.bankDetails.accountHolderName}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            bankDetails: {
                              ...registrationData.bankDetails,
                              accountHolderName: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="accountNumber">Hesap Numarası</Label>
                      <Input
                        id="accountNumber"
                        value={registrationData.bankDetails.accountNumber}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            bankDetails: {
                              ...registrationData.bankDetails,
                              accountNumber: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="iban">IBAN</Label>
                      <Input
                        id="iban"
                        value={registrationData.bankDetails.iban}
                        onChange={(e) =>
                          setRegistrationData({
                            ...registrationData,
                            bankDetails: {
                              ...registrationData.bankDetails,
                              iban: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Geri Dön
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Kayıt Ol ve Ödeme Yap
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Step 4: Success */}
        {step === 4 && registeredUser && (
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Kayıt Başarılı!</CardTitle>
              <CardDescription>
                Kutbul Zaman MLM sistemine hoş geldiniz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Hesap Bilgileriniz</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Ad Soyad:</strong> {registeredUser.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {registeredUser.email}
                  </p>
                  <p>
                    <strong>Referans Kodunuz:</strong>{" "}
                    {registeredUser.referralCode}
                  </p>
                  <p>
                    <strong>Seçilen Paket:</strong> {selectedPackage?.name}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">
                  Sonraki Adımlar
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                  <li>Ödemenizi yukarıdaki hesap bilgilerine yapın</li>
                  <li>Ödeme dekontunu sisteme yükleyin</li>
                  <li>Admin onayından sonra üyeliğiniz aktifleşecek</li>
                  <li>Klon sayfanızı paylaşarak alt ekip oluşturun</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Klon Sayfanız
                </h3>
                <p className="text-sm text-blue-700">
                  Referans linkiniz:
                  <code className="bg-blue-100 px-2 py-1 rounded ml-2">
                    {window.location.origin}/clone/
                    {registeredUser.referralCode.toLowerCase()}
                  </code>
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/login">
                <Button>Sisteme Giriş Yap</Button>
              </Link>
            </CardFooter>
          </Card>
        )}

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
