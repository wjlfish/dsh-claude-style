/**
 * The host's plugin page (the plugin manager, and the market page beside it)
 * hangs its header out of one measured "collapsing" bar: it clones the bar,
 * reads each part's box in viewport pixels and writes those numbers back as
 * page lengths for a sticky, clipped head. Under the skin's page scale the
 * numbers are applied twice — the values read are physical while the CSS that
 * consumes them works in page pixels — so at 0.8 every part lands a fifth too
 * high and the tab strip covers the page's intro line.
 *
 * The stylesheet divides each measured number by the page's own zoom factor, so
 * the head keeps the host's layout and its collapse at the page's scale: at
 * 100% it writes nothing, and the zoom attribute is the zoom's own mark (absent
 * at 100%).
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
