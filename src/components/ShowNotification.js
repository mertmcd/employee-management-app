import { LitElement, html, css } from 'lit';

class NotificationMessage extends LitElement {
  constructor() {
    super();
    this.message = 'Operation completed successfully!';
    this.type = 'success';
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
    return html`
      <div class="notification ${this.type}">
        ${this.message}
      </div>
    `;
  }

  static styles = css`
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      color: white;
      padding: 10px;
      border-radius: 5px;
      z-index: 1000;
      font-weight: bold;
    }
    .success {
      background-color: #4CAF50;
    }
    .error {
      background-color: #f44336;
    }
  `;
}

customElements.define('notification-message', NotificationMessage);
