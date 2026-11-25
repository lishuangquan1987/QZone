export interface ViewCtx {
  params: Record<string, string>;
  /** 重新渲染当前路由 */
  reload: () => Promise<void>;
  /** 刷新右侧栏与角标 */
  refreshRail: () => void;
}

export type ViewRenderer = (outlet: HTMLElement, ctx: ViewCtx) => Promise<void>;
