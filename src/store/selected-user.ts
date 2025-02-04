import { create } from 'zustand';
import { combine } from 'zustand/middleware';

import type { User } from '@/types/db';

export const useSelectedUser = create(
  combine(
    {
      selectedUser: null as User | null,
    },
    set => ({
      setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
    })
  )
);
