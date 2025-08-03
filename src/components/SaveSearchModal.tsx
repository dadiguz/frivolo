import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productName: string) => void;
  productCost: string;
  hoursNeeded: number;
}

export default function SaveSearchModal({ 
  isOpen, 
  onClose, 
  onSave, 
  productCost, 
  hoursNeeded 
}: SaveSearchModalProps) {
  const [productName, setProductName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!productName.trim()) return;
    
    setIsLoading(true);
    await onSave(productName.trim());
    setIsLoading(false);
    setProductName('');
    onClose();
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutos`;
    if (hours < 8) return `${hours.toFixed(1)} horas`;
    
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    
    if (days === 1 && remainingHours === 0) return '1 día';
    if (remainingHours === 0) return `${days} días`;
    
    return `${days} día${days > 1 ? 's' : ''} y ${remainingHours.toFixed(1)} horas`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Guardar búsqueda</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF4E8D]/10 rounded-lg p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">${parseFloat(productCost).toLocaleString('es-MX')}</p>
              <p className="text-gray-600">{formatHours(hoursNeeded)} de trabajo</p>
            </div>
          </div>

          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué producto o servicio es?
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: iPhone 15, Cena en restaurante, Curso online..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6A3D] focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!productName.trim() || isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF6A3D] to-[#FF4E8D] text-white rounded-lg hover:from-[#FF6A3D]/90 hover:to-[#FF4E8D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}