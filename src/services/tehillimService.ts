
import { supabase } from "@/integrations/supabase/client";
import { Participant } from "../types";

export const saveParticipant = async (participant: Omit<Participant, "id" | "timestamp">): Promise<Participant> => {
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
    timestamp: participantData.timestamp
  };
};

export const getAllParticipants = async (): Promise<Participant[]> => {
  // First, get all participants
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (participantsError) {
    console.error("Error fetching participants:", participantsError);
    return [];
  }

  // Then, get all psalm selections
  const { data: psalmSelections, error: psalmSelectionsError } = await supabase
    .from('psalm_selections')
    .select('*');
  
  if (psalmSelectionsError) {
    console.error("Error fetching psalm selections:", psalmSelectionsError);
    return [];
  }

  // Map selections to participants
  return participants.map(participant => {
    const selections = psalmSelections
      .filter(selection => selection.participant_id === participant.id)
      .map(selection => selection.psalm_number);
    
    return {
      id: participant.id,
      name: participant.name,
      psalmNumbers: selections,
      timestamp: participant.timestamp
    };
  });
};

export const getClaimedPsalms = async (): Promise<number[]> => {
  const { data, error } = await supabase
    .from('psalm_selections')
    .select('psalm_number');
  
  if (error) {
    console.error("Error fetching claimed psalms:", error);
    return [];
  }
  
  return data.map(selection => selection.psalm_number);
};

export const isPsalmClaimed = async (psalmNumber: number): Promise<boolean> => {
  const claimedPsalms = await getClaimedPsalms();
  return claimedPsalms.includes(psalmNumber);
};

export const getPsalmSelectionCounts = async (): Promise<Map<number, number>> => {
  const { data, error } = await supabase
    .from('psalm_selections')
    .select('psalm_number');
  
  if (error) {
    console.error("Error fetching psalm selections:", error);
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
