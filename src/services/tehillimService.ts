
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

/**
 * Returns a map of psalm numbers to the number of times each psalm has been selected
 */
export const getPsalmSelectionCounts = (): Map<number, number> => {
  const claimedPsalms = getClaimedPsalms();
  const countsMap = new Map<number, number>();
  
  // Initialize counts for all psalms from 1-150
  for (let i = 1; i <= 150; i++) {
    countsMap.set(i, 0);
  }
  
  // Count each claimed psalm
  claimedPsalms.forEach(psalmNumber => {
    const currentCount = countsMap.get(psalmNumber) || 0;
    countsMap.set(psalmNumber, currentCount + 1);
  });
  
  return countsMap;
};
