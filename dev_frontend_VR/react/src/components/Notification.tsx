import React, { useState } from 'react';
import Icon from '../styles/icons'; // Adjust the import path based on your project

// 1. Define the allowed types
type NotificationType = 'success' | 'warning' | 'error';

interface NotificationBannerProps {
  type: NotificationType;
  title: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  title,
  children,
  dismissible = false,
  onDismiss,
}) => {
  const [ expand, setExpand ] = useState<boolean>(false);

  // Map type to your custom Tailwind CSS variables
  const config = {
    success: {
      color: 'var(--color-custom-warning-good)',
      icon: 'success',
    },
    warning: {
      color: 'var(--color-custom-warning-warning)',
      icon: 'warning',
    },
    error: {
      color: 'var(--color-custom-warning-error)',
      icon: 'error',
    },
  };

  const current = config[type];

  const handleDismiss = () => {
    setExpand(false);
    if (onDismiss) onDismiss();
  };

return (
  <div
    className="w-full rounded-xl border mb-1 shadow-sm transition-all duration-300 ease-in-out"
    style={{
      borderColor: `${current.color}`, // 40% opacity border
      backgroundColor: `color-mix(in srgb, ${current.color} 20%, transparent)`, // ~5% opacity tint for a subtle background
    }}
  >
    {/* Header Row */}
    <div className="flex items-start justify-between gap-3 p-1">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Preset Icon */}
        <div style={{ color: current.color }} className="flex-shrink-0">
          <Icon name={current.icon} className="w-6" />
        </div>
        {/* Chevron Button */}
        {children && (
          <button
            onClick={() => setExpand(!expand)}
            className="p-1 hover:bg-custom-text/5 rounded-lg transition-transform duration-200 flex-shrink-0"
            style={{ transform: expand ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-label={expand ? "Collapse details" : "Expand details"}
          >
            <div style={{ color: current.color }}>
              <Icon name="chevron" className="w-5" />
              </div>            
          </button>
        )}

        {/* Styled Title */}
        <div
          className='text-sm'
          style={{ color: current.color }}
        >
          {title}
        </div>
      </div>

      {/* Dismiss Button Right */}
      {dismissible && (
        <div className="flex items-center flex-shrink-0 mt-0.5">
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-custom-text/5 rounded-lg transition-colors"
            style={{ color: current.color }}
            aria-label="Dismiss notification"
          >
            <Icon name="close" className="w-3.5" />
          </button>
        </div>
      )}
    </div>
    {/* Expandable Children */}
    {children && (
      <div
        className={`pr-2 pl-2 grid transition-all duration-300 ease-in-out ${expand ? 'grid-rows-[1fr] opacity-100 mt-.5' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="border-t text-sm" style={{ border: current.color }}>
            {children}
          </div>
        </div>
      </div>
    )}
  </div>
)};