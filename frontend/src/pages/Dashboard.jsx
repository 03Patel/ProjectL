import React, { useEffect, useState, useContext } from "react";
import { api } from "../api";
import EventCard from "../components/EventCard";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: "",
    imageUrl: "",
    notifyBeforeMins: 30
  });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/events", { ...formData, user: user._id });
      setEvents([res.data, ...events]);
      setShowForm(false);
      setFormData({ title:"", description:"", dateTime:"", imageUrl:"", notifyBeforeMins:30 });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create event");
    }
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e._id !== id));
  };

  const filteredEvents = events.filter(e => filter === "all" ? true : e.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Total: {events.length}</div>
        <div className="bg-white p-4 rounded shadow">Upcoming: {events.filter(e => e.status === "upcoming").length}</div>
        <div className="bg-white p-4 rounded shadow">Completed: {events.filter(e => e.status === "completed").length}</div>
      </div>

      <div className="mb-4">
        <button onClick={() => setFilter("all")} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">All</button>
        <button onClick={() => setFilter("upcoming")} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">Upcoming</button>
        <button onClick={() => setFilter("completed")} className="px-4 py-2 bg-gray-500 text-white rounded">Completed</button>
      </div>

      <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
        {showForm ? "Cancel" : "Add Event"}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-white p-6 rounded shadow-md mb-6"
            onSubmit={handleCreateEvent}
          >
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData,[e.target.name]: e.target.value})} className="w-full p-2 mb-3 border rounded" required/>
            <textarea name="description" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData,[e.target.name]: e.target.value})} className="w-full p-2 mb-3 border rounded"/>
            <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={e => setFormData({...formData,[e.target.name]: e.target.value})} className="w-full p-2 mb-3 border rounded" required/>
            <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData,[e.target.name]: e.target.value})} className="w-full p-2 mb-3 border rounded"/>
            <input type="number" name="notifyBeforeMins" placeholder="Notify Before Minutes" value={formData.notifyBeforeMins} onChange={e => setFormData({...formData,[e.target.name]: e.target.value})} className="w-full p-2 mb-3 border rounded"/>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Create Event</button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(e => (
          <EventCard key={e._id} event={e} onUpdate={handleUpdateEvent} onDelete={handleDeleteEvent} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
