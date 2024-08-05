import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './Home.css';

const Home = () => {
  const genAI = new GoogleGenerativeAI('');
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const [aiResponse, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }

  const [answer, setAnswer] = useState('');

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value);
  }

  // Generative AI Call to fetch dishes
  async function aiRun() {
    setLoading(true);
    const prompt = `Explain in different paragraphs whether the answer provided with the question is correct,try removing the astricks in the entire text returned as answer: ${search}? ${answer},if not, then explain the correct answer.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    setResponse(text);
    setLoading(false);
  }

  // Button event trigger to consume Gemini API
  const handleClick = () => {
    aiRun();
  }

  return (
    <div className="container">
      <h1 className="title">Generative AI for Answer Verification!</h1>
      <p className="subtitle">Built by Swastik Garg using ReactJS + Google Gemini</p>

      <div className="input-container">
        <input
          className="search-input"
          placeholder="Enter your question..."
          onChange={handleChangeSearch}
        />
        <input
          className="search-input"
          placeholder="Enter your answer..."
          onChange={handleChangeAnswer}
        />
        <button className="search-button" onClick={handleClick}>Search</button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading">Loading...</p>
        </div>
      ) : (
        <div className="response-container">
          <p className="response">{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
