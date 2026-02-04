import { Box, Button, MantineStyleProp, ScrollArea } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useRef } from 'react';

const stylesPanel = {
  container: (): MantineStyleProp => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    overflow: 'hidden',
    gap: '8px',
    padding: '10px 8px',
  }),
  scrollBox: (): MantineStyleProp => ({
    display: 'flex',
    gap: '8px',
    minWidth: 'min-content',
    height: '100%',
    alignItems: 'center',
    padding: '0 4px',
  }),
};

interface PanelProps {
  children: ReactNode;
}

export const Panel = ({ children }: PanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  return (
    <Box style={stylesPanel.container()}>
      <Button
        variant="subtle"
        color="gray"
        onClick={scrollLeft}
        style={{
          flexShrink: 0,
          zIndex: 11,
        }}
      >
        <ChevronLeft size={20} />
      </Button>
      <ScrollArea
        viewportRef={scrollRef}
        style={{
          flex: 1,
          height: '100%',
        }}
      >
        <Box style={stylesPanel.scrollBox()}>{children}</Box>
      </ScrollArea>
      <Button
        variant="subtle"
        color="gray"
        onClick={scrollRight}
        style={{
          flexShrink: 0,
          zIndex: 11,
        }}
      >
        <ChevronRight size={20} />
      </Button>
    </Box>
  );
};
