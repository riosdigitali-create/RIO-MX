'use client';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TicketActions() {
  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <Button className="h-11 rounded-full" onClick={() => window.print()}>
        <Download /> Descargar / guardar PDF
      </Button>
      <Button
        variant="outline"
        className="h-11 rounded-full"
        onClick={() => window.print()}
      >
        <Printer /> Imprimir
      </Button>
    </div>
  );
}
