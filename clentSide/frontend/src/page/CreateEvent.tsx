// src/components/Event/CreateEvent.tsx
import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import EventContext from "../context/Event/eventState";
import AlertContext from "../context/Alert/AlertContext";

interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
}

const CreateEvent: React.FC = () => {
  const { createEvent } = useContext(EventContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  // In the validate function
  const validate = (): boolean => {
    const newErrors: Partial<EventFormData> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().split(/\s+/).length > 10) {
      newErrors.title = "Title cannot exceed 10 words";
    }

    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.event_date.trim())
      newErrors.event_date = "Event date is required";
    if (!formData.event_time.trim())
      newErrors.event_time = "Event time is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Optional: limit typing in the input itself
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      const words = value.trim().split(/\s+/);
      if (words.length > 10) return; // prevent typing beyond 10 words
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear error on change
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createEvent(formData);
      showAlert("Event created successfully!", "success");
      navigate("/home");
    } catch (error) {
      showAlert("Failed to create event", "danger");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Create Event
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Event Date
          </label>
          <input
            type="date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.event_date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.event_date && (
            <p className="text-red-500 text-sm mt-1">{errors.event_date}</p>
          )}
        </div>

        {/* Event Time */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Event Time
          </label>
          <input
            type="time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.event_time ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.event_time && (
            <p className="text-red-500 text-sm mt-1">{errors.event_time}</p>
          )}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none ${
              errors.location ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
