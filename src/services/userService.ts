import { supabase } from '../lib/supabase';
import { User, UserData } from '../types';

export const createOrUpdateUser = async (userId: string, userData: UserData): Promise<User | null> => {
  try {
    // First, try to get existing user
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId);

    const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null;

    const userPayload = {
      user_id: userId,
      name: userData.name,
      age: parseInt(userData.age),
      country: userData.country,
      monthly_salary: parseFloat(userData.monthlySalary),
      hours_per_day: parseFloat(userData.hoursPerDay),
      days_per_week: parseFloat(userData.daysPerWeek),
      updated_at: new Date().toISOString()
    };

    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update(userPayload)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([userPayload])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return null;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};