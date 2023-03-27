//use vscode extention 'es6-string-html' to view string formatting


class Header extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = /*html*/`
        <nav>
            <ul>
                <li><a href="./">About</a></li>
                <li><a href="./work">Work</a></li>
                <li><a href="./contact">Contact</a></li>
            </ul>
        </nav>
  `;
  }
}

customElements.define('c-header', Header);