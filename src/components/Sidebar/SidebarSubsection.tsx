import React, { ReactNode } from "react";

interface SidebarSubsectionProps {
  children: ReactNode;
  title: string;
}

const SidebarSubsection: React.FC<SidebarSubsectionProps> = ({
  children,
  title,
}) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-gray-500 mb-1 px-4">{title}</h3>
    {children}
  </div>
);

export default SidebarSubsection;
