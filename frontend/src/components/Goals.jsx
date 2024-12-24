// components/Goals.js
import React, { useState, useEffect } from "react";
import { getGoals, createGoal, updateGoal } from "../services/api";
import Navbar from "./Navbar";
import "./css/Goals.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: 0,
    deadline: "",
    category: "",
  });
  const [targetAmount, setTargetAmount] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data } = await getGoals();
        setGoals(data);
        console.log("fetchGoals:", data);
        checkNotifications(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      const createdGoal = await createGoal(newGoal);
      setGoals((prevGoals) => [...prevGoals, createdGoal]);
      setNewGoal({ title: "", targetAmount: "0", deadline: "", category: "" });
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleUpdateGoal = async (id) => {
    try {
      const updatedGoal = await updateGoal(id, { targetAmount });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === updatedGoal._id ? updatedGoal : goal
        )
      );
      checkNotifications(
        goals.map((goal) =>
          goal._id === updatedGoal._id
            ? { ...goal, targetAmount: updatedGoal.targetAmount }
            : goal
        )
      );
      setTargetAmount(0);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const checkNotifications = (goals) => {
    const threshold = 50; // Set a threshold for proximity to the target amount
    goals.forEach((goal) => {
      const remainingAmount = goal.currentAmount - (goal.targetAmount || 0);
      if (remainingAmount > 0 && remainingAmount <= threshold) {
        setNotification(
          `You're close to reaching your goal "${goal.title}"! Only $${remainingAmount} left.`
        );
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="goals-container">
        <h1 className="goals-heading">Goals</h1>

        {/* Create New Goal */}
        <form className="goals-form" onSubmit={handleCreateGoal}>
          <input
            className="goals-form-input"
            type="text"
            placeholder="Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            required
          />
          <input
            className="goals-form-input"
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={(e) =>
              setNewGoal({ ...newGoal, targetAmount: +e.target.value })
            }
            required
          />
          <input
            className="goals-form-input"
            type="date"
            value={newGoal.deadline}
            onChange={(e) =>
              setNewGoal({ ...newGoal, deadline: e.target.value })
            }
            required
          />
          <input
            className="goals-form-input"
            type="text"
            placeholder="Category"
            value={newGoal.category}
            onChange={(e) =>
              setNewGoal({ ...newGoal, category: e.target.value })
            }
            required
          />
          <button className="goals-form-button" type="submit">
            Add Goal
          </button>
        </form>

        {notification && (
          <div className="goals-notification">{notification}</div>
        )}

        {/* List Goals */}
        {goals.length === 0 ? (
          <p className="goals-empty-message">
            No goals found. Add your first goal!
          </p>
        ) : (
          <ul className="goals-list">
            {goals.map((goal) => (
              <li className="goals-list-item" key={goal._id}>
                <h3 className="goals-list-item-title">{goal.title}</h3>
                <p className="goals-list-item-text">
                  Target Amount: {goal.targetAmount}
                </p>
                <p className="goals-list-item-text">
                  Current Amount: {goal.currentAmount || 0}
                </p>
                <p className="goals-list-item-text">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </p>
                <p className="goals-list-item-text">
                  Category: {goal.category}
                </p>
                <input
                  className="goals-list-item-input"
                  type="number"
                  placeholder="Add Amount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(+e.target.value)}
                />
                <button
                  className="goals-list-item-button"
                  onClick={() => handleUpdateGoal(goal._id)}
                >
                  Update
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Goals;
