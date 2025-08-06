// src/components/FeatureCardsSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Reusable card component
const FeatureCard = ({ title, description, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(navigateTo)}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition-shadow duration-200"
    >
      <h3 className="text-2xl font-bold text-red-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Container with all three cards
const FeatureCardsSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        title="Class Chats"
        description="Join or start discussions around your courses and subjects."
        navigateTo="/class"
      />
      <FeatureCard
        title="Major Groups"
        description="Talk with students in your major and share resources."
        navigateTo="/major"
      />
      <FeatureCard
        title="Your Messages"
        description="Chat privately with others in a clean and secure interface."
        navigateTo="/messages"
      />
    </section>
  );
};

export default FeatureCardsSection;
