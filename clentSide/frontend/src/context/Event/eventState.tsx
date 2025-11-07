import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useJwtInterceptors from "../../Hooks/useJwtInterceptors";
import AlertContext from "../Alert/AlertContext";
import UserState from "../User/UserState";
import { useNavigate } from "react-router-dom";

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  creator_id: string;
  attendees?: [];
}

export interface EventContextType {
  tracker: boolean;
  events: Event[];
  selectedEvent: Event | null;
  createEvent: (data: Partial<Event>) => Promise<void>;
  getAllEvents: () => Promise<void>;
  getEventById: (id: string) => Promise<void>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  setAttendence: () => void;
  leaveEvent: (id: string) => Promise<void>;
  creator: Record<string, unknown>;
}

interface EventStateProps {
  children: ReactNode;
}

const EventContext = createContext<EventContextType>({} as EventContextType);

export const EventProvider: React.FC<EventStateProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [creator, setCreator] = useState(null);

  const [attendees, setAttendence] = useState<any[]>([]);
  const { showAlert } = useContext(AlertContext);
  const [tracker, setTracker] = useState(false);
  const axiosPrivateInstance = useJwtInterceptors();
  const navigate = useNavigate();

  const createEvent = async (data: Partial<Event>) => {
    try {
      const response = await axiosPrivateInstance.post(
        "/api/events/createEvent",
        data
      );
      showAlert(
        response?.data?.message || "Event created successfully",
        "success"
      );
      await getAllEvents();
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to create event",
        "danger"
      );
    }
  };

  const getAllEvents = async () => {
    try {
      const response = await axiosPrivateInstance.get(
        "/api/events/getAllEvent"
      );
      console.log(response);
      setEvents(response?.data?.events || []);
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to fetch events",
        "danger"
      );
    }
  };

  const getEventById = async (id: string) => {
    try {
      const response = await axiosPrivateInstance.get(
        `/api/events/getEventById?eventId=${id}`
      );
      console.log(response);
      setAttendence(response?.data?.attendees);
      setSelectedEvent(response?.data?.event || null);
      setCreator(response.data.creator);
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to fetch event details",
        "danger"
      );
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    try {
      const response = await axiosPrivateInstance.post(
        `/api/events/updateEvent?eventId=${id}`,
        { ...data }
      );
      showAlert(
        response?.data?.message || "Event updated successfully",
        "success"
      );

      await getAllEvents();
      navigate("/home");
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to update event",
        "danger"
      );
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await axiosPrivateInstance.delete(
        `/api/events/deleteEvent?eventId=${id}`
      );
      showAlert(
        response?.data?.message || "Event deleted successfully",
        "success"
      );
      await getAllEvents();
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to delete event",
        "danger"
      );
    }
  };

  const joinEvent = async (id: string) => {
    try {
      console.log("-------------------->", id);
      const response = await axiosPrivateInstance.post(
        `/api/events/joinEvent?eventId=${id}`
      );
      console.log(response.error);
      if (response) {
        setTracker(true);
      }
      showAlert(
        response?.data?.message || "Successfully joined event",
        "success"
      );
      await getEventById(id);
    } catch (error: any) {
      if (error.response.data.error === "You already joined this event") {
        setTracker(true);
      }
      showAlert(
        error?.response?.data?.message || "Failed to join event",
        "danger"
      );
    }
  };

  const leaveEvent = async (id: string) => {
    try {
      const response = await axiosPrivateInstance.delete(
        `/api/events/leaveEvent?eventId=${id}`
      );
      if (response) {
        setTracker(false);
      }
      showAlert(
        response?.data?.message || "Successfully left event",
        "success"
      );
      await getEventById(id);
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Failed to leave event",
        "danger"
      );
    }
  };

  const value: EventContextType = {
    events,
    selectedEvent,
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    attendees,
    tracker,
    creator,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

export default EventContext;
