import {LitElement, html, css} from 'lit';

export class NotificationMessage extends LitElement {
  constructor() {
    super();
    this.message = '';
    this.type = '';
    this.duration = 3000;
  }

  connectedCallback() {
    super.connectedCallback();
    this._showMessage();
  }

  _showMessage() {
    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  render() {
    return html` <div class="notification ${this.type}">${this.message}</div> `;
  }

  static styles = css`
    .notification {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      color: white;
      padding: 1rem;
      border-radius: 4px;
      z-index: 1000;
      font-weight: 600;
    }
    .success {
      background-color: #4caf50;
    }
    .error {
      background-color: #f44336;
    }
  `;
}

window.customElements.define('notification-message', NotificationMessage);
