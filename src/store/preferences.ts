import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const usePreferences = create(
  combine(
    {
      soundEnabled: true,
    },
    set => ({
      toggleSoundEnabled: () =>
        set(state => ({ soundEnabled: !state.soundEnabled })),
    })
  )
);
