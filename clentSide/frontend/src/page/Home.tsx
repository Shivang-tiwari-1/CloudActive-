import { useContext, useEffect, useState } from "react";
import AttendeesList from "../components/Attendence";
import UpdateEvent from "../components/UpateEvent";
import AlertContext from "../context/Alert/AlertContext";
import AuthContext from "../context/Auth/AuthContext";
import EventContext from "../context/Event/eventState";

const Home = () => {
  const {
    events,
    getAllEvents,
    joinEvent,
    leaveEvent,
    deleteEvent,
    attendees,
    selectedEvent,
    creator, // ✅ comma added
    tracker,
    getEventById,
  } = useContext(EventContext);

  const { auth } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await getAllEvents();
      } catch (error) {
        showAlert("Failed to fetch events", "danger");
      }
    };
    fetchEvents();
  }, []);

  const handleEventClick = async (id) => {
    setEventModalOpen(true);
    await getEventById(id);
  };

  const handleJoinLeave = async () => {
    console.log("---->", tracker, selectedEvent?.id);
    if (!selectedEvent?.id) {
      console.error("No selectedEvent selected");
      return;
    }

    try {
      if (!tracker) {
        console.log("Joining event", selectedEvent.id);
        await joinEvent(selectedEvent.id);
      } else {
        console.log("Leaving event", selectedEvent.id);
        await leaveEvent(selectedEvent.id);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleDeleteEvent = async (eventId: string) => {
    console.log(eventId);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteEvent(eventId);
      showAlert("Event deleted successfully", "success");
      await getAllEvents();
    } catch (error: any) {
      console.error("Delete Event Error:", error);
      showAlert(
        error?.response?.data?.message || "Failed to delete event",
        "danger"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Upcoming Events</h1>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition cursor-pointer overflow-hidden"
              onClick={() => handleEventClick(event.id)}
            >
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <p className="text-gray-500 mb-2">
                📅 {event.event_date} ⏰ {event.event_time}
              </p>
              <p className="text-gray-500 mb-4">📍 {event.location}</p>

              {event.creator_id === auth.user.id && (
                <div className="flex flex-col gap-2">
                  <button
                    className="w-full bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                  >
                    Delete Event
                  </button>

                  <button
                    className="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventModalOpen(true);
                      setSelectedEventId(event.id);
                      setUpdateModalOpen(true);
                    }}
                  >
                    Update Event
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No events available.</p>
      )}

      {/* Event Modal */}
      {eventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setEventModalOpen(false)}
            >
              ✕
            </button>

            {selectedEvent ? (
              <>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600 mb-2">
                  {selectedEvent.description}
                </p>
                <p className="text-gray-500 mb-2">
                  📅 {selectedEvent.event_date} ⏰ {selectedEvent.event_time}
                </p>
                <p className="text-gray-500 mb-2">
                  📍 {selectedEvent.location}
                </p>
                <p
                  className={`text-gray-500 mb-4 ${
                    selectedEvent.creator_id === auth.user.id ? "hidden" : ""
                  }`}
                >
                  Created by: {creator.name || "Unknown"}
                </p>

                {/* Join/Leave */}
                {selectedEvent.creator_id !== auth.user.id && (
                  <button
                    className={`w-full mb-4 ${
                      tracker
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-4 py-2 rounded-md transition`}
                    onClick={handleJoinLeave}
                  >
                    {tracker ? "Leave Event" : "Join Event"}
                  </button>
                )}

                {/* View Attendees */}
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  onClick={() => setAttendeesModalOpen(true)}
                >
                  View Attendees ({attendees?.length || 0})
                </button>
              </>
            ) : (
              <p className="text-gray-600 text-center py-4">
                Event details not available.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Attendees Modal */}
      {attendeesModalOpen && attendees && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setAttendeesModalOpen(false)}
            >
              ✕
            </button>
            <AttendeesList attendees={attendees} />
          </div>
        </div>
      )}

      {/* Update Event Modal */}
      {updateModalOpen && selectedEventId && selectedEvent && (
        <UpdateEvent
          eventId={selectedEventId}
          onClose={() => setUpdateModalOpen(false)}
          prefillData={selectedEvent}
        />
      )}
    </div>
  );
};

export default Home;
