"use client";

import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface-container-high w-full max-w-sm rounded-2xl shadow-2xl p-8 transform transition-all border border-outline-variant/30">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-error text-3xl">
              delete_forever
            </span>
          </div>
          
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
            Excluir Receita?
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            Você tem certeza que deseja excluir <strong>"{title}"</strong>? Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-error text-on-error rounded-full font-label font-bold text-sm tracking-widest uppercase hover:bg-error/90 transition-colors shadow-lg shadow-error/20"
            >
              Confirmar Exclusão
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 bg-surface-container-highest text-on-surface-variant rounded-full font-label font-bold text-sm tracking-widest uppercase hover:bg-outline-variant/20 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
