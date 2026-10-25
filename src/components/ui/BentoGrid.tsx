import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 ${className}`}>
      {children}
    </div>
  );
}

interface BentoItemProps {
  children: React.ReactNode;
  span?: 'full' | 'half' | 'two-thirds' | 'one-third' | 'four-twelfths' | 'eight-twelfths';
  className?: string;
}

export function BentoItem({ children, span = 'half', className = '' }: BentoItemProps) {
  const spanClasses = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    'two-thirds': 'lg:col-span-8',
    'one-third': 'lg:col-span-4',
    'four-twelfths': 'lg:col-span-4',
    'eight-twelfths': 'lg:col-span-8',
  };

  return <div className={`${spanClasses[span]} flex flex-col ${className}`}>{children}</div>;
}
