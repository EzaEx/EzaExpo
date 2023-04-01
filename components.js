//use vscode extention 'es6-string-html' to view string formatting


class Header extends HTMLElement {
    constructor() {
        super();
        
        let activeHref = this.getAttribute("active");
        
        this.innerHTML = /*html*/`
            
            <div class = "flex">
                <h1>Ezaex</h1>
                <nav>
                    <ul>
                        <li><a href = "/"      class = ${activeHref == "/" ? "active" : ""}     >Home</a></li>
                        <li><a href = "/about" class = ${activeHref == "/about" ? "active" : ""}>About</a></li>
                        <li><a href = "/page3" class = ${activeHref == "/page3" ? "active" : ""}>Page3</a></li>
                    </ul>
                </nav>
            </div>
            
        `;
    }
}


class Meta extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = /*html*/`
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        `;        
    }
}

customElements.define('c-meta', Meta);
customElements.define('c-header', Header);