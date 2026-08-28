import React from 'react';
import { OrderStatus, TransportStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus | TransportStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'CONFIRMED':
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PICKED_UP':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'IN_TRANSIT':
        return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-300';
      case 'PENDING':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmed';
      case 'PICKED_UP': return 'Picked Up';
      case 'IN_TRANSIT': return 'In Transit (On Route)';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      case 'AVAILABLE': return 'Ready for Dispatch';
      case 'ASSIGNED': return 'Driver Assigned';
      case 'PENDING': return 'Pending Acceptance';
      default: return status;
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs font-semibold' : 'px-2.5 py-1 text-xs font-bold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${getBadgeStyle()} ${sizeClass} tracking-wide`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {getStatusLabel()}
    </span>
  );
};
