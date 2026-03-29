import React from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
}

export default function ModalWrapper({ children }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-gray-200 p-6 rounded w-96 text-gray-600">
        {children}
      </div>
    </div>
  );
}
