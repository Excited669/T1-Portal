import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConfirmPayload {
  id: string;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ConfirmState {
  current?: ConfirmPayload;
}

const initialState: ConfirmState = {};

const confirmSlice = createSlice({
  name: 'confirm',
  initialState,
  reducers: {
    openConfirm(state, action: PayloadAction<ConfirmPayload>) {
      state.current = action.payload;
    },
    closeConfirm(state) {
      state.current = undefined;
    },
  },
});

export const { openConfirm, closeConfirm } = confirmSlice.actions;
export default confirmSlice.reducer;
