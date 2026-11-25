import { esc, icon, toast } from './ui';

/**
 * 背景音乐播放器。
 * 浏览器禁止无交互自动播放，所以策略是：记住用户开关，
 * 在页面上第一次点击/触摸时自动开始播放，其余情况由用户手动控制。
 */
class Bgm {
  private audio: HTMLAudioElement | null = null;
  private pill: HTMLElement | null = null;
  private title = '';
  private url = '';
  private armed = false;

  private get want(): boolean {
    return localStorage.getItem('qz.bgm') !== 'off';
  }

  private get volume(): number {
    const v = Number(localStorage.getItem('qz.bgm.vol'));
    return Number.isFinite(v) && v > 0 ? Math.min(v, 1) : 0.55;
  }

  /** 设置当前曲目（来自个人档配置）。 */
  setTrack(url: string, title: string): void {
    const changed = url !== this.url;
    this.url = url;
    this.title = title || '未命名音轨';
    if (changed) {
      this.ensureAudio();
      if (this.audio) {
        this.audio.src = url;
        this.audio.volume = this.volume;
        this.audio.load();
      }
    }
    this.render();
    if (changed && url && this.want) this.arm();
  }

  private ensureAudio(): void {
    if (this.audio) return;
    const a = new Audio();
    a.loop = true;
    a.preload = 'metadata';
    a.volume = this.volume;
    a.addEventListener('play', () => this.render());
    a.addEventListener('pause', () => this.render());
    a.addEventListener('error', () => {
      this.render();
      if (this.url) toast('背景音乐加载失败，可能是格式不支持', 'err');
    });
    this.audio = a;
  }

  /** 等待用户第一次交互后再尝试播放。 */
  private arm(): void {
    if (this.armed) return;
    this.armed = true;
    const kick = (ev: Event) => {
      // 播放器自身的点击由 toggle() 处理，避免「先自动播放再被暂停」
      const target = ev.target as HTMLElement | null;
      if (target && target.closest('.bgm')) return;
      document.removeEventListener('pointerdown', kick);
      document.removeEventListener('keydown', kick);
      if (this.want && this.audio && this.audio.paused) {
        void this.play();
      }
    };
    document.addEventListener('pointerdown', kick);
    document.addEventListener('keydown', kick);
  }

  private async play(): Promise<void> {
    this.ensureAudio();
    if (!this.audio || !this.url) return;
    try {
      await this.audio.play();
      localStorage.setItem('qz.bgm', 'on');
    } catch {
      // 被自动播放策略拦截时保持暂停，等用户手动点
      this.render();
    }
  }

  private pause(): void {
    this.audio?.pause();
    localStorage.setItem('qz.bgm', 'off');
    this.render();
  }

  isPlaying(): boolean {
    return !!this.audio && !this.audio.paused;
  }

  toggle(): void {
    if (!this.url) {
      toast('还没有设置背景音乐，可以在「设置」里上传', 'err');
      return;
    }
    if (this.audio?.paused !== false) void this.play();
    else this.pause();
  }

  private setVolume(v: number): void {
    localStorage.setItem('qz.bgm.vol', String(v));
    if (this.audio) this.audio.volume = v;
  }

  /** 把播放器挂到页面上（登录后才显示）。 */
  mount(): void {
    if (this.pill) {
      this.render();
      return;
    }
    const el = document.createElement('div');
    el.className = 'bgm';
    document.body.appendChild(el);
    this.pill = el;

    el.addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-bgm-toggle]')) {
        this.toggle();
        return;
      }
      if (t.closest('.bgm-meta')) {
        location.hash = '#/settings?tab=music';
      }
    });
    el.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      if (input.matches('.bgm-vol')) this.setVolume(Number(input.value));
    });

    this.render();
    if (this.url && this.want) this.arm();
  }

  unmount(): void {
    this.pill?.remove();
    this.pill = null;
    this.audio?.pause();
    document.body.classList.remove('has-bgm');
  }

  private render(): void {
    document.body.classList.toggle('has-bgm', !!this.url);
    if (!this.pill) return;
    const playing = this.audio ? !this.audio.paused : false;
    const pct = Math.round(this.volume * 100);
    window.dispatchEvent(new CustomEvent('qz:bgm', { detail: { playing } }));
    this.pill.innerHTML = `
      <div class="bgm-disc ${playing ? 'spin' : ''}" data-bgm-toggle title="${playing ? '暂停' : '播放'}">${icon('music', 16)}</div>
      <div class="bgm-meta">
        <span class="bgm-kicker">背景音乐</span>
        <span class="bgm-title">${esc(this.url ? this.title : '未设置音轨')}</span>
      </div>
      <button class="bgm-toggle" data-bgm-toggle aria-label="${playing ? '暂停' : '播放'}">
        ${playing ? icon('pause', 14) : icon('play', 14)}
      </button>
      <input class="bgm-vol" type="range" min="0" max="100" value="${pct}" aria-label="音量">
      <div class="bgm-wave ${playing ? 'on' : ''}"><i></i><i></i><i></i><i></i></div>`;
  }
}

export const bgm = new Bgm();

// 便于调试与自动化验收
(window as unknown as { bgm: Bgm }).bgm = bgm;
