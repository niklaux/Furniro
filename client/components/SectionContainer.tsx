import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;  // Specify that children can be any valid React node
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children }) => {
  return <div className="max-w-screen-xl mx-auto p-4 my-10">{children}</div>;
};

export default SectionContainer;
