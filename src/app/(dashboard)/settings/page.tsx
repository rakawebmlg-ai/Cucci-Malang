'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Store, Receipt, ShieldCheck, DatabaseBackup } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SettingsPage() {
  const currentSettings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

  // Local state for the form so we only update store on save
  const [settings, setSettings] = useState(currentSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name === 'taxRate' ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      updateSettings(settings);
      toast.success('Pengaturan berhasil disimpan');
      setIsLoading(false);
    }, 600);
  };

  const handleBackup = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Mencadangkan database...',
        success: 'Database berhasil dicadangkan (Dummy)',
        error: 'Gagal mencadangkan database',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
          <p className="text-muted-foreground">
            Atur profil bisnis, format invoice, dan sistem aplikasi Anda.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="general" className="gap-2">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">Profil Toko</span>
          </TabsTrigger>
          <TabsTrigger value="invoice" className="gap-2">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">Invoice</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <DatabaseBackup className="w-4 h-4" />
            <span className="hidden sm:inline">Sistem</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Profil Usaha</CardTitle>
              <CardDescription>Detail ini akan tampil di seluruh aplikasi dan invoice pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">Nama Usaha</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp Bisnis</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={settings.whatsapp}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="operatingHours">Jam Operasional</Label>
                  <Input
                    id="operatingHours"
                    name="operatingHours"
                    value={settings.operatingHours}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="mt-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Pengaturan Invoice</CardTitle>
              <CardDescription>Format penomoran, pajak, dan catatan kaki untuk struk pelanggan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoicePrefix">Awalan (Prefix) Nomor Invoice</Label>
                  <Input
                    id="invoicePrefix"
                    name="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={handleChange}
                    placeholder="Contoh: INV"
                  />
                  <p className="text-xs text-muted-foreground">Contoh hasil: {settings.invoicePrefix}-20260703-0001</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxRate">Persentase Pajak / PPN (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground">Isi 0 jika tidak menggunakan pajak</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoiceFooter">Catatan / Syarat & Ketentuan (Tampil di bagian bawah struk)</Label>
                <Textarea
                  id="invoiceFooter"
                  name="invoiceFooter"
                  value={settings.invoiceFooter}
                  onChange={handleChange}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Keamanan Akun</CardTitle>
              <CardDescription>Untuk mengubah password akun Anda saat ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="newPassword">Password Baru</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="grid gap-2 max-w-sm">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast.success('Password berhasil diperbarui (Dummy)')}>
                Ubah Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle>Sistem & Database</CardTitle>
              <CardDescription>Cadangkan data Anda untuk menghindari kehilangan data penting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Backup Data (Local Storage)</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Unduh seluruh data transaksi, pelanggan, dan pengaturan sebagai file cadangan JSON.
                </p>
                <Button onClick={handleBackup} variant="outline" className="gap-2">
                  <DatabaseBackup className="w-4 h-4" />
                  Mulai Backup
                </Button>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-destructive mb-2">Hapus Semua Data</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Tindakan ini akan menghapus permanen semua data dari browser Anda. Harap berhati-hati.
                </p>
                <Button variant="destructive" onClick={() => toast.error('Fitur berbahaya dikunci pada versi demo')}>
                  Reset Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
