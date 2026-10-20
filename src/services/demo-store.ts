import { useSyncExternalStore } from "react";
import { DEMO_DEVICES, DEMO_REQUESTS } from "@/data/demo/fixtures";
import type { ChatMessage, ChatThread, DemoUser, Device, DeviceStatus, PartsRequest } from "@/types";

/**
 * DEMO MODE repository. In-memory + localStorage only — no backend.
 * Swap these functions for Supabase queries when a real backend is connected.
 */
interface State {
  devices: Device[];
  requests: PartsRequest[];
  favorites: string[];
  user: DemoUser | null;
  threads: ChatThread[];
  messages: ChatMessage[];
}

const KEY = "partloop-demo-v2";
let state: State = {
  devices: DEMO_DEVICES,
  requests: DEMO_REQUESTS,
  favorites: [],
  user: null,
  threads: [],
  messages: [],
};
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
        threads: s.threads ?? [],
        messages: s.messages ?? [],
      };
    }
  } catch {
    /* ignore corrupt demo cache */
  }
}

function persist() {
  if (typeof window === "undefined") return;
  const ids = new Set(DEMO_DEVICES.map((d) => d.id));
  const rids = new Set(DEMO_REQUESTS.map((r) => r.id));
  localStorage.setItem(KEY, JSON.stringify({
    extraDevices: state.devices.filter((d) => !ids.has(d.id)),
    extraRequests: state.requests.filter((r) => !rids.has(r.id)),
    favorites: state.favorites,
    user: state.user,
    threads: state.threads,
    messages: state.messages,
  }));
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

function nowIso() {
  return new Date().toISOString();
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
  getRequest: (id: string) => state.requests.find((r) => r.id === id),
  addDevice(d: Omit<Device, "id" | "createdAt" | "sellerName" | "verifiedTechnician" | "sellerId">) {
    const user = state.user;
    const device: Device = {
      ...d,
      id: `u${Date.now()}`,
      createdAt: nowIso(),
      sellerId: user?.id ?? "anon",
      sellerName: user?.name ?? "You",
      verifiedTechnician: user?.role === "technician",
    };
    set({ devices: [device, ...state.devices] });
    return device;
  },
  setDeviceStatus(id: string, status: DeviceStatus) {
    set({ devices: state.devices.map((d) => (d.id === id ? { ...d, status } : d)) });
  },
  addRequest(r: Omit<PartsRequest, "id" | "createdAt" | "requesterName" | "requesterId" | "status">) {
    const user = state.user;
    const req: PartsRequest = {
      ...r,
      id: `q${Date.now()}`,
      createdAt: nowIso(),
      requesterId: user?.id ?? "anon",
      requesterName: user?.name ?? "You",
      status: "open",
    };
    set({ requests: [req, ...state.requests] });
    return req;
  },
  setRequestStatus(id: string, status: PartsRequest["status"]) {
    set({ requests: state.requests.map((r) => (r.id === id ? { ...r, status } : r)) });
  },
  toggleFavorite(id: string) {
    set({ favorites: state.favorites.includes(id) ? state.favorites.filter((f) => f !== id) : [...state.favorites, id] });
  },
  signIn(user: DemoUser) { set({ user }); },
  signOut() { set({ user: null }); },
  openThread(input: { title: string; otherName: string; deviceId?: string; requestId?: string }) {
    const ownerId = state.user?.id ?? "anon";
    const existing = state.threads.find((t) =>
      t.ownerId === ownerId &&
      t.deviceId === input.deviceId &&
      t.requestId === input.requestId,
    );
    if (existing) return existing;
    const thread: ChatThread = {
      id: `t${Date.now()}`,
      ownerId,
      otherName: input.otherName,
      title: input.title,
      updatedAt: nowIso(),
      ...(input.deviceId ? { deviceId: input.deviceId } : {}),
      ...(input.requestId ? { requestId: input.requestId } : {}),
    };
    const hello: ChatMessage = {
      id: `m${Date.now()}`,
      threadId: thread.id,
      authorName: "PartLoop demo",
      body: "Demo thread — messages stay on this device only. They are not delivered to a real person.",
      createdAt: nowIso(),
    };
    set({ threads: [thread, ...state.threads], messages: [...state.messages, hello] });
    return thread;
  },
  sendMessage(threadId: string, body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      threadId,
      authorName: state.user?.name ?? "You",
      body: trimmed,
      createdAt: nowIso(),
    };
    set({
      messages: [...state.messages, msg],
      threads: state.threads.map((t) => (t.id === threadId ? { ...t, updatedAt: msg.createdAt } : t)),
    });
    return msg;
  },
};

export const selectDevices = (s: State) => s.devices;
export const selectRequests = (s: State) => s.requests;
export const selectFavorites = (s: State) => s.favorites;
export const selectUser = (s: State) => s.user;
export const selectThreads = (s: State) => s.threads;
export const selectMessages = (s: State) => s.messages;
