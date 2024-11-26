import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-sclie";
import { createChatSlice } from "./slices/chat-slice";

export const userAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));