import React from 'react';

interface CardProps {
  title: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
  onClick?:()=>void;
}

export function Card({ 
  title, 
  image, 
  imageAlt = "Feature illustration", 
  onClick,
  children
}: CardProps) {
  const clickableStyles = onClick 
    ? "cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.99]" 
    : "";

  return (
    <div 
      className={`w-full mx-auto bg-custom-bg-soft border border-custom-border rounded-xl p-6 text-slate-200 font-sans shadow-xl flex flex-col gap-2 ${clickableStyles}`} 
      onClick={onClick}
    >
      <div>
        <h3 className="text-xl font-semibold text-custom-text">{title}</h3>
      </div>
      {(image || children) && (
        <div className="relative bg-custom-bg-soft border border-custom-border rounded-lg p-5 overflow-hidden shadow-inner flex flex-col justify-center items-center min-h-[180px]">
          {children && (
            <div className="w-full text-sm text-custom-text-muted">
              {children}
            </div>
          )}
          {image && (
            <img 
              src={image} 
              alt={imageAlt} 
              className={`object-cover rounded-md max-h-48 w-full ${children ? 'mt-4' : ''}`}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface ButtonCardProps {
  title: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
  button: React.ReactNode;
}

export const ButtonCard: React.FC<ButtonCardProps> = ({
  title, image, imageAlt, children, button
})=>{
  return (
    <div 
      className="max-w-xl mx-auto bg-custom-bg-soft border border-custom-border rounded-xl p-6 text-slate-200 font-sans shadow-xl flex flex-col gap-6"
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-custom-text mb-2">{title}</h3>
        {button}
      </div>
      {(image || children) && (
        <div className="relative bg-custom-bg-soft border border-custom-border rounded-lg p-5 overflow-hidden shadow-inner flex flex-col justify-center items-center min-h-[180px]">
          {children && (
            <div className="w-full text-sm text-slate-300">
              {children}
            </div>
          )}
          {image && (
            <img 
              src={image} 
              alt={imageAlt} 
              className={`object-cover rounded-md max-h-48 w-full ${children ? 'mt-4' : ''}`} // Changed mb-4 to mt-4 since image is now below children
            />
          )}
        </div>
      )}
    </div>
  );
}