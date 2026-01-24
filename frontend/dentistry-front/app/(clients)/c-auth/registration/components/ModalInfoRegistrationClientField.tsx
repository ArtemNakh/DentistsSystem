import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalInfoRegistrationClientField({ isOpen, onClose }: ModalProps) {
 
    
  return (
    <>
      <div>
        {isOpen && (
          <div className="  fixed inset-0 flex items-center justify-center ">
            <div className="border-2 border-gray-400 bg-gray-200 rounded-lg shadow-lg p-6 max-w-prose w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Реєстрація успішна 🎉
              </h2>
              <p className="text-gray-700 mb-6">
                Будь ласка, перевірте вашу електронну пошту та верифікуйте
                акаунт.
              </p>
              <button
                onClick={() => onClose()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                Закрити
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
