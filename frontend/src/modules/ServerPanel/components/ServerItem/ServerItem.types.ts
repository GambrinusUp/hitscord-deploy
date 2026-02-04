import { FileResponse } from '~/entities/files';

export interface ServerItemProps {
  serverId: string;
  serverName: string;
  nonReadedCount: number;
  nonReadedTaggedCount: number;
  serverIcon: FileResponse | null;
}
