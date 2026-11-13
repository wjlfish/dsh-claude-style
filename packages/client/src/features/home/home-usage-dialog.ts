import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { buildElement } from '@dsh-claude-style/engine/dom'
import { copy } from './copy'
import { HOME_RANGES, homePanelData } from './data'
import { createHomeModels } from './models'
import { createHomeOverview } from './overview'
import type { HomeUsage } from './home-store'

/**
 * The usage summary, as a dialog opened from the personal-info menu.
 *
 * The new-conversation page keeps Claude's own shape and carries no dashboard;
 * the six figures, the heat grid and the models chart are the "classic" panel
 * the studio layout used to stand in the middle of that page, moved intact into
 * one card over the shell. The card reads the one roll-up store the rest of the
 * skin reads (home/store), so the menu's own balance line and this dialog can
 * never disagree; opening it asks for a read, closing it drops the
 * subscription.
 */
export function createUsageDialog(options: { usage: HomeUsage }) {
  const dialog = buildElement('div', 'dsh-claude-usage-dialog')
  dialog.setAttribute('data-dsh-claude-usage-dialog', '')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.hidden = true
  const card = buildElement('div', 'dsh-claude-usage-card-shell')
  dialog.appendChild(card)
  let root: ReactDOM.Root | null = null
  let open = false
  let bookPick = 0.5

  const overview = createHomeOverview()
  const models = createHomeModels()

  function UsagePanel(props: { onClose(): void }) {
    const usage = options.usage
    const [, bump] = React.useState(0)
    const [tabPair] = React.useState<'overview' | 'models'>('overview')
    const tabState = React.useState<'overview' | 'models'>('overview')
    const tab = tabState[0]
    const setTab = tabState[1]
    const rangeState = React.useState('all')
    const range = rangeState[0]
    const setRange = rangeState[1]
    React.useEffect(() => usage.subscribe(() => bump((count) => count + 1)), [])
    void tabPair
    const state = usage.state()
    const data = homePanelData(state, usage.list(), range, bookPick)
    const tabButton = (id: 'overview' | 'models', label: string) => React.createElement('button', {
      type: 'button',
      className: 'dsh-claude-usage-dialog-tab',
      'data-active': tab === id ? '' : undefined,
      'aria-pressed': tab === id,
      onClick() { setTab(id) },
    }, label)
    return React.createElement(
      'div',
      { className: 'dsh-claude-usage-dialog-inner' },
      React.createElement(
        'div',
        { className: 'dsh-claude-usage-dialog-head' },
        React.createElement('span', { className: 'dsh-claude-usage-dialog-title' }, copy('usagePeekTitle')),
        React.createElement('button', {
          type: 'button',
          className: 'dsh-claude-usage-dialog-close',
          'aria-label': copy('usageDialogClose'),
          onClick: props.onClose,
        }, '\u00d7'),
      ),
      React.createElement(
        'div',
        { className: 'dsh-claude-usage-dialog-bar' },
        React.createElement('div', { className: 'dsh-claude-usage-dialog-tabs' }, tabButton('overview', copy('homeTabOverview')), tabButton('models', copy('homeTabModels'))),
        React.createElement('div', { className: 'dsh-claude-usage-dialog-ranges' }, HOME_RANGES.map((item) => React.createElement('button', {
          key: item.id,
          type: 'button',
          className: 'dsh-claude-usage-dialog-range',
          'data-active': range === item.id ? '' : undefined,
          'aria-pressed': range === item.id,
          onClick() { setRange(item.id) },
        }, copy(item.labelKey)))),
      ),
      React.createElement(
        'div',
        { className: 'dsh-claude-usage-dialog-body', 'data-known': data.known ? '' : undefined },
        tab === 'models'
          ? React.createElement(models.component, { data })
          : overview.view(data),
      ),
    )
  }

  function mount() {
    if (root !== null) return
    if (dialog.parentElement !== document.body) document.body.appendChild(dialog)
    root = ReactDOM.createRoot(card)
    root.render(React.createElement(UsagePanel, { onClose: close }))
  }

  function unmount() {
    if (root === null) return
    root.unmount()
    root = null
    if (dialog.parentElement !== null) dialog.parentElement.removeChild(dialog)
  }

  function onKey(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      event.stopPropagation()
      close()
    }
  }

  function openDialog() {
    if (open) return
    open = true
    bookPick = Math.random()
    mount()
    dialog.hidden = false
    options.usage.load(false)
    options.usage.loadList()
    options.usage.refresh('tick')
    document.addEventListener('keydown', onKey, true)
  }

  function close() {
    if (!open) return
    open = false
    document.removeEventListener('keydown', onKey, true)
    dialog.hidden = true
  }

  dialog.addEventListener('pointerdown', (event) => {
    if (event.target === dialog) close()
  })

  return {
    open: openDialog,
    close,
    destroy() {
      document.removeEventListener('keydown', onKey, true)
      close()
      unmount()
    },
  }
}
