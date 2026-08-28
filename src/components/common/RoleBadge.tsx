import React from 'react';
import { UserRole } from '../../types';
import { Sprout, ShoppingBag, Truck } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, showIcon = true }) => {
  const config = {
    farmer: {
      label: 'Farmer',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: Sprout
    },
    buyer: {
      label: 'Wholesale Buyer',
      bg: 'bg-blue-50 text-blue-800 border-blue-300',
      icon: ShoppingBag
    },
    transport: {
      label: 'Transport Fleet',
      bg: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: Truck
    }
  };

  const item = config[role] || config.farmer;
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${item.bg}`}>
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {item.label}
    </span>
  );
};
