import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mountain, Home, Utensils, Car, CheckCircle2 } from "lucide-react";
import { SocialWidgets } from "@/components/widgets/SocialWidgets";

const LOCATIONS = [
  { value: "terskol", label: "Терскол" },
  { value: "cheget", label: "Поляна Чегет" },
  { value: "azau", label: "Поляна Азау" },
  { value: "baidaevo", label: "Байдаево" },
  { value: "tyrnyauz", label: "Тырныауз" },
  { value: "elbrus", label: "Посёлок Эльбрус" },
  { value: "bylym", label: "Посёлок Былым" },
];

const Submit = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  // --- вход/регистрация ---
  const [authLoading, setAuthLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });

  // --- форма объявления ---
  const [type, setType] = useState<"apartment" | "cafe" | "taxi">("apartment");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [apt, setApt] = useState({
    title: "",
    location_key: "terskol",
    price: "",
    guests: "2",
    level: "apartments",
    description: "",
    phone: "",
  });
  const [cafe, setCafe] = useState({
    name: "",
    location: "",
    cuisine_key: "national",
    price_range: "₽₽",
    description: "",
    phone: "",
  });
  const [taxi, setTaxi] = useState({ name: "", phone: "", description: "" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword(loginData);
    setAuthLoading(false);
    if (error) {
      toast({ title: "Ошибка входа", description: error.message, variant: "destructive" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: { data: { full_name: registerData.name } },
    });
    setAuthLoading(false);
    if (error) {
      toast({ title: "Ошибка регистрации", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Регистрация успешна!",
        description: "Проверьте почту для подтверждения, затем войдите на этой же странице.",
      });
    }
  };

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);

    let error;
    if (type === "apartment") {
      const location = LOCATIONS.find((l) => l.value === apt.location_key)?.label ?? apt.location_key;
      ({ error } = await supabase.from("apartments").insert({
        title: apt.title,
        location,
        location_key: apt.location_key,
        price: parseInt(apt.price, 10) || 0,
        guests: parseInt(apt.guests, 10) || 2,
        level: apt.level,
        description: apt.description || null,
        phone: apt.phone || null,
        owner_id: session.user.id,
        status: "pending",
      }));
    } else if (type === "cafe") {
      const cuisineLabel =
        cafe.cuisine_key === "national"
          ? "Национальная кухня"
          : cafe.cuisine_key === "european"
          ? "Европейская кухня"
          : "Фастфуд";
      ({ error } = await supabase.from("cafes").insert({
        name: cafe.name,
        location: cafe.location,
        cuisine: cuisineLabel,
        cuisine_key: cafe.cuisine_key,
        price_range: cafe.price_range,
        description: cafe.description || null,
        phone: cafe.phone || null,
        owner_id: session.user.id,
        status: "pending",
      }));
    } else {
      ({ error } = await supabase.from("taxi_services").insert({
        name: taxi.name,
        phone: taxi.phone,
        description: taxi.description || null,
        owner_id: session.user.id,
        status: "pending",
      }));
    }

    setSubmitting(false);

    if (error) {
      toast({ title: "Не удалось отправить", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка…</div>;
  }

  // --- Не вошли: показываем вход/регистрацию прямо на странице ---
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-mountain-blue-light to-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Mountain className="w-8 h-8 text-accent" />
              <span className="text-xl font-display font-bold text-primary">Приэльбрусье 360</span>
            </div>
            <CardTitle>Разместить объявление</CardTitle>
            <CardDescription>
              Войдите или зарегистрируйтесь, чтобы разместить своё жильё, кафе или такси
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    Войти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label>Имя</Label>
                    <Input
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Пароль</Label>
                    <Input
                      type="password"
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    Зарегистрироваться
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/" className="underline">
                ← Вернуться на главную
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Вошли, но объявление уже успешно отправлено ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center px-4">
        <div className="glass-card p-10 text-center max-w-md">
          <CheckCircle2 className="w-14 h-14 text-forest-green mx-auto mb-4" />
          <h1 className="font-display text-2xl font-semibold mb-3">Объявление отправлено!</h1>
          <p className="text-muted-foreground mb-6">
            Оно появится на сайте после проверки администратором — обычно это занимает не больше
            одного дня.
          </p>
          <Link to="/" className="btn-hero-outline inline-flex bg-primary text-white">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  // --- Вошли: форма подачи объявления ---
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="section-title mb-4">Разместить объявление</h1>
          <p className="text-muted-foreground">
            Заполните форму — после проверки администратором объявление появится на сайте.
          </p>
        </div>

        <Tabs value={type} onValueChange={(v) => setType(v as typeof type)}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="apartment" className="gap-2">
              <Home className="w-4 h-4" /> Жильё
            </TabsTrigger>
            <TabsTrigger value="cafe" className="gap-2">
              <Utensils className="w-4 h-4" /> Кафе
            </TabsTrigger>
            <TabsTrigger value="taxi" className="gap-2">
              <Car className="w-4 h-4" /> Такси
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmitListing} className="glass-card p-6 space-y-4">
            <TabsContent value="apartment" className="space-y-4 mt-0">
              <div>
                <Label>Название объекта</Label>
                <Input
                  required
                  value={apt.title}
                  onChange={(e) => setApt({ ...apt, title: e.target.value })}
                  placeholder='Например, "Апартаменты с видом на Эльбрус"'
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Посёлок</Label>
                  <Select value={apt.location_key} onValueChange={(v) => setApt({ ...apt, location_key: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Тип жилья</Label>
                  <Select value={apt.level} onValueChange={(v) => setApt({ ...apt, level: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Отель</SelectItem>
                      <SelectItem value="apartments">Апартаменты</SelectItem>
                      <SelectItem value="guesthouse">Гостевой дом</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Цена за сутки, ₽</Label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={apt.price}
                    onChange={(e) => setApt({ ...apt, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Гостей до</Label>
                  <Input
                    type="number"
                    min={1}
                    value={apt.guests}
                    onChange={(e) => setApt({ ...apt, guests: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Телефон для связи</Label>
                <Input
                  required
                  value={apt.phone}
                  onChange={(e) => setApt({ ...apt, phone: e.target.value })}
                  placeholder="+7 928 715-05-71"
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={apt.description}
                  onChange={(e) => setApt({ ...apt, description: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="cafe" className="space-y-4 mt-0">
              <div>
                <Label>Название кафе</Label>
                <Input
                  required
                  value={cafe.name}
                  onChange={(e) => setCafe({ ...cafe, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Расположение (текстом)</Label>
                  <Input
                    required
                    value={cafe.location}
                    onChange={(e) => setCafe({ ...cafe, location: e.target.value })}
                    placeholder="Терскол, ул. Центральная 5"
                  />
                </div>
                <div>
                  <Label>Тип кухни</Label>
                  <Select
                    value={cafe.cuisine_key}
                    onValueChange={(v) => setCafe({ ...cafe, cuisine_key: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national">Национальная</SelectItem>
                      <SelectItem value="european">Европейская</SelectItem>
                      <SelectItem value="fastfood">Фастфуд</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Средний чек</Label>
                <Input
                  value={cafe.price_range}
                  onChange={(e) => setCafe({ ...cafe, price_range: e.target.value })}
                  placeholder="₽₽"
                />
              </div>
              <div>
                <Label>Телефон для связи</Label>
                <Input
                  required
                  value={cafe.phone}
                  onChange={(e) => setCafe({ ...cafe, phone: e.target.value })}
                  placeholder="+7 928 715-05-71"
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={cafe.description}
                  onChange={(e) => setCafe({ ...cafe, description: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="taxi" className="space-y-4 mt-0">
              <div>
                <Label>Имя / название службы</Label>
                <Input
                  required
                  value={taxi.name}
                  onChange={(e) => setTaxi({ ...taxi, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Телефон</Label>
                <Input
                  required
                  value={taxi.phone}
                  onChange={(e) => setTaxi({ ...taxi, phone: e.target.value })}
                  placeholder="+7 928 715-05-71"
                />
              </div>
              <div>
                <Label>Описание услуг</Label>
                <Textarea
                  value={taxi.description}
                  onChange={(e) => setTaxi({ ...taxi, description: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Отправка…" : "Отправить на модерацию"}
            </Button>
          </form>
        </Tabs>
      </div>
      <SocialWidgets variant="floating" />
    </div>
  );
};

export default Submit;
