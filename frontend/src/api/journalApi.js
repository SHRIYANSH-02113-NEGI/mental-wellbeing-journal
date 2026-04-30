export async function submitEntry(data) {
  await fetch("https://mental-backend-heru.onrender.com/api/entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
