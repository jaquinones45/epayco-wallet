import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('session');
    set({ user: null })
  },
  loadSession: () => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      const user = JSON.parse(storedSession);
      return set({ user })
    } else {
      return set({ user: null });
    }
  },
}));
