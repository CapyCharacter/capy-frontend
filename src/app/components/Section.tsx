import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="mb-8 py-4">
      <h2 className="text-xl font-serif px-6 py-0">{title}</h2>
      {children}
    </section>
  );
};

export default Section;
