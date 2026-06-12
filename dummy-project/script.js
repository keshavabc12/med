const pingButton = document.getElementById("pingButton");
const message = document.getElementById("message");

pingButton.addEventListener("click", () => {
  const now = new Date().toLocaleTimeString();
  message.textContent = `Hello from your dummy project! Time: ${now}`;
});
