import { useSyncExternalStore } from "react";
import { DEMO_DEVICES, DEMO_REQUESTS } from "@/data/demo/fixtures";
import type { Device, PartsRequest } from "@/types";

/**
 * DEMO MODE repository. In-memory + localStorage only — no backend.
 * Swap these functions for Supabase queries when a real backend is connected.
 */
interface State {
  devices: Device[];
  requests: PartsRequest[];
  favorites: string[];
  user: { name: string; email: string; role: string } | null;
}

const KEY = "partloop-demo-v1";
let state: State = { devices: DEMO_DEVICES, requests: DEMO_REQUESTS, favorites: [], user: null };
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as Partial<State> & { extraDevices?: Device[]; extraRequests?: PartsRequest[] };
      state = {
        devices: [...(s.extraDevices ?? []), ...DEMO_DEVICES],
        requests: [...(s.extraRequests ?? []), ...DEMO_REQUESTS],
        favorites: s.favorites ?? [],
        user: s.user ?? null,
      };
    }
  } catch { /* ignore */ }
}

function persist() {
  const ids = new Set(DEMO_DEVICES.map((d) => d.id));
  const rids = new Set(DEMO_REQUESTS.map((r) => r.id));
  localStorage.setItem(KEY, JSON.stringify({
    extraDevices: state.devices.filter((d) => !ids.has(d.id)),
    extraRequests: state.requests.filter((r) => !rids.has(r.id)),
    favorites: state.favorites,
    user: state.user,
  }));
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

const serverState = state;
export function useDemo<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => { load(); listeners.add(cb); cb(); return () => listeners.delete(cb); },
    () => select(state),
    () => select(serverState),
  );
}

export const demo = {
  getDevice: (id: string) => state.devices.find((d) => d.id === id),
  addDevice(d: Omit<Device, "id" | "createdAt" | "sellerName" | "verifiedTechnician">) {
    const device: Device = { ...d, id: `u${Date.now()}`, createdAt: new Date().toISOString(), sellerName: state.user?.name ?? "You", verifiedTechnician: false };
    set({ devices: [device, ...state.devices] });
    return device;
  },
  addRequest(r: Omit<PartsRequest, "id" | "createdAt" | "requesterName" | "status">) {
    const req: PartsRequest = { ...r, id: `q${Date.now()}`, createdAt: new Date().toISOString(), requesterName: state.user?.name ?? "You", status: "open" };
    set({ requests: [req, ...state.requests] });
    return req;
  },
  toggleFavorite(id: string) {
    set({ favorites: state.favorites.includes(id) ? state.favorites.filter((f) => f !== id) : [...state.favorites, id] });
  },
  signIn(user: State["user"]) { set({ user }); },
  signOut() { set({ user: null }); },
};

// Selectors must return stable references
export const selectDevices = (s: State) => s.devices;
export const selectRequests = (s: State) => s.requests;
export const selectFavorites = (s: State) => s.favorites;
export const selectUser = (s: State) => s.user;
