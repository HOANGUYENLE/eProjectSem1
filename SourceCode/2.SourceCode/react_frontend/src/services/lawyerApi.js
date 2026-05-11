import {
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  saveAuthFromPayload,
} from "./authStorage";

const API_BASE = "http://127.0.0.1:8000/api";

async function request(url, options = {}) {
  const token = getStoredToken();

  const headers = {
    Accept: "application/json",
    ...(options.isForm ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${url}`, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.err || data.user_err || data.password_err || "Request failed");
  }

  if (data.user_err || data.password_err || data.register_err || data.err) {
    throw new Error(data.user_err || data.password_err || data.register_err || data.err);
  }

  return data;
}

function buildFormData(payload = {}) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(`${key}[]`, item));
      return;
    }

    formData.append(key, value);
  });

  return formData;
}

export async function lawyerLogin(credentials) {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  saveAuthFromPayload(data);
  return data;
}

export async function lawyerLogout() {
  try {
    const token = getStoredToken();
    /*
    if (token) {
      await request("/logout", {
        method: "POST",
      });
    }
    */
  } finally {
    clearStoredUser();
  }
}

export function getCurrentLawyer() {
  const user = getStoredUser();
  if (!user) return null;
  return user.role === "lawyer" ? user : null;
}

export async function getLawyerDashboard() {
  return request("/lawyer/dashboard");
}

export async function getLawyerProfile() {
  return request("/lawyer/profile");
}

export async function updateLawyerProfile(payload) {
  return request("/lawyer/profile", {
    method: "POST",
    body: buildFormData(payload),
    isForm: true,
  });
}

export async function getLawyerSpecializations() {
  return request("/lawyer/specializations");
}

export async function saveLawyerSpecializations(selectedIds) {
  return request("/lawyer/specializations", {
    method: "POST",
    body: JSON.stringify({
      specialization_ids: selectedIds,
    }),
  });
}

export async function getLawyerSlots() {
  return request("/lawyer/slots");
}

export async function createLawyerSlot(payload) {
  return request("/lawyer/slots", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLawyerSlot(id, payload) {
  return request(`/lawyer/slots/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLawyerSlot(id) {
  return request(`/lawyer/slots/${id}`, {
    method: "DELETE",
  });
}

/* customer -> join as lawyer */
export async function getAllCities() {
  return request("/allCities");
}

export async function getAllSpecializations() {
  return request("/allSpecs");
}

export async function submitLawyerApplication(payload) {
  return request("/sendDocument", {
    method: "POST",
    body: buildFormData(payload),
    isForm: true,
  });
}