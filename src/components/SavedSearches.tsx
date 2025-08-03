import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Calendar } from 'lucide-react';
import { SavedSearch } from '../types';
import { getUserSearches, deleteSearch } from '../services/searchService';

interface SavedSearchesProps {
  userId: string;
  onSearchSelect: (productCost: number) => void;
}

export default function SavedSearches({ userId, onSearchSelect }: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSearches();
  }, [userId]);

  const loadSearches = async () => {
    setIsLoading(true);
    const userSearches = await getUserSearches(userId);
    setSearches(userSearches);
    setIsLoading(false);
  };

  const handleDelete = async (searchId: string) => {
    const success = await deleteSearch(searchId);
    if (success) {
      setSearches(searches.filter(search => search.id !== searchId));
    }
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 8) return `${hours.toFixed(1)}h`;
    
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    
    if (days === 1 && remainingHours === 0) return '1 día';
    if (remainingHours === 0) return `${days}d`;
    
    return `${days}d ${remainingHours.toFixed(1)}h`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Aún no tienes búsquedas guardadas</p>
        <p className="text-sm text-gray-400 mt-1">
          Realiza un cálculo y guárdalo para verlo aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {searches.map((search) => (
        <div
          key={search.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSearchSelect(search.product_cost)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 mb-1">
                {search.product_name}
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">
                  ${search.product_cost.toLocaleString('es-MX')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatHours(search.hours_needed)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(search.created_at)}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(search.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Eliminar búsqueda"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}