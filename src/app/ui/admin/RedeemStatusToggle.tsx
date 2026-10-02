'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

interface RedeemStatusToggleProps {
  leadId: string;
  initialIsRedeemed: boolean;
  initialRedeemedAt?: Date | string | null;
  compact?: boolean;
}

export default function RedeemStatusToggle({
  leadId,
  initialIsRedeemed,
  initialRedeemedAt,
  compact = false,
}: RedeemStatusToggleProps) {
  const router = useRouter();
  const [isRedeemed, setIsRedeemed] = useState(initialIsRedeemed);
  const [redeemedAt, setRedeemedAt] = useState<string | null>(
    initialRedeemedAt ? new Date(initialRedeemedAt).toISOString() : null
  );
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const nextState = !isRedeemed;

    try {
      const res = await fetch('/api/admin/express-leads/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          isRedeemed: nextState,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsRedeemed(data.isRedeemed);
        setRedeemedAt(data.redeemedAt ? new Date(data.redeemedAt).toISOString() : null);
        router.refresh();
      } else {
        alert(data.error || 'Error al cambiar estado de redención');
      }
    } catch (err) {
      console.error('Error toggling redeem state:', err);
      alert('Error de conexión al actualizar el certificado');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoStr: string | null) => {
    if (!isoStr) return '';
    return new Date(isoStr).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        title={isRedeemed ? `Certificado utilizado (${formatDate(redeemedAt)}). Clic para desmarcar.` : 'Clic para marcar certificado como utilizado / redimido'}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
          isRedeemed
            ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/25'
            : 'bg-base-200/80 text-base-content/60 border border-base-300 hover:border-emerald-500 hover:text-emerald-600'
        }`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isRedeemed ? (
          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
        ) : (
          <CircleDashed className="w-3 h-3 shrink-0" />
        )}
        <span>{isRedeemed ? 'Utilizado' : 'Marcar Utilizado'}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleToggle}
        disabled={loading}
        title={isRedeemed ? 'Clic para desmarcar redención' : 'Marcar certificado como redimido'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
          isRedeemed
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
            : 'bg-base-200 text-base-content/70 border border-base-300 hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600'
        }`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isRedeemed ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        ) : (
          <CircleDashed className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
        )}
        <span>{isRedeemed ? 'Certificado Utilizado' : 'Marcar como Utilizado'}</span>
      </button>
      {isRedeemed && redeemedAt && (
        <span className="text-[10px] font-medium text-emerald-600/80 pl-1">
          Redimido: {formatDate(redeemedAt)}
        </span>
      )}
    </div>
  );
}
