import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedback] = useState([]);
  const [status, setStatus] = useState("");

  const fetchFeedback = async () => {
    const res = await fetch("http://localhost:3000/api/feedback");
    const data = await res.json();
    setFeedback(data.reverse());
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, message }),
    });

    if (res.ok) {
      setStatus("Feedback submitted successfully!");
      setName("");
      setMessage("");
      fetchFeedback();
    } else {
      setStatus("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div>
      <h2>Submit Feedback</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: "10px" }}
        />
        <textarea
          style={{ width: "100%", marginBottom: 10, padding: "10px" }}
          placeholder="Enter your feedback here"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />{" "}
        <br></br>
        <button
          type="submit"
          style={{
            padding: "10px",
            background: "blue",
            color: "white",
            textAlign: "center",
            marginLeft: "140px",
          }}
        >
          {" "}
          Send feedback{" "}
        </button>
      </form>
      <p>{status}</p>

      <h3>Feedbacks: </h3>
      {feedbacks.map((f, i) => (
        <div
          key={i}
          style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}
        >
          <strong>{f.name}</strong>{" "}
          <em>({new Date(f.date).toLocaleString()})</em>
          <p>{f.message}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
