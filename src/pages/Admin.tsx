import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mountain, Home, Utensils, Car, LogOut, Plus, Pencil, Trash2, Star, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface Apartment {
  id: string;
  title: string;
  location: string;
  location_key: string;
  price: number;
  rating: number | null;
  guests: number | null;
  description: string | null;
  phone: string | null;
  is_active: boolean | null;
}

interface Cafe {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  cuisine_key: string;
  rating: number | null;
  price_range: string | null;
  description: string | null;
  phone: string | null;
  is_active: boolean | null;
}

interface TaxiService {
  id: string;
  name: string;
  phone: string;
  description: string | null;
  rating: number | null;
  verified: boolean | null;
  is_active: boolean | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [taxiServices, setTaxiServices] = useState<TaxiService[]>([]);

  // Form states
  const [apartmentForm, setApartmentForm] = useState({
    title: "", location: "", location_key: "terskol", price: 0, guests: 2, description: "", phone: ""
  });
  const [cafeForm, setCafeForm] = useState({
    name: "", location: "", cuisine: "", cuisine_key: "national", price_range: "₽₽", description: "", phone: ""
  });
  const [taxiForm, setTaxiForm] = useState({
    name: "", phone: "", description: "", verified: true
  });

  const [editingApartment, setEditingApartment] = useState<string | null>(null);
  const [editingCafe, setEditingCafe] = useState<string | null>(null);
  const [editingTaxi, setEditingTaxi] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState({ apartment: false, cafe: false, taxi: false });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
    setIsAdmin(data === true);
    setLoading(false);
    if (data === true) {
      fetchData();
    }
  };

  const fetchData = async () => {
    const [aptRes, cafeRes, taxiRes] = await Promise.all([
      supabase.from("apartments").select("*").order("created_at", { ascending: false }),
      supabase.from("cafes").select("*").order("created_at", { ascending: false }),
      supabase.from("taxi_services").select("*").order("created_at", { ascending: false }),
    ]);

    if (aptRes.data) setApartments(aptRes.data);
    if (cafeRes.data) setCafes(cafeRes.data);
    if (taxiRes.data) setTaxiServices(taxiRes.data);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Выход выполнен" });
    navigate("/");
  };

  // Apartment CRUD
  const handleSaveApartment = async () => {
    const data = {
      ...apartmentForm,
      location: apartmentForm.location_key === 'terskol' ? 'Терскол' : 
                apartmentForm.location_key === 'azau' ? 'Азау' : 'Байдаево'
    };

    if (editingApartment) {
      await supabase.from("apartments").update(data).eq("id", editingApartment);
      toast({ title: "Жильё обновлено" });
    } else {
      await supabase.from("apartments").insert(data);
      toast({ title: "Жильё добавлено" });
    }

    setDialogOpen({ ...dialogOpen, apartment: false });
    setEditingApartment(null);
    setApartmentForm({ title: "", location: "", location_key: "terskol", price: 0, guests: 2, description: "", phone: "" });
    fetchData();
  };

  const handleDeleteApartment = async (id: string) => {
    await supabase.from("apartments").delete().eq("id", id);
    toast({ title: "Жильё удалено" });
    fetchData();
  };

  // Cafe CRUD
  const handleSaveCafe = async () => {
    if (editingCafe) {
      await supabase.from("cafes").update(cafeForm).eq("id", editingCafe);
      toast({ title: "Кафе обновлено" });
    } else {
      await supabase.from("cafes").insert(cafeForm);
      toast({ title: "Кафе добавлено" });
    }

    setDialogOpen({ ...dialogOpen, cafe: false });
    setEditingCafe(null);
    setCafeForm({ name: "", location: "", cuisine: "", cuisine_key: "national", price_range: "₽₽", description: "", phone: "" });
    fetchData();
  };

  const handleDeleteCafe = async (id: string) => {
    await supabase.from("cafes").delete().eq("id", id);
    toast({ title: "Кафе удалено" });
    fetchData();
  };

  // Taxi CRUD
  const handleSaveTaxi = async () => {
    if (editingTaxi) {
      await supabase.from("taxi_services").update(taxiForm).eq("id", editingTaxi);
      toast({ title: "Такси обновлено" });
    } else {
      await supabase.from("taxi_services").insert(taxiForm);
      toast({ title: "Такси добавлено" });
    }

    setDialogOpen({ ...dialogOpen, taxi: false });
    setEditingTaxi(null);
    setTaxiForm({ name: "", phone: "", description: "", verified: true });
    fetchData();
  };

  const handleDeleteTaxi = async (id: string) => {
    await supabase.from("taxi_services").delete().eq("id", id);
    toast({ title: "Такси удалено" });
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Доступ ограничен</CardTitle>
            <CardDescription>
              У вас нет прав администратора. Обратитесь к администратору для получения доступа.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mountain className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-xl font-display font-bold">Панель управления</h1>
                <p className="text-sm text-primary-foreground/70">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="border-primary-foreground/30 hover:bg-primary-foreground/10">
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="apartments" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="apartments" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Жильё ({apartments.length})
            </TabsTrigger>
            <TabsTrigger value="cafes" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Кафе ({cafes.length})
            </TabsTrigger>
            <TabsTrigger value="taxi" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Такси ({taxiServices.length})
            </TabsTrigger>
          </TabsList>

          {/* Apartments Tab */}
          <TabsContent value="apartments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление жильём</CardTitle>
                    <CardDescription>Добавляйте и редактируйте квартиры и апартаменты</CardDescription>
                  </div>
                  <Dialog open={dialogOpen.apartment} onOpenChange={(open) => {
                    setDialogOpen({ ...dialogOpen, apartment: open });
                    if (!open) {
                      setEditingApartment(null);
                      setApartmentForm({ title: "", location: "", location_key: "terskol", price: 0, guests: 2, description: "", phone: "" });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-2" />Добавить</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingApartment ? "Редактировать" : "Добавить"} жильё</DialogTitle>
                        <DialogDescription>Заполните информацию о жилье</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Название</Label>
                          <Input value={apartmentForm.title} onChange={(e) => setApartmentForm({ ...apartmentForm, title: e.target.value })} />
                        </div>
                        <div>
                          <Label>Посёлок</Label>
                          <Select value={apartmentForm.location_key} onValueChange={(v) => setApartmentForm({ ...apartmentForm, location_key: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="terskol">Терскол</SelectItem>
                              <SelectItem value="azau">Азау</SelectItem>
                              <SelectItem value="baidaevo">Байдаево</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Цена (₽/сутки)</Label>
                            <Input type="number" value={apartmentForm.price} onChange={(e) => setApartmentForm({ ...apartmentForm, price: Number(e.target.value) })} />
                          </div>
                          <div>
                            <Label>Гостей</Label>
                            <Input type="number" value={apartmentForm.guests} onChange={(e) => setApartmentForm({ ...apartmentForm, guests: Number(e.target.value) })} />
                          </div>
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input value={apartmentForm.phone} onChange={(e) => setApartmentForm({ ...apartmentForm, phone: e.target.value })} />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea value={apartmentForm.description} onChange={(e) => setApartmentForm({ ...apartmentForm, description: e.target.value })} />
                        </div>
                        <Button onClick={handleSaveApartment} className="w-full">
                          <Check className="w-4 h-4 mr-2" />Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Посёлок</TableHead>
                      <TableHead>Цена</TableHead>
                      <TableHead>Рейтинг</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apartments.map((apt) => (
                      <TableRow key={apt.id}>
                        <TableCell className="font-medium">{apt.title}</TableCell>
                        <TableCell>{apt.location}</TableCell>
                        <TableCell>{apt.price.toLocaleString()} ₽</TableCell>
                        <TableCell><Star className="w-4 h-4 inline text-accent mr-1" />{apt.rating}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingApartment(apt.id);
                            setApartmentForm({
                              title: apt.title,
                              location: apt.location,
                              location_key: apt.location_key,
                              price: apt.price,
                              guests: apt.guests ?? 2,
                              description: apt.description ?? "",
                              phone: apt.phone ?? ""
                            });
                            setDialogOpen({ ...dialogOpen, apartment: true });
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteApartment(apt.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cafes Tab */}
          <TabsContent value="cafes">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление кафе</CardTitle>
                    <CardDescription>Добавляйте и редактируйте рестораны и кафе</CardDescription>
                  </div>
                  <Dialog open={dialogOpen.cafe} onOpenChange={(open) => {
                    setDialogOpen({ ...dialogOpen, cafe: open });
                    if (!open) {
                      setEditingCafe(null);
                      setCafeForm({ name: "", location: "", cuisine: "", cuisine_key: "national", price_range: "₽₽", description: "", phone: "" });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-2" />Добавить</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCafe ? "Редактировать" : "Добавить"} кафе</DialogTitle>
                        <DialogDescription>Заполните информацию о кафе</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Название</Label>
                          <Input value={cafeForm.name} onChange={(e) => setCafeForm({ ...cafeForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label>Адрес</Label>
                          <Input value={cafeForm.location} onChange={(e) => setCafeForm({ ...cafeForm, location: e.target.value })} />
                        </div>
                        <div>
                          <Label>Тип кухни</Label>
                          <Select value={cafeForm.cuisine_key} onValueChange={(v) => setCafeForm({ ...cafeForm, cuisine_key: v, cuisine: v === 'national' ? 'Национальная кухня' : v === 'european' ? 'Европейская' : 'Фастфуд' })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="national">Национальная кухня</SelectItem>
                              <SelectItem value="european">Европейская</SelectItem>
                              <SelectItem value="fastfood">Фастфуд</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Ценовой диапазон</Label>
                          <Select value={cafeForm.price_range} onValueChange={(v) => setCafeForm({ ...cafeForm, price_range: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="₽">₽</SelectItem>
                              <SelectItem value="₽₽">₽₽</SelectItem>
                              <SelectItem value="₽₽₽">₽₽₽</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input value={cafeForm.phone} onChange={(e) => setCafeForm({ ...cafeForm, phone: e.target.value })} />
                        </div>
                        <div>
                          <Label>Описание</Label>
                          <Textarea value={cafeForm.description} onChange={(e) => setCafeForm({ ...cafeForm, description: e.target.value })} />
                        </div>
                        <Button onClick={handleSaveCafe} className="w-full">
                          <Check className="w-4 h-4 mr-2" />Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Адрес</TableHead>
                      <TableHead>Кухня</TableHead>
                      <TableHead>Рейтинг</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cafes.map((cafe) => (
                      <TableRow key={cafe.id}>
                        <TableCell className="font-medium">{cafe.name}</TableCell>
                        <TableCell>{cafe.location}</TableCell>
                        <TableCell>{cafe.cuisine}</TableCell>
                        <TableCell><Star className="w-4 h-4 inline text-accent mr-1" />{cafe.rating}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingCafe(cafe.id);
                            setCafeForm({
                              name: cafe.name,
                              location: cafe.location,
                              cuisine: cafe.cuisine,
                              cuisine_key: cafe.cuisine_key,
                              price_range: cafe.price_range ?? "₽₽",
                              description: cafe.description ?? "",
                              phone: cafe.phone ?? ""
                            });
                            setDialogOpen({ ...dialogOpen, cafe: true });
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteCafe(cafe.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxi Tab */}
          <TabsContent value="taxi">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Управление такси</CardTitle>
                    <CardDescription>Добавляйте и редактируйте службы такси</CardDescription>
                  </div>
                  <Dialog open={dialogOpen.taxi} onOpenChange={(open) => {
                    setDialogOpen({ ...dialogOpen, taxi: open });
                    if (!open) {
                      setEditingTaxi(null);
                      setTaxiForm({ name: "", phone: "", description: "", verified: true });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-2" />Добавить</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTaxi ? "Редактировать" : "Добавить"} такси</DialogTitle>
                        <DialogDescription>Заполните информацию о водителе</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Имя водителя</Label>
                          <Input value={taxiForm.name} onChange={(e) => setTaxiForm({ ...taxiForm, name: e.target.value })} />
                        </div>
                        <div>
                          <Label>Телефон</Label>
                          <Input value={taxiForm.phone} onChange={(e) => setTaxiForm({ ...taxiForm, phone: e.target.value })} placeholder="+7 928 123-45-67" />
                        </div>
                        <div>
                          <Label>Описание услуг</Label>
                          <Textarea value={taxiForm.description} onChange={(e) => setTaxiForm({ ...taxiForm, description: e.target.value })} />
                        </div>
                        <Button onClick={handleSaveTaxi} className="w-full">
                          <Check className="w-4 h-4 mr-2" />Сохранить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Рейтинг</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taxiServices.map((taxi) => (
                      <TableRow key={taxi.id}>
                        <TableCell className="font-medium">{taxi.name}</TableCell>
                        <TableCell>{taxi.phone}</TableCell>
                        <TableCell className="max-w-xs truncate">{taxi.description}</TableCell>
                        <TableCell><Star className="w-4 h-4 inline text-accent mr-1" />{taxi.rating}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setEditingTaxi(taxi.id);
                            setTaxiForm({
                              name: taxi.name,
                              phone: taxi.phone,
                              description: taxi.description ?? "",
                              verified: taxi.verified ?? true
                            });
                            setDialogOpen({ ...dialogOpen, taxi: true });
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTaxi(taxi.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
