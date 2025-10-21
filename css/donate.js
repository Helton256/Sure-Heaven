// Highlight selected donation amount and auto-fill the form
function selectAmount(amount) {
  document.querySelectorAll(".donation-card").forEach((card) => {
    card.classList.remove("selected");
  });
  event.currentTarget.classList.add("selected");
  document.getElementById("amount").value = amount;
}

// Handle form submission
document.getElementById("donateForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const amount = document.getElementById("amount").value.trim();
  const donationType = document.getElementById("donationType").value;

  if (!name || !email || !amount || !donationType) {
    alert("Please fill in all fields.");
    return;
  }

  alert(`Thank you, ${name}! You have donated $${amount} for ${donationType}.`);
  this.reset();

  document.querySelectorAll(".donation-card").forEach((card) =>
    card.classList.remove("selected")
  );
});
