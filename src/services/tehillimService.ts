
import { Participant } from "../types";

// For now, we'll use localStorage to persist data
const STORAGE_KEY = "tehillim_participants";

export const saveParticipant = (participant: Omit<Participant, "id" | "timestamp">): Participant => {
  const participants = getAllParticipants();
  
  const newParticipant: Participant = {
    id: Math.random().toString(36).substr(2, 9),
    name: participant.name,
    psalmNumbers: participant.psalmNumbers,
    timestamp: new Date().toISOString(),
  };
  
  participants.push(newParticipant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  
  return newParticipant;
};

export const getAllParticipants = (): Participant[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    const parsedData = JSON.parse(data);
    
    // Migration for existing data with single psalmNumber
    return parsedData.map((p: any) => {
      if ('psalmNumber' in p && !('psalmNumbers' in p)) {
        return {
          ...p,
          psalmNumbers: [p.psalmNumber]
        };
      }
      return p;
    });
  } catch (error) {
    console.error("Error parsing participants data:", error);
    return [];
  }
};

export const getClaimedPsalms = (): number[] => {
  const participants = getAllParticipants();
  return participants.flatMap(p => p.psalmNumbers);
};

export const isPsalmClaimed = (psalmNumber: number): boolean => {
  return getClaimedPsalms().includes(psalmNumber);
};
