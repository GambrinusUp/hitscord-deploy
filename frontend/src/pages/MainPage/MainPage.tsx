import { Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MAX_MESSAGE_NUMBER } from '~/constants';
import { getUserProfile } from '~/entities/user';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ChatSection } from '~/modules/ChatSection/ChatSection';
import { DetailsPanel, DetailsPanelMobile } from '~/modules/DetailsPanel';
import { ProfilePage } from '~/modules/Profile';
import { ServerPanel } from '~/modules/ServerPanel';
import { SideBar, SideBarMobile } from '~/modules/SideBar';
import { getChannelMessages, getServerData } from '~/store/ServerStore';
import { ControlPanel } from '~/widgets/controlPanel';
import { VoiceChannelFacade } from '~/widgets/voiceChannelFacade';

export const MainPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUserStreamView, isOpenHome } = useAppSelector(
    (state) => state.appStore,
  );
  const { isLoggedIn } = useAppSelector((state) => state.userStore);
  const {
    currentServerId,
    currentChannelId,
    currentNotificationChannelId,
    startMessageId,
  } = useAppSelector((state) => state.testServerStore);
  const [sidebarOpened, { open, close }] = useDisclosure(false);
  const [
    detailsPanelOpened,
    { open: openDetailsPanel, close: closeDetailsPanel },
  ] = useDisclosure(false);

  const activeChannelId = currentChannelId ?? currentNotificationChannelId;

  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (currentServerId) {
      dispatch(getServerData({ serverId: currentServerId }));
    }
  }, [currentServerId, dispatch]);

  useEffect(() => {
    if (activeChannelId) {
      const isFirstLoad = startMessageId === 0;

      dispatch(
        getChannelMessages({
          channelId: activeChannelId,
          number: MAX_MESSAGE_NUMBER,
          fromMessageId: startMessageId,
          down: isFirstLoad,
        }),
      );
    }
  }, [activeChannelId, dispatch]);

  return (
    <Box style={{ display: 'flex', height: '100dvh', position: 'relative' }}>
      <ServerPanel />
      {isOpenHome ? (
        <ProfilePage />
      ) : (
        <>
          <SideBar onClose={close} />
          {!isUserStreamView ? (
            <ChatSection
              openSidebar={open}
              openDetailsPanel={openDetailsPanel}
            />
          ) : (
            <VoiceChannelFacade />
          )}
          <DetailsPanel />
          <SideBarMobile onClose={close} opened={sidebarOpened} />
          <DetailsPanelMobile
            onClose={closeDetailsPanel}
            opened={detailsPanelOpened}
          />
        </>
      )}
      <Box
        style={{
          position: 'fixed',
          bottom: 5,
          left: 5,
          right: 0,
          zIndex: 100,
          maxWidth: 310,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <ControlPanel />
      </Box>
    </Box>
  );
};
