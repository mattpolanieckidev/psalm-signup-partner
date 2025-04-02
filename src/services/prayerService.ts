
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface PrayerRecipient {
  id: string;
  name: string;
  timestamp: string;
  hidden: boolean;
}

export const addPrayerRecipient = async (name: string): Promise<PrayerRecipient | null> => {
  const { data, error } = await supabase
    .from('prayer_recipients')
    .insert({ name: name.trim(), hidden: false })
    .select()
    .single();
  
  if (error) {
    console.error("Error adding prayer recipient:", error);
    throw error;
  }
  
  return data as PrayerRecipient;
};

export const getPrayerRecipients = async (includeHidden: boolean = false): Promise<PrayerRecipient[]> => {
  let query = supabase
    .from('prayer_recipients')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (!includeHidden) {
    query = query.eq('hidden', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching prayer recipients:", error);
    return [];
  }
  
  return data as PrayerRecipient[];
};

export const toggleRecipientVisibility = async (id: string, hidden: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from('prayer_recipients')
    .update({ hidden })
    .eq('id', id);
  
  if (error) {
    console.error("Error updating prayer recipient visibility:", error);
    return false;
  }
  
  return true;
};
