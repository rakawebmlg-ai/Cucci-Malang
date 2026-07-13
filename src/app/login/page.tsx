'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Footprints, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const settings = useAppStore((s) => s.settings);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '', 
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await login(values.email, values.password);

    if (success) {
      toast.success('Login berhasil!', {
        description: 'Selamat datang kembali.',
      });
      router.push('/');
    } else {
      toast.error('Login gagal', {
        description: 'Email atau password salah.',
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Footprints className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{settings.businessName}</h1>
          <p className="text-muted-foreground mt-1">Management System</p>
        </div>

        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle>Masuk ke Akun</CardTitle>
            <CardDescription>
              Masukkan email dan password Anda untuk mengakses dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Masukkan email Anda" 
                  {...register('email')} 
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    className="px-0 h-auto font-normal text-xs text-muted-foreground"
                    type="button"
                    onClick={() => toast.info('Fitur lupa password belum tersedia di versi demo ini.')}
                  >
                    Lupa password?
                  </Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  {...register('password')} 
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col space-y-2 bg-muted/50 rounded-b-xl border-t border-border mt-2 p-4">
              <p className="font-medium mt-1">Sistem Manajemen POS - Laundry Sepatu</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
