const pool = require("../config/postgress.db");

exports.createEvent = async (req, res) => {
  try {
    console.log(req.user);

    const { title, description, event_date, event_time, location } = req.body;
    if (!title || !event_date || !event_time || !location) {
      return res.status(400).json({
        error: "title, date, time, and location are required",
      });
    }

    const creatorId = req.user?.id;
    if (!creatorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(
      `INSERT INTO events 
       (title, description, event_date, event_time, location, creator_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING 
         id, title, description, event_date, event_time, location, creator_id, created_at`,
      [title, description, event_date, event_time, location, creatorId]
    );
    const event = result.rows[0];
    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({
      error: "Error occurred while creating event: " + error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const query = `
      SELECT 
        e.id,
        e.title,
        e.description,
        e.event_date,
        e.event_time,
        e.location,
        e.creator_id,
        e.created_at,
        u.name AS creator_name,
        -- Count attendees
        (
          SELECT COUNT(*) 
          FROM event_attendees ea 
          WHERE ea.event_id = e.id
        ) AS attendee_count
      FROM events e
      JOIN users u ON e.creator_id = u.id
      ORDER BY e.event_date ASC, e.event_time ASC;
    `;

    const result = await pool.query(query);
    if (result.length === 0) {
      return res.status(200).json({ message: " result are not available" });
    } else {
      return res.status(200).json({
        success: true,
        events: result.rows,
      });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const eventId = req.query.eventId;
    console.log(eventId);
    if (eventId === undefined) {
      return res.status(500).json({ error: "error occurred" });
    }
    const loggedInUserId = req.user.id;

    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];

    const creatorResult = await pool.query(
      "SELECT id, name, phone, created_at FROM users WHERE id = $1",
      [event.creator_id]
    );

    const creator = creatorResult.rows[0];

    const attendeesResult = await pool.query(
      `SELECT u.id, u.name, u.phone 
       FROM event_attendees ea
       JOIN users u ON ea.user_id = u.id
       WHERE ea.event_id = $1`,
      [eventId]
    );

    const attendees = attendeesResult.rows;

    const joined = attendees.some((a) => a.id === loggedInUserId);

    const responseObject = {
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        event_time: event.event_time,
        location: event.location,
        creator_id: creator.id,
      },
      creator: creator,
      attendees: attendees,
      joinedStatus: joined,
    };

    return res.status(200).json(responseObject);
  } catch (error) {
    console.error("getEventById error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    console.log(req.body);
    const eventId = req.query.eventId;
    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const userId = req.user.id;

    const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);
    const event = eventResult.rows[0];

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.creator_id !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to edit this event" });
    }

    const title = req.body.title ?? event.title;
    const description = req.body.description ?? event.description;
    const event_date = req.body.event_date ?? event.event_date;
    const event_time = req.body.event_time ?? event.event_time;
    const location = req.body.location ?? event.location;

    const updatedEvent = await pool.query(
      `UPDATE events
       SET title = $1,
           description = $2,
           event_date = $3,
           event_time = $4,
           location = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, description, event_date, event_time, location, eventId]
    );

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent.rows[0],
    });
  } catch (error) {
    console.error("updateEvent error:", error);
    return res
      .status(500)
      .json({ error: "Error updating event: " + error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.query.eventId;
  if (eventId === undefined) {
    return res.status(500).json({ error: "error occurred" });
  }
  const userId = req.user.id;

  try {
    const eventResult = await pool.query(
      "SELECT id, creator_id FROM events WHERE id = $1",
      [eventId]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const event = eventResult.rows[0];

    if (event.creator_id !== userId) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this event" });
    }

    await pool.query("DELETE FROM events WHERE id = $1", [eventId]);

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.query.eventId;
    console.log(eventId);
    if (eventId === undefined) {
      return res.status(500).json({ error: "no id found in the query" });
    }
    const eventCheck = await pool.query("SELECT id FROM events WHERE id = $1", [
      eventId,
    ]);

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const existing = await pool.query(
      "SELECT * FROM event_attendees WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    console.log(existing.rows);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "You already joined this event" });
    }

    await pool.query(
      `INSERT INTO event_attendees (user_id, event_id)
       VALUES ($1, $2)`,
      [userId, eventId]
    );

    return res.status(200).json({ message: "Joined event successfully" });
  } catch (error) {
    console.error("Join event error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.leaveEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.query.eventId;
    console.log(eventId);
    if (eventId === undefined) {
      return res.status(500).json({ error: "error occurred" });
    }
    const checkJoin = await pool.query(
      `SELECT * FROM event_attendees 
       WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );

    if (checkJoin.rows.length === 0) {
      return res.status(400).json({
        message: "You have not joined this event.",
      });
    }

    await pool.query(
      `DELETE FROM event_attendees 
       WHERE user_id = $1 AND event_id = $2`,
      [userId, eventId]
    );

    return res.status(200).json({
      message: "You have successfully left the event.",
    });
  } catch (error) {
    console.error("leaveEvent error:", error);
    return res.status(500).json({
      message: "Server error while leaving event.",
      error: error.message,
    });
  }
};
