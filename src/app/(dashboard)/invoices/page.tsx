'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Order } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Printer, 
  Download, 
  Eye, 
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { InvoiceTemplate } from '@/components/invoice/invoice-template';
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoicesPage() {
  const orders = useAppStore((s) => s.orders);
  const settings = useAppStore((s) => s.settings);
  const searchParams = useSearchParams();
  const autoPrintId = searchParams.get('id');
  const shouldPrint = searchParams.get('print');
  const hasAutoPrinted = useRef(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [printType, setPrintType] = useState<'a4' | 'thermal80' | 'thermal58'>('a4');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: selectedOrder ? `Invoice-${selectedOrder.invoiceNumber}` : 'Invoice',
    onAfterPrint: () => {
      toast.success('Berhasil mencetak invoice');
    }
  });

  // Auto open and print if query params exist
  useEffect(() => {
    if (autoPrintId && shouldPrint === 'true' && orders.length > 0 && !hasAutoPrinted.current) {
      const order = orders.find(o => o.id === autoPrintId);
      if (order) {
        hasAutoPrinted.current = true;
        setSelectedOrder(order);
        setPreviewOpen(true);
        // Add a slight delay to ensure component is rendered
        setTimeout(() => {
          handlePrint();
        }, 1000);
      }
    }
  }, [autoPrintId, shouldPrint, orders]); // Removed handlePrint to prevent infinite loop

  const openPreview = (order: Order) => {
    setSelectedOrder(order);
    setPreviewOpen(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Nomor invoice disalin');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPdf = async () => {
    if (!printRef.current || !selectedOrder) return;
    
    try {
      setIsGeneratingPdf(true);
      toast.info('Sedang membuat PDF...');
      
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // A4 format
      let pdf;
      if (printType === 'a4') {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        // Thermal format (custom height based on content)
        const width = printType === 'thermal80' ? 80 : 58;
        const height = (canvas.height * width) / canvas.width;
        
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [width, height],
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      }
      
      pdf.save(`Invoice-${selectedOrder.invoiceNumber}.pdf`);
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'No. Invoice',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.getValue('invoiceNumber')}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={() => copyToClipboard(row.getValue('invoiceNumber'), row.original.id)}
          >
            {copiedId === row.original.id ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Pelanggan',
    },
    {
      accessorKey: 'orderDate',
      header: 'Tanggal',
      cell: ({ row }) => <span className="text-sm">{formatDateTime(row.getValue('orderDate'))}</span>,
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.getValue('total'))}</span>,
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus') as string;
        const isLunas = status === 'lunas';
        return (
          <Badge variant={isLunas ? 'default' : 'secondary'} className={isLunas ? 'bg-success text-success-foreground' : ''}>
            {status === 'lunas' ? 'Lunas' : status === 'dp' ? 'DP' : 'Belum Bayar'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => openPreview(order)}>
              <Eye className="w-4 h-4 mr-2" />
              Lihat
            </Button>
            <Button variant="default" size="sm" onClick={() => {
              setSelectedOrder(order);
              setPrintType('thermal80'); // Default to thermal for quick print
              setTimeout(() => handlePrint(), 100);
            }}>
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoice</h2>
          <p className="text-muted-foreground">
            Cetak, download PDF, dan kelola semua invoice transaksi.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchKey="invoiceNumber"
        searchPlaceholder="Cari nomor invoice..."
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden bg-muted/20">
          <DialogHeader className="px-6 py-4 border-b border-border bg-card shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Preview Invoice: {selectedOrder?.invoiceNumber}</DialogTitle>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
                    Ukuran Kertas
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPrintType('a4')}>Kertas A4</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrintType('thermal80')}>Thermal 80mm</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPrintType('thermal58')}>Thermal 58mm</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" size="sm" onClick={downloadPdf} disabled={isGeneratingPdf}>
                  <Download className="w-4 h-4 mr-2" />
                  {isGeneratingPdf ? 'Memproses...' : 'PDF'}
                </Button>
                <Button size="sm" onClick={() => handlePrint()}>
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100/50">
            {selectedOrder && (
              <div className="flex justify-center shadow-2xl">
                <InvoiceTemplate 
                  ref={printRef} 
                  order={selectedOrder} 
                  settings={settings} 
                  printType={printType} 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
