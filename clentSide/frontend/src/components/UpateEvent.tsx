import React, { useState, useContext, useEffect } from "react";
import EventContext from "../context/Event/eventState";
import AlertContext from "../context/Alert/AlertContext";

interface EventFormData {
  title?: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
}

interface UpdateEventModalProps {
  eventId: string;
  initialData?: EventFormData; 
  onClose: () => void;
}

const UpdateEventModal: React.FC<UpdateEventModalProps> = ({
  eventId,
  initialData,
  onClose,
}) => {
  const { updateEvent } = useContext(EventContext);
  const { showAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState<EventFormData>(
    initialData || {}
  );
  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = (): boolean => {
    const newErrors: Partial<EventFormData> = {};
    if (formData.title && formData.title.split(" ").length > 10)
      newErrors.title = "Title cannot exceed 10 words";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasAnyField =
      formData.title ||
      formData.description ||
      formData.event_date ||
      formData.event_time ||
      formData.location;

    if (!hasAnyField) {
      showAlert("Please fill at least one field to update", "danger");
      return;
    }

    if (!validate()) return;

    try {
      await updateEvent(eventId, formData);
      showAlert("Event updated successfully!", "success");
      onClose(); 
    } catch (error) {
      showAlert("Failed to update event", "danger");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Update Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Event Date
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Event Time
            </label>
            <input
              type="time"
              name="event_time"
              value={formData.event_time || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
          >
            Update Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEventModal;
