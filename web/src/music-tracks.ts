import { DEMO } from './env';

/**
 * 站外免费曲库。
 *
 * 全部来自 Kevin MacLeod 的 incompetech.com，授权为 CC BY 4.0：
 * 可免费用于个人站点背景音乐，需保留署名（页面上已展示，README 亦有说明）。
 * 这里只存原始直链；真实部署时统一走 /api/music/stream 反代，
 * 由服务端补上 audio/mpeg 与 Range，浏览器兼容性更稳。
 */
export interface RemoteTrack {
  id: string;
  title: string;
  mood: string;
  seconds: number;
  url: string;
}

const BASE = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/';

// 这里保留原始文件名（含空格），编码交给使用方做一次，避免二次编码
const f = (name: string) => BASE + name;

export const REMOTE_TRACKS: RemoteTrack[] = [
  { id: 'mc-medi01', title: 'Meditation Impromptu 01', mood: '安静 · 钢琴', seconds: 213, url: f('Meditation Impromptu 01.mp3') },
  { id: 'mc-medi02', title: 'Meditation Impromptu 02', mood: '安静 · 夜读', seconds: 249, url: f('Meditation Impromptu 02.mp3') },
  { id: 'mc-medi03', title: 'Meditation Impromptu 03', mood: '安静 · 舒展', seconds: 255, url: f('Meditation Impromptu 03.mp3') },
  { id: 'mc-dreamer', title: 'Dreamer', mood: '舒缓 · 梦境', seconds: 204, url: f('Dreamer.mp3') },
  { id: 'mc-thought', title: 'Deliberate Thought', mood: '沉思 · 专注', seconds: 177, url: f('Deliberate Thought.mp3') },
  { id: 'mc-gymno', title: 'Gymnopédie No. 2', mood: '古典 · 钢琴', seconds: 159, url: f('Gymnopedie No 2.mp3') },
  { id: 'mc-atlantis', title: 'Atlantean Twilight', mood: '神秘 · 深蓝', seconds: 171, url: f('Atlantean Twilight.mp3') },
];

export const REMOTE_CREDIT = 'Kevin MacLeod · incompetech.com · CC BY 4.0';

/** 播放地址：演示站没有后端，只能用原始直链；正式部署走同源反代。 */
export function streamURL(track: RemoteTrack): string {
  if (DEMO) return encodeURI(track.url);
  // 用 URLSearchParams 统一编码，空格会被写成 +，服务端 Query() 会还原
  return `/api/music/stream?${new URLSearchParams({ u: track.url })}`;
}

/** 秒 → 3:33 */
export function mmss(sec: number): string {
  if (!Number.isFinite(sec) || sec <= 0) return '--:--';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
