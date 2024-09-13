import React, { ReactNode } from "react";

interface SidebarSectionProps {
  children: ReactNode;
  title?: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ children, title }) => (
  <div className="w-full py-2">
    {title && (
      <h2 className="text-base font-medium text-black mb-2 px-4">{title}</h2>
    )}
    {children}
  </div>
);

export default SidebarSection;
