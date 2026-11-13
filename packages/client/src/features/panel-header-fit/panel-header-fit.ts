/**
 * The host's plugin page (the plugin manager, and the market page beside it)
 * hangs its header out of one measured "collapsing" bar: it clones the bar,
 * reads each part's box in viewport pixels and writes those numbers back as
 * page lengths for a sticky, clipped head. Under the skin's page scale the
 * numbers are applied twice — the clone is sized from the already-scaled
 * rectangle, and the values read are physical while the CSS that consumes
 * them works in page pixels — so at 0.8 the tab strip lands a fifth too high
 * and covers the page's intro line.
 *
 * The stylesheet lays that header out statically instead, but only while the
 * page is scaled (`data-dsh-claude-page-zoom` is the zoom's own attribute and
 * is absent at 100%). At the page's own scale the host's measured head is
 * correct and keeps its collapse.
 */
export function install(ctx: unknown, ui: { panelHeaderFit?: unknown }) {
  // The correction is the stylesheet's: it needs no pass, no seat and no
  // host service. The feature exists so the sheet ships with a manifest that
  // says what it is for (D9: every sheet is claimed).
  ui.panelHeaderFit = {}
  return () => {
    delete ui.panelHeaderFit
  }
}
