import { supabase } from '../lib/supabase';
import { SavedSearch } from '../types';

export const saveSearch = async (
  userId: string,
  productName: string,
  productCost: number,
  hoursNeeded: number,
  hourlyWage: number
): Promise<SavedSearch | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_searches')
      .insert([
        {
          user_id: userId,
          product_name: productName,
          product_cost: productCost,
          hours_needed: hoursNeeded,
          hourly_wage: hourlyWage
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving search:', error);
    return null;
  }
};

export const getUserSearches = async (userId: string): Promise<SavedSearch[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user searches:', error);
    return [];
  }
};

export const deleteSearch = async (searchId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('saved_searches')
      .delete()
      .eq('id', searchId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting search:', error);
    return false;
  }
};