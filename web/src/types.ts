export interface ViewCtx {
  params: Record<string, string>;
  /** 重新渲染当前路由 */
  reload: () => Promise<void>;
}

export type ViewRenderer = (outlet: HTMLElement, ctx: ViewCtx) => Promise<void>;
