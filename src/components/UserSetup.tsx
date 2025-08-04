import React, { useState } from 'react';
import { User, Clock, Calendar, DollarSign, Mail, Briefcase } from 'lucide-react';
import { UserData } from '../types';
import logo from '../assets/logo.svg';

interface UserSetupProps {
  onComplete: (userData: UserData) => void;
  initialData?: UserData;
  onCancel?: () => void;
}

export default function UserSetup({ onComplete, initialData, onCancel }: UserSetupProps) {
  const [userData, setUserData] = useState<UserData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    age: initialData?.age || '',
    country: 'México',
    job: initialData?.job || '',
    monthlySalary: initialData?.monthlySalary || '',
    hoursPerDay: initialData?.hoursPerDay || '',
    daysPerWeek: initialData?.daysPerWeek || ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [showJobDropdown, setShowJobDropdown] = useState(false);

  const jobOptions = [
    'Desarrollador de Software',
    'Diseñador Gráfico',
    'Contador',
    'Abogado',
    'Médico',
    'Enfermero/a',
    'Profesor/a',
    'Ingeniero Civil',
    'Arquitecto',
    'Marketing Digital',
    'Vendedor',
    'Administrador',
    'Recursos Humanos',
    'Psicólogo',
    'Chef',
    'Mesero/a',
    'Recepcionista',
    'Asistente Ejecutivo',
    'Analista Financiero',
    'Consultor',
    'Electricista',
    'Plomero',
    'Mecánico',
    'Chofer',
    'Seguridad',
    'Limpieza',
    'Estudiante',
    'Freelancer',
    'Emprendedor',
    'Otro'
  ];

  const steps = [
    {
      id: 'personal',
      title: '¡Hola! Comencemos',
      fields: [
        { key: 'name', label: 'Tu nombre', type: 'text', icon: User, placeholder: 'Ej: María García' },
        { key: 'email', label: 'Correo electrónico', type: 'email', icon: Mail, placeholder: 'maria@ejemplo.com' },
        { key: 'age', label: 'Tu edad', type: 'number', icon: User, placeholder: '25' }
      ]
    },
    {
      id: 'job',
      title: 'Tu trabajo',
      fields: [
        { key: 'job', label: 'Trabajo/Profesión', type: 'select', icon: Briefcase, placeholder: 'Selecciona o escribe tu trabajo' }
      ]
    },
    {
      id: 'work',
      title: 'Cuéntanos sobre tu trabajo',
      fields: [
        { key: 'monthlySalary', label: 'Sueldo mensual (MXN)', type: 'number', icon: DollarSign, placeholder: '15000' },
        { key: 'hoursPerDay', label: 'Horas por día', type: 'number', icon: Clock, placeholder: '8' },
        { key: 'daysPerWeek', label: 'Días por semana', type: 'number', icon: Calendar, placeholder: '5' }
      ]
    }
  ];

  const handleInputChange = (key: keyof UserData, value: string) => {
    if (key === 'email') {
      setEmailError('');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setEmailError('Por favor ingresa un correo electrónico válido');
      }
    }
    setUserData(prev => ({ ...prev, [key]: value }));
  };

  const handleJobSelect = (job: string) => {
    setUserData(prev => ({ ...prev, job }));
    setShowJobDropdown(false);
  };

  const canProceed = () => {
    const currentFields = steps[currentStep].fields;
    const allFieldsFilled = currentFields.every(field => userData[field.key as keyof UserData].trim() !== '');
    const emailValid = !emailError && (userData.email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email));
    return allFieldsFilled && emailValid;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <div className="w-48 h-24 mx-auto mb-2">
            <img src={logo} alt="Frivolo Logo" className="w-full h-full" />
          </div>
          <p className="text-gray-600">Descubre el valor real de tu tiempo</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Paso {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-[#FF6A3D] to-[#6A38FF] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            {initialData ? 'Editar información' : currentStepData.title}
          </h2>

          <div className="space-y-4">
            {currentStepData.fields.map((field) => {
              const Icon = field.icon;
              
              if (field.type === 'select' && field.key === 'job') {
                return (
                  <div key={field.key} className="space-y-2">
                    <label 
                      htmlFor={field.key}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id={field.key}
                        type="text"
                        placeholder={field.placeholder}
                        value={userData.job}
                        onChange={(e) => handleInputChange('job', e.target.value)}
                        onFocus={() => setShowJobDropdown(true)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6A3D] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        required
                      />
                      {showJobDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {jobOptions
                            .filter(job => job.toLowerCase().includes(userData.job.toLowerCase()))
                            .map((job) => (
                            <button
                              key={job}
                              type="button"
                              onClick={() => handleJobSelect(job)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                              {job}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              
              return (
                <div key={field.key} className="space-y-2">
                  <label 
                    htmlFor={field.key}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={userData[field.key as keyof UserData]}
                      onChange={(e) => handleInputChange(field.key as keyof UserData, e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6A3D] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      required
                      aria-describedby={`${field.key}-help`}
                    />
                  </div>
                  {field.key === 'email' && emailError && (
                    <p className="text-sm text-red-600 mt-1">{emailError}</p>
                  )}
                </div>
              );
            })}

            {/* Country Info */}
            {currentStep === 0 && (
              <div className="bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF4E8D]/10 rounded-lg p-4">
                <p className="text-sm text-gray-600 text-center">
                  🇲🇽 Actualmente disponible solo para México (MXN)
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {initialData && onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancelar
              </button>
            )}
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF6A3D] to-[#FF4E8D] text-white rounded-lg hover:from-[#FF6A3D]/90 hover:to-[#FF4E8D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {currentStep === steps.length - 1 ? (initialData ? 'Guardar cambios' : 'Comenzar') : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}