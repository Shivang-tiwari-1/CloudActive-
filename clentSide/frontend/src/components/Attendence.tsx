import React from "react";

interface Attendee {
  user_id: string;
  event_id: string;
  joined_at: string;
  name?: string;
}

interface AttendeesListProps {
  attendees: Attendee[];
}

const AttendeesList: React.FC<AttendeesListProps> = ({ attendees }) => {
  if (!attendees || attendees.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No attendees have joined this event yet.
      </div>
    );
  }
  console.log(attendees);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Event Attendees
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {attendees.map((attendee, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-start space-y-2 hover:shadow-xl transition"
          >
            <p className="text-gray-700 font-semibold">
              Name: <span className="font-normal">{attendee?.name}</span>
            </p>
            <p className="text-gray-700 font-semibold">
              Phone: <span className="font-normal">{attendee?.phone}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendeesList;
