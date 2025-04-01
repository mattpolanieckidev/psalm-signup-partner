
import { Participant } from "../types";

// For now, we'll use localStorage to persist data
const STORAGE_KEY = "tehillim_participants";

export const saveParticipant = (participant: Omit<Participant, "id" | "timestamp">): Participant => {
  const participants = getAllParticipants();
  
  const newParticipant: Participant = {
    id: Math.random().toString(36).substr(2, 9),
    name: participant.name,
    psalmNumber: participant.psalmNumber,
    timestamp: new Date().toISOString(),
  };
  
  participants.push(newParticipant);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  
  return newParticipant;
};

export const getAllParticipants = (): Participant[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getClaimedPsalms = (): number[] => {
  return getAllParticipants().map(p => p.psalmNumber);
};

export const isPsalmClaimed = (psalmNumber: number): boolean => {
  return getClaimedPsalms().includes(psalmNumber);
};
