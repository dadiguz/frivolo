export interface UserData {
  name: string;
  email: string;
  age: string;
  country: string;
  job: string;
  monthlySalary: string;
  hoursPerDay: string;
  daysPerWeek: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  product_name: string;
  product_cost: number;
  hours_needed: number;
  hourly_wage: number;
  created_at: string;
}

export interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  job: string;
  monthly_salary: number;
  hours_per_day: number;
  days_per_week: number;
  created_at: string;
  updated_at: string;
}