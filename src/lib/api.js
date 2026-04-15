export const API_BASE_URL = "/api/v1";

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  let data;
  try {
    if (text && !contentType.includes("application/json")) {
      throw new Error("Non-JSON response");
    }
    data = text ? JSON.parse(text) : {};
    console.log("API Response:", data);
  } catch (err) {
    throw new Error(`Failed to reach the API at ${url}. Check that the frontend is running on port 3001 and the backend is running on ${process.env.NEXT_PUBLIC_BACKEND_ORIGIN || "http://localhost:3000"}.`);
  }

  if (!response.ok) {
    const message = data?.error?.message || data?.message || "An error occurred";
    throw new Error(message);
  }

  return data;
}
