"use client";
import {create} from "zustand";

export type AuthView = "login" | "signup" | "reset";

type AuthModalState = {
    isOpen: boolean;
    view: AuthView;
    open: (view?: AuthView) => void;
    close: () => void;
    setView: (view: AuthView) => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
    isOpen: false,
    view: "login",
    open: (view = "login") => set({isOpen: true, view}),
    close: () => set({isOpen: false}),
    setView: (view) => set({view}),
}));




