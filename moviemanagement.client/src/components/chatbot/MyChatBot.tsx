import React from "react";
import ChatBot from "react-chatbotify"; // Import the ChatBot component

// Bot configuration with basic settings
const botConfig = {
  botName: "MyBot", // Bot's name
  initialMessages: [
    {
      type: "text", // Message type (could also be "image", "button", etc.)
      text: "Hello! How can I help you today?", // Initial message when the bot opens
    },
  ],
  state: {}, // Custom state if needed (can store data here)
  customComponents: {},
  customStyles: {
    // Optionally style the chat window (e.g., change bubble colors)
    botMessageBox: {
      backgroundColor: "#00bcd4",
    },
    chatButton: {
      backgroundColor: "#ff4081",
    },
  },
};

// Conversation flow that defines the message sequence
const flow = {
  start: {
    message: "Hello there! How can I assist you today?",
    path: "askHelp", // Directing to the next step (path)
  },
  askHelp: {
    message: "Would you like help with our services?",
    trigger: "showOptions", // This triggers the options to appear
  },
  showOptions: {
    options: ["Yes, tell me more!", "No, just browsing."],
  },
  provideInfo: {
    message:
      "We offer a variety of services like web development, app development, and more!",
    path: "askMoreQuestions",
  },
  askMoreQuestions: {
    message: "Would you like to know more about our services?",
    options: ["Yes, tell me more!", "No, thanks."], // Adjusted to string[] type
  },
  moreDetails: {
    message:
      "Sure! We specialize in custom software solutions and have a team of experienced developers.",
    path: "goodbye",
  },
  goodbye: {
    message:
      "Thanks for visiting! If you need anything else, feel free to ask. Goodbye!",
  },
};

const MyChatBot = () => {
  const id = "my-chatbot-id"; // Unique identifier for the bot

  return (
    <div className="fixed bottom-10 right-4 z-[1000]">
      <ChatBot
        id={id} // Unique identifier for the bot
        // Removed botName as it is not a valid prop for ChatBot
        initialMessages={botConfig.initialMessages} // Initial messages
        customStyles={botConfig.customStyles} // Custom styles
        flow={flow} // Flow of conversation
      />
    </div>
  );
};

export default MyChatBot;
