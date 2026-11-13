import { buildElement } from '@dsh-claude-style/engine/dom'
import { copy } from './copy'
import type { HomeLayoutHandle } from '../home/home-layout'

/**
 * The usage summary as one row of the personal-info menu.
 *
 * The account card is where the reader already looks for "things about this
 * machine", so the six figures the home page used to stand in the middle of
 * live behind one row with a chart icon: picking it closes the menu and opens
 * the usage dialog (features/home/home-usage-dialog.ts), the classic panel
 * over the shell. The row is inserted into whichever container the account
 * surface currently shows — the host's injected list or the skin's own drawer —
 * because both surfaces are the same row model in this skin.
 */
export function createUsageRow(options: { source: HomeLayoutHandle, onPick(): void }) {
  const row = document.createElement('button')
  row.type = 'button'
  row.className = 'dsh-claude-popover-item dsh-claude-usage-item'
  row.setAttribute('aria-haspopup', 'dialog')
  row.innerHTML =
    '<span class="dsh-claude-popover-item-icon">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M4 20V4M4 20h16"></path>' +
        '<path d="M8 20v-7M12.5 20V8M17 20v-4"></path>' +
      '</svg>' +
    '</span>' +
    '<span class="dsh-claude-popover-item-text"></span>'
  const label = row.querySelector('.dsh-claude-popover-item-text')
  let container: Element | null = null

  row.addEventListener('click', (event) => {
    event.stopPropagation()
    options.onPick()
    options.source.openUsage()
  })

  /**
   * Put the row into the surface's current container, before `anchor` when the
   * surface has its own settings row at the foot (the drawer) and at the end of
   * the injected list otherwise. The row's label follows the shell's language
   * while the card stands.
   */
  function sync(next: Element | null, anchor: Element | null) {
    const rowLabel = copy('accountUsageRow')
    if (label !== null && label.textContent !== rowLabel) label.textContent = rowLabel
    if (next === null) {
      container = null
      row.remove()
      return
    }
    container = next
    if (row.parentElement !== next || (anchor !== null && row.nextElementSibling !== anchor)) {
      if (anchor !== null && anchor.parentElement === next) next.insertBefore(row, anchor)
      else next.appendChild(row)
    }
  }

  return {
    sync,
    /** The row's element, for a caller that has to order it against its own nodes. */
    element: row,
    destroy() {
      row.remove()
      container = null
    },
  }
}
