import { SystemInfo, ConnectionInfo, UserInfo } from "../types/APITypes";

const BASE_URL = `http://${window.location.hostname}`; //TEST

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}

export async function login(data: UserInfo): Promise<UserInfo> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  return await response.json();
}

export async function updateConnectionData(data: ConnectionInfo): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (result.status !== 200) {
    throw new Error("Error in response: " + result.message);
  }
  return response.ok; // Devuelve true si la respuesta es 200 OK
}

export async function fetchSystemInfo(): Promise<SystemInfo> {
  return await fetchAPI("/systemInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function fetchConnectionInfo(): Promise<ConnectionInfo> {
  return await fetchAPI("/connectionInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function fetchUserInfo(): Promise<UserInfo> {
  return await fetchAPI("/userInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
