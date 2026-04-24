import "./../styles/todo.css";
import API from "../api.js";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../services/tasks";

export default function Todo() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlUser = searchParams.get("user");

    if (urlToken) {
      localStorage.setItem("token", urlToken);

      if (urlUser) {
        localStorage.setItem("user", decodeURIComponent(urlUser));
      }

      navigate("/todo");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get("/tasks/notes");
        setNotes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const res = await createTask({ title: task });
      setTasks([...tasks, res.data]);
      setTask("");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const task = tasks.find(t => t._id === id);

      const res = await updateTask(id, {
        ...task, 
        completed: !completed,
      });
      setTasks(prev =>
        prev.map(t => t._id === id ? res.data : t)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (taskObj) => {
    setEditingId(taskObj._id);
    setEditText(taskObj.title);
  };

  const saveEdit = async () => {
    try {
      const res = await updateTask(editingId, { title: editText });
      setTasks(tasks.map(t => t._id === editingId ? res.data : t));
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.log(err);
    }
  };

  const addNote = async () => {
  try {
    const res = await API.post("/tasks", {
      title: " ",
      type: "note",
    });

    setNotes(prev => [...prev, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const updateNote = (id, value) => {
    setNotes(prev =>
      prev.map(n => n._id === id ? { ...n, title: value } : n)
    );

    API.put(`/tasks/${id}`, {
      title: value,
    }).catch(err => console.log(err));
  };

  const removeNote = async (id) => {
    try {
      await deleteTask(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const handlePayment = async () => {
    try {
      const res = await API.post("/payment/create-order", {
        plan: "plus",
      });

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SnapTask",
        description: "Upgrade to Premium",
        order_id: order.id,

        handler: async function (response) {
          try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const userId = currentUser?._id;

            await API.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            });
            const updatedUser = { ...currentUser, isPremium: true, plan: "plus" };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
          } catch (err) {
            console.log(err);
          }
        },

        theme: {
          color: "#7c3aed",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="todo">

      <div className="sidebar">
        <div className="sidebar-top">
          <h2 className="logo">SnapTask</h2>

          <div className="menu">
            <p className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
              All Tasks
            </p>

            <p className={filter === "active" ? "active" : ""} onClick={() => setFilter("active")}>
              Active
            </p>

            <p className={filter === "completed" ? "active" : ""} onClick={() => setFilter("completed")}>
              Completed
            </p>
          </div>
        </div>

        <div className="sidebar-bottom">

          <p className="plan-status">
            {user?.isPremium ? "✨ Pro Plan" : " ⚪ Free Plan"}
          </p>

          {!user?.isPremium && (
            <button className="premium" onClick={() => setShowPremium(true)}>
              Go Premium ✨
            </button>
          )}

          <button className="logout" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/auth?mode=login");}}>
            Logout
          </button>
        </div>
      </div>

      <div className={`main ${!user?.isPremium ? "centered" : ""}`}>

        {showPremium ? (

          <div className="premium-page">

            <button
              className="close-btn"
              onClick={() => setShowPremium(false)}
            >
              ✕
            </button>

            <h1>Upgrade to Premium ✨</h1>

            <p className="price">₹199</p>

            <div className="features">
              <p>⚪ Sticky Notes access</p>
              <p>⚪ Better productivity</p>
              <p>⚪ Organize thoughts easily</p>
            </div>

            <button
              className="continue-btn"
              onClick={() => {
                setShowPremium(false);
                handlePayment();
              }}
            >
              Continue
            </button>

          </div>

        ) : (

          <>
            <div className="tasks">
              <h1>What are we doing today?</h1>

              <div className="task-input">
                <input
                  type="text"
                  placeholder="Add a task..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
              </div>

              <div className="task-list">
                {filteredTasks.map((t) => (
                  <div className={`task-item ${t.completed ? "done" : ""}`} key={t._id}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t._id, t.completed)}
                    />

                    <div className="task-content">
                      {editingId === t._id ? (
                        <input
                          className="edit-input"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          autoFocus
                        />
                      ) : (
                        <span>{t.title}</span>
                      )}
                    </div>

                    <div className="actions">
                      {editingId === t._id ? (
                        <button onClick={saveEdit}>✅</button>
                      ) : (
                        <button onClick={() => startEdit(t)}>✏️</button>
                      )}
                      <button onClick={() => removeTask(t._id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user?.isPremium && (
              <div className="notes">
                <h3>Notes</h3>

                <div className="notes-grid">
                  {notes.map((n) => (
                    <div className="note-card" key={n._id}>
                      <textarea
                        value={n.title || ""}
                        onChange={(e) => updateNote(n._id, e.target.value)}
                        placeholder="Write something..."
                      />

                      <button
                        className="delete-note"
                        onClick={() => removeNote(n._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <button className="add-note" onClick={addNote}>
                  📋 Add Note
                </button>
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}