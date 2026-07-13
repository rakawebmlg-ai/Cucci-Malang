'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Service, Customer, OrderItem, PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function CashierPage() {
  const router = useRouter();
  const allServices = useAppStore((s) => s.services);
  const services = allServices.filter((s) => s.isActive);
  const customers = useAppStore((s) => s.customers);
  const addOrder = useAppStore((s) => s.addOrder);
  const addPayment = useAppStore((s) => s.addPayment);

  // POS State
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  
  // Order Details State
  const [shoeType, setShoeType] = useState('Sneakers');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('Kotor sedang');
  
  // Payment State
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // 0% by default for demo
  const [amountPaid, setAmountPaid] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const tax = Math.round((subtotal - discount) * (taxRate / 100));
  const total = subtotal - discount + tax;
  const change = typeof amountPaid === 'number' ? Math.max(0, amountPaid - total) : 0;
  const remaining = typeof amountPaid === 'number' ? Math.max(0, total - amountPaid) : total;

  const paymentStatus = remaining === 0 ? 'lunas' : remaining < total ? 'dp' : 'belum_bayar';

  const filteredServices = services.filter((s) => 
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.whatsapp.includes(customerSearch)
  ).slice(0, 5); // Show max 5 results

  // Handlers
  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.serviceId === service.id);
      if (existing) {
        return prev.map((item) =>
          item.serviceId === service.id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
            : item
        );
      }
      return [...prev, {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        qty: 1,
        subtotal: service.price,
      }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.serviceId === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty, subtotal: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.serviceId !== id));
  };

  const handleCheckout = () => {
    if (!selectedCustomer) {
      toast.error('Pilih pelanggan terlebih dahulu');
      return;
    }
    if (cart.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }
    if (!brand || !color) {
      toast.error('Lengkapi data sepatu (Merek & Warna)');
      return;
    }
    
    setIsConfirmOpen(true);
  };

  const confirmOrder = () => {
    const paid = typeof amountPaid === 'number' ? amountPaid : 0;
    
    const newOrder = addOrder({
      customerId: selectedCustomer!.id,
      customerName: selectedCustomer!.name,
      customerWhatsapp: selectedCustomer!.whatsapp,
      customerAddress: selectedCustomer!.address,
      shoeType,
      brand,
      color,
      size,
      condition,
      items: cart,
      subtotal,
      discount,
      tax,
      total,
      amountPaid: paid > total ? total : paid, // Cap amount paid at total for order record
      remaining,
      paymentMethod,
      paymentStatus,
      orderStatus: 'baru',
      orderDate: new Date().toISOString(),
      estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // +3 days
    });

    if (paid > 0) {
      addPayment({
        orderId: newOrder.id,
        invoiceNumber: newOrder.invoiceNumber,
        customerName: newOrder.customerName,
        amount: paid > total ? total : paid,
        method: paymentMethod,
        status: paymentStatus,
        date: new Date().toISOString(),
      });
    }

    toast.success('Order berhasil dibuat!', {
      description: `Invoice: ${newOrder.invoiceNumber}`,
    });
    
    setIsConfirmOpen(false);
    
    // In a real app, we might open the print dialog here automatically
    setTimeout(() => {
      router.push(`/invoices?id=${newOrder.id}&print=true`);
    }, 500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 -mt-2">
      {/* Left Column: Products/Services */}
      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h2 className="font-semibold text-lg">Pilih Layanan</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari layanan..."
              className="pl-8 bg-background h-9"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:border-primary hover:shadow-md transition-all group overflow-hidden"
                onClick={() => addToCart(service)}
              >
                <div className="h-24 bg-muted/30 group-hover:bg-primary/5 flex items-center justify-center border-b border-border transition-colors">
                  <span className="text-4xl">👟</span>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">
                    {service.name}
                  </p>
                  <p className="text-primary font-bold mt-1 text-sm">
                    {formatCurrency(service.price)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Est. {service.estimationDays} hari
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Column: Cart & Checkout */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col min-h-0 bg-card rounded-xl border border-border shadow-sm overflow-hidden shrink-0">
        <div className="p-4 border-b border-border bg-primary text-primary-foreground">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Keranjang Kasir
          </h2>
        </div>

        <ScrollArea className="flex-1">
          {/* Customer Selection */}
          <div className="p-4 border-b border-border bg-muted/10">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Pelanggan</Label>
              {!selectedCustomer && (
                <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => router.push('/customers')}>
                  <UserPlus className="w-3 h-3 mr-1" /> Baru
                </Button>
              )}
            </div>
            
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-background">
                <div>
                  <p className="font-medium text-sm">{selectedCustomer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.whatsapp}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)} className="h-8 px-2 text-destructive">
                  Ganti
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau no. WA..."
                  className="pl-8 bg-background"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customerSearch && (
                  <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-md shadow-lg z-10 p-1">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(c => (
                        <div 
                          key={c.id} 
                          className="p-2 text-sm hover:bg-muted cursor-pointer rounded-sm flex justify-between items-center"
                          onClick={() => { setSelectedCustomer(c); setCustomerSearch(''); }}
                        >
                          <span>{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.whatsapp}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-center text-muted-foreground">Pelanggan tidak ditemukan</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Shoe Details Form */}
          <div className="p-4 border-b border-border bg-muted/10">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3 block">Data Sepatu</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Merek *</Label>
                <Input size={1} className="h-8 text-sm" placeholder="cth: Nike" value={brand} onChange={e => setBrand(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Warna *</Label>
                <Input size={1} className="h-8 text-sm" placeholder="cth: Putih" value={color} onChange={e => setColor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Jenis</Label>
                <select 
                  className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
                  value={shoeType}
                  onChange={e => setShoeType(e.target.value)}
                >
                  <option>Sneakers</option>
                  <option>Running Shoes</option>
                  <option>Boots</option>
                  <option>Casual</option>
                  <option>Sandal</option>
                  <option>High Heels</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Kondisi</Label>
                <select 
                  className="w-full h-8 text-sm rounded-md border border-input bg-background px-3"
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                >
                  <option>Kotor ringan</option>
                  <option>Kotor sedang</option>
                  <option>Sangat kotor</option>
                  <option>Menguning</option>
                  <option>Berjamur</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-4">
            <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-3 block">Item Layanan</Label>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Belum ada layanan dipilih</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.serviceId} className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-background">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm leading-tight pr-4">{item.serviceName}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -mr-1" onClick={() => removeFromCart(item.serviceId)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-primary font-semibold text-sm">{formatCurrency(item.subtotal)}</p>
                      <div className="flex items-center gap-2 border border-border rounded-md">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none rounded-l-md" onClick={() => updateQty(item.serviceId, -1)} disabled={item.qty <= 1}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs font-medium w-4 text-center">{item.qty}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none rounded-r-md" onClick={() => updateQty(item.serviceId, 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Checkout Summary */}
        <div className="border-t border-border bg-muted/10 p-4 shrink-0">
          <div className="space-y-1.5 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Diskon</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          
          <Button 
            className="w-full h-12 text-lg" 
            size="lg"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Lanjut Pembayaran
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
            <DialogDescription>
              Order atas nama <span className="font-semibold text-foreground">{selectedCustomer?.name}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="p-4 bg-muted/30 rounded-lg border border-border text-center space-y-1">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Total Tagihan</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(total)}</p>
            </div>

            <div className="grid gap-2">
              <Label>Metode Pembayaran</Label>
              <div className="grid grid-cols-3 gap-2">
                {['tunai', 'transfer_bank', 'qris'].map((m) => (
                  <Button 
                    key={m} 
                    type="button"
                    variant={paymentMethod === m ? 'default' : 'outline'}
                    className={paymentMethod === m ? 'border-primary' : ''}
                    onClick={() => setPaymentMethod(m as PaymentMethod)}
                  >
                    {m === 'transfer_bank' ? 'Transfer' : m === 'tunai' ? 'Tunai' : 'QRIS'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-2 mt-2">
              <Label htmlFor="amount">Nominal Dibayar (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                className="text-lg font-medium h-12"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value ? Number(e.target.value) : '')}
              />
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setAmountPaid(total)}>Uang Pas</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setAmountPaid(Math.round(total * 0.5))}>DP 50%</Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setAmountPaid(0)}>Nanti</Badge>
              </div>
            </div>

            {typeof amountPaid === 'number' && amountPaid > 0 && (
              <div className="pt-2">
                <div className="flex justify-between items-center p-3 rounded-md bg-background border border-border">
                  <span className="font-medium text-sm">
                    {amountPaid >= total ? 'Kembalian' : 'Sisa Tagihan'}
                  </span>
                  <span className={`font-bold ${amountPaid >= total ? 'text-success' : 'text-destructive'}`}>
                    {formatCurrency(amountPaid >= total ? change : remaining)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Batal</Button>
            <Button onClick={confirmOrder} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Simpan & Cetak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
