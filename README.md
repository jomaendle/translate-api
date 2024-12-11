# Offline-working Language Translator

This is a simple offline-working language translator, based on Google Chrome's [Built in AI API's](https://developer.chrome.com/docs/ai/built-in-apis).

## Features
- Translate text from one language to another using [Translation API](https://github.com/webmachinelearning/translation-api).
- Speech to text and text to speech using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).
- Flashcard generation using the Prompt API

## Requirements
- Google Chrome 131+ or Canary 131+ (for using Flashcards)
- Enabled Experimental Web Platform features in chrome://flags
  - Experimental translation API 
  - Prompt API for Gemini Nano
  - Enables optimization guide on device

## Technologies Used
- React as the frontend framework
- Tailwind CSS for styling
- Vite as the build tool
- v0 to create the UI

## Getting Started
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm run dev` to start the development server