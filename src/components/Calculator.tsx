import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Clock, DollarSign, User, Edit3, BookmarkPlus, History } from 'lucide-react';
import { UserData } from '../types';
import SaveSearchModal from './SaveSearchModal';
import SavedSearches from './SavedSearches';
import { saveSearch } from '../services/searchService';

interface CalculatorProps {
  userData: UserData;
  userId: string;
  onReset: () => void;
}

export default function Calculator({ userData, userId, onReset }: CalculatorProps) {
  const [productCost, setProductCost] = useState('');
  const [animatedHours, setAnimatedHours] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Calculate hourly wage
  const hourlyWage = parseFloat(userData.monthlySalary) / 
    (parseFloat(userData.daysPerWeek) * 4) / 
    parseFloat(userData.hoursPerDay);

  // Calculate hours needed
  const hoursNeeded = productCost ? parseFloat(productCost) / hourlyWage : 0;

  // Show save button after calculation is complete
  useEffect(() => {
    if (hoursNeeded > 0) {
      const timer = setTimeout(() => {
        setShowSaveButton(true);
      }, 1500); // Show after animation completes
      
      return () => clearTimeout(timer);
    } else {
      setShowSaveButton(false);
    }
  }, [hoursNeeded]);

  // Animate numbers when productCost changes
  useEffect(() => {
    if (hoursNeeded > 0) {
      let start = 0;
      const duration = 1000; // 1 second
      const increment = hoursNeeded / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= hoursNeeded) {
          setAnimatedHours(hoursNeeded);
          clearInterval(timer);
        } else {
          setAnimatedHours(start);
        }
      }, 16);

      return () => clearInterval(timer);
    } else {
      setAnimatedHours(0);
    }
  }, [hoursNeeded]);

  // Animate progress bar
  useEffect(() => {
    if (hoursNeeded > 0) {
      // Calculate progress based on typical 8-hour workday
      const maxHours = 40; // 1 week of work
      const progress = Math.min((hoursNeeded / maxHours) * 100, 100);
      
      setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
    } else {
      setAnimatedProgress(0);
    }
  }, [hoursNeeded]);

  const handleSaveSearch = async (productName: string) => {
    if (!productCost || !productName) return;
    
    const success = await saveSearch(
      userId,
      productName,
      parseFloat(productCost),
      hoursNeeded,
      hourlyWage
    );
    
    if (success) {
      setShowSaveButton(false);
      // Show a brief success message or animation
    }
  };

  const formatHours = (hours: number) => {
    if (hours === 0) return '0 horas';
    if (hours < 1) return `${Math.round(hours * 60)} minutos`;
    if (hours < 8) return `${hours.toFixed(1)} horas`;
    
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    
    if (days === 1 && remainingHours === 0) return '1 día';
    if (remainingHours === 0) return `${days} días`;
    
    return `${days} día${days > 1 ? 's' : ''} y ${remainingHours.toFixed(1)} horas`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6A3D] via-[#FF4E8D] to-[#6A38FF] p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <CalcIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Frivolo</h1>
                <p className="text-white/80 text-sm">¡Hola, {userData.name}!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSavedSearches(!showSavedSearches)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                aria-label="Ver búsquedas guardadas"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={onReset}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                aria-label="Editar perfil"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Sueldo mensual</span>
              </div>
              <p className="text-lg font-bold">${parseFloat(userData.monthlySalary).toLocaleString('es-MX')} MXN</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Horario</span>
              </div>
              <p className="text-lg font-bold">{userData.hoursPerDay}h/día, {userData.daysPerWeek} días</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                <span className="font-medium">Valor por hora</span>
              </div>
              <p className="text-lg font-bold">${hourlyWage.toFixed(2)} MXN</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Saved Searches Section */}
        {showSavedSearches && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Búsquedas guardadas
              </h3>
              <SavedSearches userId={userId} />
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ¿Cuánto cuesta realmente?
          </h2>
          <p className="text-gray-600">
            Ingresa el precio de cualquier producto o servicio
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <div className="max-w-md mx-auto">
            <label htmlFor="product-cost" className="block text-lg font-medium text-gray-700 mb-4 text-center">
              Precio del producto o servicio
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xl font-medium">$</span>
              </div>
              <input
                id="product-cost"
                type="number"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                placeholder="0.00"
                className="block w-full pl-8 pr-4 py-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6A3D] focus:border-transparent transition-all duration-200"
                aria-describedby="cost-help"
              />
            </div>
            <p id="cost-help" className="text-sm text-gray-500 text-center mt-2">
              Precio en pesos mexicanos (MXN)
            </p>
          </div>
        </div>

        {/* Results Section */}
        {productCost && parseFloat(productCost) > 0 && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-[#FF6A3D]/10 via-[#FF4E8D]/10 to-[#6A38FF]/10 rounded-2xl p-8 mb-6">
                <p className="text-lg text-gray-600 mb-2">
                  Para comprar esto necesitas trabajar:
                </p>
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FF6A3D] via-[#FF4E8D] to-[#6A38FF] bg-clip-text text-transparent mb-4">
                  {animatedHours < 1 && animatedHours > 0 
                    ? `${Math.round(animatedHours * 60)}`
                    : animatedHours.toFixed(1)
                  }
                </div>
                <p className="text-2xl font-medium text-gray-700">
                  {formatHours(animatedHours)}
                </p>
                
                {/* Save Button */}
                {showSaveButton && (
                  <div className="mt-6 animate-fade-in">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#FF6A3D] border-2 border-[#FF6A3D] rounded-lg hover:bg-[#FF6A3D] hover:text-white transition-all duration-200 font-medium"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      ¿Quieres guardar esta búsqueda?
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Visualization */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Tiempo de trabajo visualizado
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0 horas</span>
                    <span>40 horas (1 semana)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-4 bg-gradient-to-r from-[#FF6A3D] via-[#FF4E8D] to-[#6A38FF] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${animatedProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-gray-500">
                      {animatedProgress > 100 ? 'Más de 1 semana de trabajo' : 
                       animatedProgress > 50 ? 'Más de medio día laboral' :
                       animatedProgress > 12.5 ? 'Algunas horas de trabajo' :
                       'Menos de 1 hora de trabajo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Dato curioso</h4>
                  <p className="text-blue-700 text-sm">
                    {hoursNeeded < 1 
                      ? 'Este gasto representa menos de 1 hora de tu trabajo.'
                      : hoursNeeded < 8
                      ? 'Trabajarías menos de un día completo para esto.'
                      : `Necesitarías ${Math.ceil(hoursNeeded / 8)} días completos de trabajo.`
                    }
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-medium text-green-800 mb-2">📊 En porcentaje</h4>
                  <p className="text-green-700 text-sm">
                    Esto representa el {((hoursNeeded / (parseFloat(userData.hoursPerDay) * parseFloat(userData.daysPerWeek))) * 100).toFixed(1)}% 
                    de tu semana laboral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!productCost && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FF6A3D]/20 to-[#6A38FF]/20 flex items-center justify-center">
              <CalcIcon className="w-12 h-12 text-[#FF6A3D]" />
            </div>
            <p className="text-gray-500 text-lg">
              Ingresa un precio para ver cuántas horas de trabajo representa
            </p>
          </div>
        )}
      </div>
      
      {/* Save Search Modal */}
      <SaveSearchModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveSearch}
        productCost={productCost}
        hoursNeeded={hoursNeeded}
      />
    </div>
  );
}