import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Users,
  TrendingUp,
  Heart,
  Crown,
  Zap,
  Shield,
  Award,
  ShoppingCart,
  Eye,
  Package,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

interface Product {
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
}

const membershipPackages = [
  {
    name: "Giriş Paketi",
    price: "$100",
    description: "Sisteme başlangıç için ideal",
    features: [
      "Sistem aktivasyonu",
      "Kişisel klon sayfa",
      "Manevi panel erişimi",
      "Gerçek kazanç takibi",
    ],
    buttonText: "Başla",
    popular: false,
  },
  {
    name: "Aylık Aktiflik",
    price: "$20",
    period: "/ay",
    description: "Sürekli kazanç için aktif kal",
    features: [
      "Komisyon hakları",
      "Tüm içerik erişimi",
      "Pasif gelir sistemi",
      "Manevi rehberlik",
    ],
    buttonText: "Aktif Ol",
    popular: true,
  },
  {
    name: "Yıllık Aktiflik",
    price: "$200",
    period: "/yıl",
    description: "En avantajlı paket",
    features: [
      "Tüm aylık haklar",
      "%15 indirim",
      "Ek bonuslar",
      "Safiye üyelere +%1",
    ],
    buttonText: "Yıllık Seç",
    popular: false,
  },
];

const careerLevels = [
  {
    name: "Emmare",
    requirement: "Giriş seviyesi",
    commission: "%2",
    pasive: "0%",
  },
  {
    name: "Levvame",
    requirement: "2 direkt + $500",
    commission: "%3",
    pasive: "0.5%",
  },
  {
    name: "Mülhime",
    requirement: "4 aktif + $1500",
    commission: "%4",
    pasive: "1%",
  },
  {
    name: "Mutmainne",
    requirement: "10 ekip + $3000",
    commission: "%5",
    pasive: "1.5%",
  },
  {
    name: "Radiyye",
    requirement: "2 lider + $5000",
    commission: "%6",
    pasive: "2%",
  },
  {
    name: "Mardiyye",
    requirement: "50 üye + $10000",
    commission: "%8",
    pasive: "3%",
  },
  {
    name: "Safiye",
    requirement: "3 lider + $25000",
    commission: "%12",
    pasive: "4%",
  },
];

const features = [
  {
    icon: Users,
    title: "Binary Network",
    description: "7 derinliğe kadar komisyon kazanın",
  },
  {
    icon: TrendingUp,
    title: "Otomatik Yerleştirme",
    description: "Sponsor kodu yoksa zayıf bacağa otomatik yerleşim",
  },
  {
    icon: Shield,
    title: "100.000 Kişi Kapasitesi",
    description: "Büyük ölçekli network desteği",
  },
  {
    icon: Heart,
    title: "Manevi Gelişim",
    description: "Ruhsal ve finansal büyüme bir arada",
  },
];

export default function Index() {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || 'ak0000001'; // Default to admin

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success && data.products) {
        // Show only the first 6 products as featured
        setFeaturedProducts(data.products.slice(0, 6));
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const calculateDiscount = (product: Product) => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-spiritual-purple bg-clip-text text-transparent">
                  Kutbul Zaman
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Ana Sayfa
              </Link>
              <Link
                to="/sistem"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Sistem
              </Link>
              <Link
                to="/manevi-panel"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Manevi Panel
              </Link>
              <Link
                to="/kazanc"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Kazanç Paneli
              </Link>
              <Link
                to="/products"
                className="text-foreground/80 hover:text-foreground transition-colors font-semibold"
              >
                🛍️ Ürünler
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/member-panel">
                <Button variant="outline" size="sm">
                  Üye Paneli
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Kayıt Ol</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-spiritual-purple/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-spiritual-purple to-spiritual-gold bg-clip-text text-transparent">
                Manevi Rehberim
              </span>
            </h1>
            <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Manevi değerlere ve sürdürülebilir büyümeye dayalı modüler MLM
              sistemi. Hem finansal hem ruhsal gelişimi teşvik eder, üyeleri
              birey ve topluluk olarak geliştirir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-spiritual-purple hover:opacity-90"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Sistemine Katıl
                </Button>
              </Link>
              <Link to="/kazanc">
                <Button size="lg" variant="outline">
                  Kazançları Görüntüle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sistem Özellikleri
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Modern teknoloji ile manevi değerleri birleştiren güçlü platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all"
              >
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Product Collection - Dynamic Section */}
      <section className="py-16 bg-gradient-to-r from-spiritual-gold/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              🛍️ Premium Ürün Koleksiyonu
            </h2>
            <p className="text-xl text-foreground/80 mb-8">
              Kaliteli ürünlerden alışveriş yapın ve otomatik komisyon kazanın!
              Her satışta sistemdeki tüm üyeler kazanır.
            </p>

            {/* Referral Banner */}
            {referralCode !== 'ak0000001' && (
              <div className="bg-gradient-to-r from-spiritual-purple/10 to-primary/10 rounded-lg p-4 mb-6 max-w-2xl mx-auto border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">
                  🎯 Özel Davet: <strong>{referralCode}</strong> sponsorluğunda alışveriş yapıyorsunuz
                </p>
                <p className="text-xs text-foreground/70">
                  Alışverişlerinizde sponsorunuz otomatik komisyon kazanacak!
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-spiritual-gold to-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">40%</span>
                </div>
                <h3 className="font-semibold mb-2">Üye Komisyonları</h3>
                <p className="text-sm text-gray-600">Her satıştan %40 üyelere otomatik dağıtılır</p>
              </div>

              <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Premium Kalite</h3>
                <p className="text-sm text-gray-600">Dünya markalarından seçilmiş ürünler</p>
              </div>

              <div className="bg-white/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Anında İşlem</h3>
                <p className="text-sm text-gray-600">Satış anında komisyon dağıtımı</p>
              </div>
            </div>
          </div>

          {/* Dynamic Product Showcase */}
          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spiritual-gold"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/60 backdrop-blur-sm border-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-spiritual-gold text-white">
                          {product.category}
                        </Badge>
                      </div>
                      {calculateDiscount(product) > 0 && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500 text-white">
                            %{calculateDiscount(product)} İndirim
                          </Badge>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="secondary" className="text-lg">
                            Stokta Yok
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "text-spiritual-gold fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            ${product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.originalPrice}
                            </span>
                          )}
                          <p className="text-xs text-spiritual-gold font-medium">
                            Komisyon: ${Math.round(product.price * 0.4)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/products?product=${product.id}${referralCode !== 'ak0000001' ? '&ref=' + referralCode : ''}`}
                          className="flex-1"
                        >
                          <Button
                            className="w-full bg-gradient-to-r from-spiritual-gold to-primary hover:opacity-90"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.inStock ? "Satın Al" : "Stokta Yok"}
                          </Button>
                        </Link>
                        <Link to={`/products?product=${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link to={`/products${referralCode !== 'ak0000001' ? '?ref=' + referralCode : ''}`}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-spiritual-gold to-spiritual-gold/80 hover:from-spiritual-gold/90 hover:to-spiritual-gold/70 text-white px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Package className="w-6 h-6 mr-3" />
                    Tüm Ürünleri Görüntüle ({featuredProducts.length > 6 ? `${featuredProducts.length - 6}+ Daha Fazla` : 'Koleksiyonu Keşfet'})
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Henüz Ürün Eklenmemiş
              </h3>
              <p className="text-gray-500 mb-6">
                Admin panelinden ürün ekleyerek koleksiyonu oluşturun
              </p>
              <Link to={`/products${referralCode !== 'ak0000001' ? '?ref=' + referralCode : ''}`}>
                <Button variant="outline">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ürünler Sayfasına Git
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Membership Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Üyelik Paketleri
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Size uygun paketi seçin ve manevi yolculuğunuza başlayın
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {membershipPackages.map((pkg, index) => (
              <Card
                key={index}
                className={`relative border-border/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all ${pkg.popular ? "ring-2 ring-primary" : ""}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-spiritual-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                      Popüler
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {pkg.price}
                    {pkg.period && (
                      <span className="text-lg text-foreground/60">
                        {pkg.period}
                      </span>
                    )}
                  </div>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Star className="w-4 h-4 text-spiritual-gold mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/register" className="w-full">
                    <Button
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      {pkg.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career System */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              7 Manevi Mertebe
            </h2>
            <p className="text-foreground/80 max-w-2xl mx-auto">
              Ruhsal gelişim ile finansal başarıyı birleştiren kariyer sistemi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {careerLevels.map((level, index) => (
              <Card
                key={index}
                className="border-border/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all"
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-spiritual-purple rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{level.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="text-center">
                    <p className="text-foreground/80">{level.requirement}</p>
                    <div className="flex justify-between mt-3">
                      <span className="text-spiritual-gold font-medium">
                        Prim: {level.commission}
                      </span>
                      <span className="text-spiritual-emerald font-medium">
                        Pasif: {level.pasive}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-spiritual-purple rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-spiritual-purple bg-clip-text text-transparent">
                Kutbul Zaman
              </span>
            </div>
            <p className="text-foreground/60 mb-6">
              Manevi değerlerle sürdürülebilir büyüme
            </p>
            <div className="flex justify-center space-x-6 text-sm text-foreground/60">
              <Link
                to="/gizlilik"
                className="hover:text-foreground transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <Link
                to="/kullanim"
                className="hover:text-foreground transition-colors"
              >
                Kullanım Şartları
              </Link>
              <Link
                to="/destek"
                className="hover:text-foreground transition-colors"
              >
                Destek
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
