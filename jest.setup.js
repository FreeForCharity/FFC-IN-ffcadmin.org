// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

// jsdom does not implement the native <dialog> methods. Provide a minimal
// stand-in so components that open dialogs with showModal() (see
// GlobalSearch and CookieConsent) can be unit tested. It toggles the
// `open` attribute, keeps returnValue, and fires `close` like a browser does.
// Focus, inertness and Escape handling are covered by the Playwright suite.
if (typeof window !== 'undefined' && window.HTMLDialogElement) {
  const proto = window.HTMLDialogElement.prototype
  if (typeof proto.showModal !== 'function') {
    proto.show = function show() {
      this.setAttribute('open', '')
    }
    proto.showModal = function showModal() {
      this.setAttribute('open', '')
    }
    proto.close = function close(returnValue) {
      if (!this.hasAttribute('open')) return
      if (returnValue !== undefined) this.returnValue = String(returnValue)
      this.removeAttribute('open')
      this.dispatchEvent(new window.Event('close'))
    }
  }
  if (!('returnValue' in proto)) {
    Object.defineProperty(proto, 'returnValue', {
      configurable: true,
      get() {
        return this._returnValue ?? ''
      },
      set(value) {
        this._returnValue = String(value)
      },
    })
  }
  if (!('open' in proto)) {
    Object.defineProperty(proto, 'open', {
      configurable: true,
      get() {
        return this.hasAttribute('open')
      },
    })
  }
}
