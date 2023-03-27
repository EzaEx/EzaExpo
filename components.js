class Header extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
        <nav>
            <ul>
                <li><a href="./">About</a></li>
                <li><a href="./work">Work</a></li>
                <li><a href="./contact">Contact</a></li>
            </ul>
        </nav>
  `;

    let links = this.children[0].children[0].children;
    
    for (let i = 0; i < links.length; i++) {
        let linkPage = links[i].href.split(".");
        linkPage = linkPage[linkPage.length - 1];
        if ()
    }

  }
}

customElements.define('c-header', Header);