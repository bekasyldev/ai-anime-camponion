import { create } from "zustand"

interface useProModelStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const userProModal = create<useProModelStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))