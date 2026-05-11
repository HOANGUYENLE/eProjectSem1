const STORAGE_KEY = "user";
export const AUTH_CHANGED_EVENT = "auth-changed";

function roleNameFromId(roleId) {
  if (Number(roleId) === 1) return "admin";
  if (Number(roleId) === 2) return "customer";
  if (Number(roleId) === 3) return "lawyer";
  return "";
}

function safeParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function normalizeAuthPayload(payload = {}) {
  const rawUser = payload.user || payload.name || payload || {};
  const rawRole = rawUser.role || payload.role || {};

  const role =
    rawRole.RoleName ||
    rawRole.roleName ||
    rawUser.role ||
    roleNameFromId(rawUser.role_id || rawRole.id);

  return {
    id: rawUser.id ?? null,
    name: rawUser.name ?? "",
    email: rawUser.email ?? "",
    phone: rawUser.phone ?? "",
    role_id: rawUser.role_id ?? rawRole.id ?? null,
    role: role || "",
    token: payload.token ?? rawUser.token ?? "",
  };
}

export function getStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return safeParse(raw);
}

export function getStoredToken() {
  return getStoredUser()?.token || "";
}

export function saveAuthFromPayload(payload) {
  const normalized = normalizeAuthPayload(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  notifyAuthChanged();
  return normalized;
}

export function updateStoredUser(patch = {}) {
  const current = getStoredUser() || {};
  const next = { ...current, ...patch };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  notifyAuthChanged();
  return next;
}

export function clearStoredUser() {
  localStorage.removeItem(STORAGE_KEY);
  notifyAuthChanged();
}