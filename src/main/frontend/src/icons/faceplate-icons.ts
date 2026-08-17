import { inject, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Faceplate icon set.
 *
 * A 24-unit grid, 1.6px strokes, round joins, drawn in currentColor so a glyph
 * inherits whatever state it sits in. Each carries one detail that encodes
 * something true about this product rather than a generic category — the chat
 * dots grow left to right because tokens arrive that way; the document's text
 * lines resolve into points because a page becomes embeddings.
 *
 * The three states are shape-coded before they are colour-coded:
 *   ready = circle, attention = triangle, offline = diamond.
 * Printed in greyscale, the interface still reads.
 *
 * Registered as literals rather than fetched by URL so there is no network
 * round-trip and no icon flash on first paint.
 */
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
  `stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const FACEPLATE_ICONS: Record<string, string> = {
  // — navigation ————————————————————————————————————————————————
  'fp-chat': svg(`<rect x="3" y="4" width="18" height="12" rx="3"/><path d="M8 16v4l3.8-4"/>
    <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="10" r="1.05" fill="currentColor" stroke="none"/>
    <circle cx="15.2" cy="10" r="1.4" fill="currentColor" stroke="none"/>`),

  'fp-docs': svg(`<path d="M6 3h7l5 5v13H6z"/><path d="M13 3v5h5"/><path d="M9 12h6M9 14.8h4"/>
    <circle cx="9.4" cy="18" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="12.2" cy="18" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="18" r="0.85" fill="currentColor" stroke="none"/>`),

  'fp-mcp': svg(`<rect x="4" y="6.5" width="10.5" height="11" rx="2.5"/><path d="M1.6 12H4"/>
    <path d="M14.5 9.2h4M14.5 12h4M14.5 14.8h4"/>
    <circle cx="19.8" cy="9.2" r="1.1"/><circle cx="19.8" cy="12" r="1.1"/><circle cx="19.8" cy="14.8" r="1.1"/>`),

  'fp-agents': svg(`<path d="M12 2.8 18.9 6.7v7.8L12 18.4 5.1 14.5V6.7z"/>
    <circle cx="9.9" cy="10.2" r="0.95" fill="currentColor" stroke="none"/>
    <circle cx="14.1" cy="10.2" r="0.95" fill="currentColor" stroke="none"/>
    <path d="M6.2 18.6c2.9 2.6 8.4 2.6 11.5-.4"/><path d="M17.9 15.1l.4 3.4-3.3.3"/>`),

  'fp-memory': svg(`<rect x="4.5" y="6" width="15" height="12" rx="2.4"/><path d="M2 10.6l1.6 1.4L2 13.4"/>
    <path d="M8.6 11.2v3.4M12 9.4v5.2M15.4 10.4v4.2"/>`),

  'fp-vector': svg(`<ellipse cx="12" cy="6.2" rx="7" ry="2.9"/>
    <path d="M5 6.2v11.6c0 1.6 3.13 2.9 7 2.9s7-1.3 7-2.9V6.2"/><path d="M5 12c0 1.6 3.13 2.9 7 2.9s7-1.3 7-2.9"/>
    <circle cx="9.6" cy="17.6" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="12.3" cy="18.2" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="17.4" r="0.85" fill="currentColor" stroke="none"/>`),

  'fp-model': svg(`<rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.6"/>
    <path d="M9.4 6.2V3.4M14.6 6.2V3.4M9.4 17.8v2.8M14.6 17.8v2.8M6.2 9.4H3.4M6.2 14.6H3.4M17.8 9.4h2.8M17.8 14.6h2.8"/>
    <path d="M12.8 9.1l-2 3.3h2.4l-2 3.1"/>`),

  // — state: shape first, colour third ——————————————————————————
  'fp-ready': svg(`<circle cx="12" cy="12" r="8.6"/><path d="M8.2 12.3l2.6 2.6 5-5.6"/>`),

  'fp-attention': svg(`<path d="M12 3.6 21.2 19.6H2.8z"/><path d="M12 9.6v4.2"/>
    <circle cx="12" cy="16.8" r="1" fill="currentColor" stroke="none"/>`),

  'fp-offline': svg(`<path d="M12 2.9 21.1 12 12 21.1 2.9 12z"/><path d="M9.2 14.8 14.8 9.2"/>`),

  // — actions ————————————————————————————————————————————————
  'fp-send': svg(`<path d="M20.8 3.4 3.6 10.3l6.5 2.7 2.7 6.5z"/><path d="M20.8 3.4 10.1 13"/><path d="M2.6 17.6 5 15.2"/>`),

  'fp-attach': svg(`<path d="M13 2.8H7.2A1.7 1.7 0 0 0 5.5 4.5v15A1.7 1.7 0 0 0 7.2 21.2h9.6a1.7 1.7 0 0 0 1.7-1.7V8.1z"/>
    <path d="M13 2.8v5.3h5.5"/><path d="M12 18v-5.6M9.7 14.4 12 12.1l2.3 2.3"/>`),

  'fp-trash': svg(`<path d="M4.4 6.9 19.6 5.6"/><path d="M9.4 6.5 9.2 4.3l5-.4.2 2.2"/>
    <path d="M6.6 7.6l1.1 11.6a1.7 1.7 0 0 0 1.7 1.5h5.2a1.7 1.7 0 0 0 1.7-1.5l1.1-11.6"/>
    <path d="M10.6 11v6M13.4 11v6"/>`),

  'fp-close': svg(`<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/>`),

  'fp-logout': svg(`<path d="M14.4 3.6H6.2a1.8 1.8 0 0 0-1.8 1.8v13.2a1.8 1.8 0 0 0 1.8 1.8h8.2"/>
    <path d="M17.2 8.4 20.8 12l-3.6 3.6"/><path d="M20.2 12H9.6"/>`),

  'fp-down': svg(`<path d="M12 4.2v11.2M7.8 11.4 12 15.6l4.2-4.2"/><path d="M5.4 19.4h13.2"/>`),

  // — content ————————————————————————————————————————————————
  'fp-tool': svg(`<rect x="2.8" y="4.8" width="18.4" height="14.4" rx="2.6"/>
    <path d="M7.2 10.2l2.4 2.3-2.4 2.3"/><path d="M12.4 14.8h4.4"/>`),

  'fp-reason': svg(`<path d="M9.4 4.8C6.6 5.6 5 8 5 12s1.6 6.4 4.4 7.2"/><path d="M14.6 4.8C17.4 5.6 19 8 19 12s-1.6 6.4-4.4 7.2"/>
    <circle cx="9.2" cy="12" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="0.85" fill="currentColor" stroke="none"/>
    <circle cx="14.8" cy="12" r="0.85" fill="currentColor" stroke="none"/>`),

  'fp-stream': svg(`<path d="M3 12h2.2M9.4 12h2.2M15.8 12H18"/><path d="M6.6 8.4v7.2M13 6.6v10.8M19.4 9.6v4.8"/>`),

  'fp-info': svg(`<circle cx="12" cy="12" r="8.6"/><path d="M12 11.2v5"/>
    <circle cx="12" cy="7.9" r="1" fill="currentColor" stroke="none"/>`),
};

/**
 * Registers the set with Angular Material so templates can use
 * <mat-icon svgIcon="fp-ready"> in place of a font ligature.
 */
export function provideFaceplateIcons() {
  return provideAppInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    for (const [name, markup] of Object.entries(FACEPLATE_ICONS)) {
      registry.addSvgIconLiteral(name, sanitizer.bypassSecurityTrustHtml(markup));
    }
  });
}
