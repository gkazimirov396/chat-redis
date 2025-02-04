'use client';

import { useState } from 'react';

import { useSelectedUser } from '@/store/selected-user';

import useMediaQuery from '@/hooks/useMediaQuery';

import Sidebar from '../Sidebar';
import MessageContainer from './MessageContainer';

import { cn } from '@/lib/utils';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';

import type { User } from '@/types/db';

interface ChatLayoutProps {
  users: User[];
  defaultLayout?: number[];
}

export default function ChatLayout({
  users,
  defaultLayout = [320, 480],
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const isUserSelected = useSelectedUser(state => !!state.selectedUser);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch bg-background rounded-lg"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}; `;
      }}
    >
      <ResizablePanel
        collapsible
        collapsedSize={8}
        defaultSize={defaultLayout[0]}
        minSize={isSmallScreen ? 0 : 24}
        maxSize={isSmallScreen ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=true;`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=false;`;
        }}
        className={cn(
          isCollapsed && 'min-w-[80px] transition-all duration-300 ease-in-out'
        )}
      >
        <Sidebar isCollapsed={isCollapsed} users={users} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {isUserSelected ? (
          <MessageContainer />
        ) : (
          <div className="flex justify-center items-center h-full w-full px-10">
            <div className="flex flex-col justify-center items-center gap-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-full md:w-2/3 lg:w-1/2"
              />

              <p className="text-muted-foreground text-center">
                Click on a chat to view the messages
              </p>
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
