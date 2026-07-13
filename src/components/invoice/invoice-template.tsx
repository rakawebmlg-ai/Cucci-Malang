'use client';

import React, { forwardRef } from 'react';
import { Order, BusinessSettings, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { QRCodeSVG } from 'qrcode.react';

interface InvoiceTemplateProps {
  order: Order;
  settings: BusinessSettings;
  printType?: 'a4' | 'thermal80' | 'thermal58';
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order, settings, printType = 'a4' }, ref) => {
    // Generate URL for QR code (mock tracking URL)
    const trackingUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/track/${order.invoiceNumber}` 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://shoe-laundry-cyorljbyt-rakaweb.vercel.app'}/track/${order.invoiceNumber}`;

    if (printType === 'thermal58' || printType === 'thermal80') {
      const is58 = printType === 'thermal58';
      return (
        <div ref={ref} className={`font-mono text-black bg-white ${is58 ? 'print-58mm p-2 text-[10px]' : 'print-80mm p-3 text-[12px]'} w-full max-w-sm mx-auto`}>
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="font-bold text-lg mb-1">{settings.businessName}</h1>
            <p className="leading-tight">{settings.address}</p>
            <p>WA: {settings.whatsapp}</p>
          </div>
          
          <div className="border-b border-dashed border-gray-400 mb-2"></div>
          
          {/* Meta */}
          <div className="mb-2">
            <p>No: {order.invoiceNumber}</p>
            <p>Tgl: {formatDateTime(order.orderDate)}</p>
            <p>Plg: {order.customerName}</p>
            <p>Kasir: Admin Utama</p>
          </div>
          
          <div className="border-b border-dashed border-gray-400 mb-2"></div>
          
          {/* Items */}
          <table className="w-full mb-2">
            <tbody>
              {order.items.map((item, i) => (
                <React.Fragment key={i}>
                  <tr>
                    <td colSpan={3} className="pt-1">{item.serviceName}</td>
                  </tr>
                  <tr>
                    <td className="w-8">{item.qty}x</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td className="text-right">{formatCurrency(item.subtotal)}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          
          <div className="border-b border-dashed border-gray-400 mb-2"></div>
          
          {/* Summary */}
          <div className="space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span>Pajak</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm mt-1 pt-1 border-t border-dashed border-gray-400">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dibayar ({order.paymentMethod})</span>
              <span>{formatCurrency(order.amountPaid)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembali/Sisa</span>
              <span>{formatCurrency(Math.abs(order.total - order.amountPaid))}</span>
            </div>
          </div>
          
          <div className="border-b border-dashed border-gray-400 mb-3"></div>
          
          {/* Sepatu Info */}
          <div className="mb-3 leading-tight">
            <p className="font-bold">Sepatu:</p>
            <p>{order.brand} - {order.shoeType}</p>
            <p>Warna: {order.color} | Ukuran: {order.size}</p>
            <p>Estimasi: {formatDateTime(order.estimatedDate)}</p>
            <p className="mt-1 font-bold border border-black text-center p-1 uppercase">
              STATUS: {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </p>
          </div>

          {/* QR */}
          <div className="flex justify-center mb-3">
            <QRCodeSVG value={trackingUrl} size={is58 ? 100 : 120} />
          </div>
          
          {/* Footer */}
          <div className="text-center text-[10px] leading-tight">
            <p className="whitespace-pre-line">{settings.invoiceFooter}</p>
            <p className="mt-2">- Powered by cuccimalang POS -</p>
          </div>
        </div>
      );
    }

    // A4 Default Layout
    return (
      <div ref={ref} className="bg-white text-black p-8 print-a4 max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-sm font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-4 print:bg-green-600 print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <span className="text-white font-bold text-2xl">SC</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{settings.businessName}</h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">{settings.address}</p>
            <p className="text-gray-500 text-sm">WhatsApp: {settings.whatsapp}</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-gray-200 tracking-wider uppercase mb-2" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>INVOICE</h2>
            <p className="text-sm font-bold text-gray-900">{order.invoiceNumber}</p>
            <p className="text-sm text-gray-500 mt-1">Tanggal: {formatDateTime(order.orderDate)}</p>
            <div className="mt-4 inline-block px-3 py-1 rounded-md text-sm font-bold border-2 border-gray-900 uppercase">
              {PAYMENT_STATUS_LABELS[order.paymentStatus]}
            </div>
          </div>
        </div>

        {/* Customer & Shoe Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tagihan Kepada</h3>
            <p className="font-bold text-gray-900">{order.customerName}</p>
            <p className="text-sm text-gray-600 mt-1">{order.customerWhatsapp}</p>
            <p className="text-sm text-gray-600 max-w-xs">{order.customerAddress}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detail Sepatu</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">Merek / Tipe:</span>
              <span className="font-medium text-gray-900">{order.brand} - {order.shoeType}</span>
              
              <span className="text-gray-500">Warna / Ukuran:</span>
              <span className="font-medium text-gray-900">{order.color} / {order.size}</span>
              
              <span className="text-gray-500">Kondisi Awal:</span>
              <span className="font-medium text-gray-900">{order.condition}</span>
              
              <span className="text-gray-500 mt-2 font-bold text-green-600">Estimasi Selesai:</span>
              <span className="font-bold text-green-600 mt-2">{formatDateTime(order.estimatedDate)}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 text-gray-500 uppercase tracking-wider text-xs">
              <th className="py-3 text-left font-bold">Layanan</th>
              <th className="py-3 text-center font-bold">Qty</th>
              <th className="py-3 text-right font-bold">Harga</th>
              <th className="py-3 text-right font-bold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-4 font-medium text-gray-900">{item.serviceName}</td>
                <td className="py-4 text-center text-gray-600">{item.qty}</td>
                <td className="py-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                <td className="py-4 text-right font-bold text-gray-900">{formatCurrency(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary & QR */}
        <div className="flex justify-between items-start mb-12">
          <div className="w-1/3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cek Status Pesanan</h3>
            <div className="p-2 bg-gray-50 inline-block border border-gray-200 rounded-lg">
              <QRCodeSVG value={trackingUrl} size={100} />
            </div>
            {order.notes && (
              <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-bold">Catatan:</span> {order.notes}
              </div>
            )}
          </div>
          
          <div className="w-1/2 md:w-1/3">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Diskon</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Pajak</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Telah Dibayar</span>
                  <span>{formatCurrency(order.amountPaid)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Sisa Tagihan</span>
                  <span className={order.remaining > 0 ? "text-red-500" : "text-green-600"}>
                    {formatCurrency(order.remaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p className="font-bold text-gray-900 mb-1">Syarat & Ketentuan:</p>
          <p className="whitespace-pre-line max-w-2xl mx-auto">{settings.invoiceFooter}</p>
        </div>
      </div>
    );
  }
);

InvoiceTemplate.displayName = 'InvoiceTemplate';
