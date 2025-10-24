import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

const EventCard = ({ event, onUpdate, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    dateTime: event.dateTime ? new Date(event.dateTime).toISOString().slice(0, 16) : "",
    imageUrl: event.imageUrl || "",
    notifyBeforeMins: event.notifyBeforeMins || 30,
    status: event.status || "upcoming",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const res = await api.put(`/events/${event._id}`, { ...formData, user: user._id });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update event");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${event._id}`);
      onDelete(event._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = event.status === "upcoming" ? "completed" : "upcoming";
      const res = await api.put(`/events/${event._id}`, { status: newStatus, user: user._id });
      onUpdate(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-4 rounded shadow-md">
      {editing ? (
        <div>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Title" />
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Description" />
          <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Image URL" />
          <input type="number" name="notifyBeforeMins" value={formData.notifyBeforeMins} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Notify Before Minutes" />
          <div className="flex gap-2 mt-2">
            <button onClick={handleSave} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover rounded mb-3" />}
          <h2 className="text-xl font-bold">{event.title}</h2>
          <p className="text-gray-700">{event.description}</p>
          <p>{new Date(event.dateTime).toLocaleString()}</p>
          <p className={event.status === "upcoming" ? "text-green-500" : "text-gray-500"}>{event.status.toUpperCase()}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={() => setEditing(true)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
            <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            <button onClick={toggleStatus} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              {event.status === "upcoming" ? "Mark Completed" : "Mark Upcoming"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;
