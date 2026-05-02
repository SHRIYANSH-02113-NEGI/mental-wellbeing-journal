export async function submitEntry(data) {
  try {
    // 🔥 get/create userId
    let userId = localStorage.getItem("userId");

    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userId", userId);
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/entry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId // 🔥 important
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }

    return result;

  } catch (error) {
    console.error("Submit Entry Error:", error.message);
    throw error;
  }
}
