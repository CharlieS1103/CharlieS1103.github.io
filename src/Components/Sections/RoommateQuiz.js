//@ts-check

import React, { useState } from "react";
import '../../styles/RoommateQuiz.scss'; // Import the SCSS file
import Question from './Question';

const guestPolicyOptions = ["No guests", "Occasional guests", "Frequent guests"];

const questions = [
  new Question("Sleep Schedule:", "slider"),
  new Question("Kick out?????:", "checkbox"),
  new Question("Music / vibes while studying:", "multiple-choice", ["Quiet", "Moderate", "Loud"]),
  new Question("How clean do you keep the room:", "slider"),
  new Question("Do you use alarms?", "checkbox"),
  new Question("Background noise at night / in morning while you're trying to sleep:", "multiple-choice", ["Quiet", "Moderate", "Loud"]),
  new Question("Guest Policy:", "radio", guestPolicyOptions)
];

function RoommateQuiz() {
  const [formData, setFormData] = useState({
    cleanliness: "",
    sleepSchedule: [22, 6], // Default bed time from 10 PM to 6 AM
    kickOut: false,
    musicWhileStudying: "",
    roomCleanliness: 5,
    useAlarms: false,
    roomMessiness: 5,
    backgroundNoise: "",
    guestPolicy: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: checked
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSliderChange = (e, name) => {
    setFormData({
      ...formData,
      [name]: parseInt(e.target.value, 10)
    });
  };

  const handleSleepScheduleChange = (e, index) => {
    const newSleepSchedule = [...formData.sleepSchedule];
    newSleepSchedule[index] = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      sleepSchedule: newSleepSchedule
    });
  };

  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour} ${period}`;
  };

  const formatCleanliness = (value) => {
    if (value === 0) return "Very Messy";
    if (value === 10) return "Spotless";
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
  
    try {
      const response = await fetch('https://d8ef-2620-104-e001-a021-a95a-d245-a4f2-ba85.ngrok-free.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        alert('Results sent successfully!');
      } else {
        alert('Failed to send results.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while sending the results.');
    }
  };

  return (
    <div className="roommate-quiz">
      <h1 className="quiz-title">Roommate Quiz</h1>
      <form onSubmit={handleSubmit} className="quiz-form">
        {questions.map((question, index) => (
          <div key={index} className="form-group">
            <label className="form-label">{question.label}</label>
            {question.type === "multiple-choice" && (
              question.options.map((option) => (
                <div key={option} className="radio-group">
                  <input
                    type="radio"
                    name={question.label}
                    value={option}
                    checked={formData[question.label] === option}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <label>{option}</label>
                </div>
              ))
            )}
            {question.type === "slider" && (
              <>
                {question.label === "Sleep Schedule:" && (
                  <>
                    <div className="slider-group">
                      <label>Bed Time:</label>
                      <input
                        type="range"
                        name="bedTime"
                        min="0"
                        max="23"
                        value={formData.sleepSchedule[0]}
                        onChange={(e) => handleSleepScheduleChange(e, 0)}
                        className="form-slider"
                      />
                      <span>{formatTime(formData.sleepSchedule[0])}</span>
                    </div>
                    <div className="slider-group">
                      <label>Wake Up Time:</label>
                      <input
                        type="range"
                        name="wakeUpTime"
                        min="0"
                        max="23"
                        value={formData.sleepSchedule[1]}
                        onChange={(e) => handleSleepScheduleChange(e, 1)}
                        className="form-slider"
                      />
                      <span>{formatTime(formData.sleepSchedule[1])}</span>
                    </div>
                  </>
                )}
                {question.label === "How clean do you keep the room:" && (
                  <div className="slider-group">
                    <input
                      type="range"
                      name="roomCleanliness"
                      min="0"
                      max="10"
                      value={formData.roomCleanliness}
                      onChange={(e) => handleSliderChange(e, 'roomCleanliness')}
                      className="form-slider"
                    />
                    <span>{formatCleanliness(formData.roomCleanliness)}</span>
                  </div>
                )}
                {question.label !== "Sleep Schedule:" && question.label !== "How clean do you keep the room:" && (
                  <div className="slider-group">
                    <input
                      type="range"
                      name={question.label}
                      min="1"
                      max="10"
                      value={formData[question.label]}
                      onChange={(e) => handleSliderChange(e, question.label)}
                      className="form-slider"
                    />
                    <span>{formData[question.label]}</span>
                  </div>
                )}
              </>
            )}
            {question.type === "checkbox" && (
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name={question.label}
                  checked={formData[question.label]}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label>{formData[question.label] ? "Yes" : "No"}</label>
              </div>
            )}
            {question.type === "radio" && (
              question.options.map((option) => (
                <div key={option} className="radio-group">
                  <input
                    type="radio"
                    name={question.label}
                    value={option}
                    checked={formData[question.label] === option}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <label>{option}</label>
                </div>
              ))
            )}
          </div>
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
}

export default RoommateQuiz;