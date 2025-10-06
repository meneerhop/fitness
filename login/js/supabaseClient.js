// js/supabaseClient.js (submap-friendly, relative paths)
export const SUPABASE_URL = "https://sfzdrunhtskohtxgyyxk.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmemRydW5odHNrb2h0eGd5eXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODQ2MjcsImV4cCI6MjA3NDk2MDYyN30.lkowJdOvxURIt0Ox0dphjlivH2mR2rlhc8LolGJRnek";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
export async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Not logged in; redirect to /login/
    const dest = `${window.location.origin}/login/`;
    window.location.href = dest;
    return null;
  }
  return session;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = `${window.location.origin}/login/`;
}

// Profile helpers (Postgres tables: profiles, calorie_calculations)
export async function getOrCreateProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    const { data, error } = await supabase.from('profiles').insert({
      id: user.id, updated_at: new Date().toISOString()
    }).select().single();
    if (error) throw error;
    profile = data;
  }
  return { user, profile };
}

export async function saveProfile(fields) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Niet ingelogd');
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveCalories(calories) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Niet ingelogd');
  const { data, error } = await supabase
    .from('calorie_calculations')
    .insert({ user_id: user.id, calories, calculated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getLastCalories() {
  const { data, error } = await supabase
    .from('calorie_calculations')
    .select('*')
    .order('calculated_at', { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] || null;
}