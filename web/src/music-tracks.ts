import { DEMO } from './env';

/**
 * 在线曲库的数据形状。
 *
 * 曲目清单由服务端维护（internal/api/music.go），前端只负责展示：
 * 播放地址统一走 /api/music/stream?mid=xxx，服务端实时换取 vkey 后转发音频流，
 * 所以保存下来的地址长期有效，换设备也不会失效。
 */
export interface Track {
  id: string;
  kind?: 'builtin' | 'online';
  title: string;
  artist?: string;
  album?: string;
  group?: string;
  mood?: string;
  duration: number;
  cover?: string;
  url: string;
  source?: string;
}

export interface TrackGroup {
  key: string;
  label: string;
  desc: string;
}

/** 分组顺序与后端保持一致，用于首屏骨架与演示模式。 */
export const GROUPS: TrackGroup[] = [
  { key: 'pop', label: '华语流行', desc: '耳熟能详的旋律，适合当背景' },
  { key: 'folk', label: '民谣', desc: '吉他与故事，安静的下午' },
  { key: 'guofeng', label: '国风', desc: '古筝、琵琶与戏腔' },
  { key: 'chill', label: '治愈纯音', desc: '钢琴与自然声，写东西时听' },
  { key: 'rock', label: '摇滚现场', desc: '有点力气，适合深夜' },
  { key: 'easy', label: '轻快小调', desc: '轻电子与夏日感' },
];

export const CREDIT = '音源：QQ 音乐试听 · 版权归原权利方，仅供个人非商业试听';

/**
 * 演示站兜底曲目。
 *
 * GitHub Pages 上没有后端，换不到 vkey，所以演示模式用三首 CC BY 4.0 的直链，
 * 保证「点开就有声音」的体验；正式部署走在线曲库。
 */
export const DEMO_TRACKS: Track[] = [
  {
    id: 'demo-1',
    kind: 'online',
    title: 'Meditation Impromptu 01',
    artist: 'Kevin MacLeod',
    album: 'incompetech',
    group: 'chill',
    duration: 213,
    url: encodeURI('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation Impromptu 01.mp3'),
    source: '演示 · CC BY 4.0',
  },
  {
    id: 'demo-2',
    kind: 'online',
    title: 'Dreamer',
    artist: 'Kevin MacLeod',
    album: 'incompetech',
    group: 'chill',
    duration: 204,
    url: encodeURI('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreamer.mp3'),
    source: '演示 · CC BY 4.0',
  },
  {
    id: 'demo-3',
    kind: 'online',
    title: 'Deliberate Thought',
    artist: 'Kevin MacLeod',
    album: 'incompetech',
    group: 'pop',
    duration: 177,
    url: encodeURI('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate Thought.mp3'),
    source: '演示 · CC BY 4.0',
  },
];

/** 播放地址：演示站直接用 CC 直链，正式部署走同源代理。 */
export function streamURL(mid: string): string {
  if (DEMO) return '';
  return `/api/music/stream?mid=${encodeURIComponent(mid)}`;
}

/** 秒 → 3:33 */
export function mmss(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
