
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ToolButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  variant?: 'default' | 'primary' | 'outline';
}

const ToolButton = React.forwardRef<HTMLButtonElement, ToolButtonProps>(
  ({ icon: Icon, label, active = false, variant = 'default', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'tool-button',
          active && 'active',
          variant === 'primary' && 'bg-primary text-primary-foreground',
          variant === 'outline' && 'border border-tool-border bg-white',
          variant === 'default' && 'bg-white',
          className
        )}
        aria-label={label}
        title={label}
        {...props}
      >
        <Icon size={20} />
      </button>
    );
  }
);

ToolButton.displayName = 'ToolButton';

export default ToolButton;
