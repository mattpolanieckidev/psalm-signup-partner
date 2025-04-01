
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Participant } from "@/types";
import { formatDistanceToNow } from "date-fns";

const ParticipantsList = ({ participants }: { participants: Participant[] }) => {
  if (participants.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-tehillim-blue/20">
      <CardHeader>
        <CardTitle className="text-center text-tehillim-blue">
          Our Tehillim Community ({participants.length}/150 psalms claimed)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-80">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-tehillim-blue/20 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Psalm</th>
                <th className="p-2 hidden md:table-cell">Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr 
                  key={participant.id} 
                  className="border-b border-tehillim-blue/10 hover:bg-tehillim-light"
                >
                  <td className="p-2 font-medium">{participant.name}</td>
                  <td className="p-2">Psalm {participant.psalmNumber}</td>
                  <td className="p-2 text-gray-500 hidden md:table-cell">
                    {formatDistanceToNow(new Date(participant.timestamp), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParticipantsList;
