
import { supabase } from "@/integrations/supabase/client";
import { PrayerRecipient } from "./prayerService";

export interface PsalmParticipant {
  id: string;
  name: string;
  psalmNumbers: number[];
  prayerRecipientId: string;
  timestamp: string;
}

export const saveParticipantForRecipient = async (
  participant: { name: string; psalmNumbers: number[] }, 
  recipientId: string
): Promise<PsalmParticipant> => {
  // First, insert the participant to get their ID
  const { data: participantData, error: participantError } = await supabase
    .from('participants')
    .insert({
      name: participant.name
    })
    .select()
    .single();
  
  if (participantError) {
    console.error("Error saving participant:", participantError);
    throw participantError;
  }
  
  // Then, insert all psalm selections
  const psalmSelections = participant.psalmNumbers.map(psalmNumber => ({
    participant_id: participantData.id,
    prayer_recipient_id: recipientId,
    psalm_number: psalmNumber
  }));
  
  const { error: psalmError } = await supabase
    .from('psalm_selections')
    .insert(psalmSelections);
  
  if (psalmError) {
    console.error("Error saving psalm selections:", psalmError);
    throw psalmError;
  }
  
  return {
    id: participantData.id,
    name: participantData.name,
    psalmNumbers: participant.psalmNumbers,
    prayerRecipientId: recipientId,
    timestamp: participantData.timestamp
  };
};

export const getParticipantsForRecipient = async (recipientId: string): Promise<PsalmParticipant[]> => {
  // First, get all psalms selections for this recipient
  const { data: psalmSelections, error: psalmSelectionsError } = await supabase
    .from('psalm_selections')
    .select('*')
    .eq('prayer_recipient_id', recipientId);
  
  if (psalmSelectionsError) {
    console.error("Error fetching psalm selections:", psalmSelectionsError);
    return [];
  }

  // Group selections by participant
  const participantIds = Array.from(new Set(psalmSelections.map(s => s.participant_id)));
  
  // Get all participants
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .in('id', participantIds);
  
  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    return [];
  }

  // Map participants with their psalm selections
  return participants.map(participant => {
    const selections = psalmSelections
      .filter(selection => selection.participant_id === participant.id)
      .map(selection => selection.psalm_number);
    
    return {
      id: participant.id,
      name: participant.name,
      psalmNumbers: selections,
      prayerRecipientId: recipientId,
      timestamp: participant.timestamp
    };
  });
};

export const getClaimedPsalmsForRecipient = async (recipientId: string): Promise<number[]> => {
  const { data, error } = await supabase
    .from('psalm_selections')
    .select('psalm_number')
    .eq('prayer_recipient_id', recipientId);
  
  if (error) {
    console.error(`Error fetching claimed psalms for recipient ${recipientId}:`, error);
    return [];
  }
  
  return data.map(selection => selection.psalm_number);
};

export const getPsalmSelectionCountsForRecipient = async (recipientId: string): Promise<Map<number, number>> => {
  const { data, error } = await supabase
    .from('psalm_selections')
    .select('psalm_number')
    .eq('prayer_recipient_id', recipientId);
  
  if (error) {
    console.error(`Error fetching psalm selections for recipient ${recipientId}:`, error);
    return new Map<number, number>();
  }
  
  const countsMap = new Map<number, number>();
  
  // Initialize counts for all psalms from 1-150
  for (let i = 1; i <= 150; i++) {
    countsMap.set(i, 0);
  }
  
  // Count each claimed psalm
  data.forEach(({ psalm_number }) => {
    const currentCount = countsMap.get(psalm_number) || 0;
    countsMap.set(psalm_number, currentCount + 1);
  });
  
  return countsMap;
};
