import { SIDEBAR_SLOT_SELECTOR } from '@dsh-claude-style/contracts/dom'
import { subscribeMutations } from '@dsh-claude-style/engine/bus'
import { findSidebarLogoRow } from '@dsh-claude-style/engine/host'
import { requestFrame } from '@dsh-claude-style/engine/frame'
import { SIDEBAR_TAB_SEAT_ATTR, SIDEBAR_TABS_ATTR } from '../../constants'

/**
 * The seat the sidebar's top row keeps for another plugin's toolbar.
 *
 * Claude Code Desktop puts the Cowork / Code switch on the row below its
 * caption strip; the host draws that row for its brand and offers no slot in
 * it, and a plugin's tabs cannot take a host slot of their own. The skin
 * therefore inserts one empty, stable box as the row's first child. A plugin
 * portals its tab strip into that box (the mark is the contract), and the
 * stylesheet turns the row into the strip while the box holds content; the body
 * carries `SIDEBAR_TABS_ATTR` for the rules that differ between a toolbar row
 * and the brand row the other layouts keep.
 *
 * The box is the same element for the whole generation, because a React portal
 * addresses the node it was handed once; a host render that drops it is
 * answered by putting that node back rather than by building a new one.
 */
export function installSidebarRowSeat() {
  const body = document.body
  const seat = document.createElement('div')
  seat.setAttribute(SIDEBAR_TAB_SEAT_ATTR, '')
  let cancelPass: (() => void) | null = null

  function write() {
    cancelPass = null
    const row = findSidebarLogoRow()
    if (row === null) {
      seat.remove()
      body.removeAttribute(SIDEBAR_TABS_ATTR)
      return
    }
    if (seat.parentElement !== row || row.firstElementChild !== seat) row.insertBefore(seat, row.firstChild)
    // The portalled strip is the answer to whether this row is a toolbar: an
    // empty seat leaves the row exactly as the host drew it, and the desktop's
    // row leaves the layout entirely with nothing to show.
    if (seat.childNodes.length === 0) body.removeAttribute(SIDEBAR_TABS_ATTR)
    else if (body.getAttribute(SIDEBAR_TABS_ATTR) !== 'on') body.setAttribute(SIDEBAR_TABS_ATTR, 'on')
  }
  const pass = { write }

  /**
   * Whether one batch can move the seat. The observer watches the whole page
   * because the sidebar column itself mounts and unmounts; the streaming
   * transcript is the page's busiest writer and can never move the row, so a
   * batch confined to it asks for no frame — the skin's frame budget stays with
   * the conversation.
   */
  function touchesSidebar(records: MutationRecord[]) {
    for (const record of records) {
      const target = record.target
      if (target instanceof Element && target.closest(SIDEBAR_SLOT_SELECTOR) !== null) return true
      for (const node of [...record.addedNodes, ...record.removedNodes]) {
        if (!(node instanceof Element)) continue
        if (node.matches(SIDEBAR_SLOT_SELECTOR) || node.querySelector(SIDEBAR_SLOT_SELECTOR) !== null) return true
      }
    }
    return false
  }

  function schedule(records: MutationRecord[]) {
    if (cancelPass !== null || !touchesSidebar(records)) return
    cancelPass = requestFrame(pass)
  }

  const stopMutations = subscribeMutations(body, { childList: true, subtree: true }, schedule)
  write()

  return () => {
    stopMutations()
    if (cancelPass !== null) cancelPass()
    cancelPass = null
    seat.remove()
    body.removeAttribute(SIDEBAR_TABS_ATTR)
  }
}
