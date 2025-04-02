
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface PrayerRecipient {
  id: string;
  name: string;
  timestamp: string;
}

export const addPrayerRecipient = async (name: string): Promise<PrayerRecipient | null> => {
  const { data, error } = await supabase
    .from('prayer_recipients')
    .insert({ name: name.trim() })
    .select()
    .single();
  
  if (error) {
    console.error("Error adding prayer recipient:", error);
    throw error;
  }
  
  return data as PrayerRecipient;
};

export const getPrayerRecipients = async (): Promise<PrayerRecipient[]> => {
  const { data, error } = await supabase
    .from('prayer_recipients')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) {
    console.error("Error fetching prayer recipients:", error);
    return [];
  }
  
  return data as PrayerRecipient[];
};
