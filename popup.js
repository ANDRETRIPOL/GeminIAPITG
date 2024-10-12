const API_KEY = 'AIzaSyAptJ6VXqCvXL0GqJJJ3FLQ8KoannOZSiE';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('userInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message) {
    appendMessage(message, 'user-message');
    userInput.value = '';

    animateSendButton();
    fetchGeminiResponse(message);  // Запрос к API
  }
}

function appendMessage(message, className) {
  const chatbox = document.getElementById('chatbox');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('message', className);
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function animateSendButton() {
  const sendButton = document.getElementById('sendButton');
  sendButton.classList.add('clicked');
  setTimeout(() => {
    sendButton.classList.remove('clicked');
  }, 500);
}

async function fetchGeminiResponse(message) {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: { text: message }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let aiResponse = data.candidates[0].content;
      appendMessage(aiResponse, 'ai-message');
    } else {
      appendMessage('Извините, я не смог сгенерировать ответ.', 'ai-message');
    }
  } catch (error) {
    appendMessage('Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.', 'system');
    console.error('Error:', error);
  }
}
