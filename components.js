//use vscode extention 'es6-string-html' to view string formatting


class Header extends HTMLElement {
    constructor() {
        super();
        
        let activeHref = this.getAttribute("active");
        
        this.innerHTML = /*html*/`
            <nav>
                <hr>
                <ul>
                    <li><a href = "./"      class = ${activeHref == "./" ? "active" : ""}     >Home</a> </li>
                    <li><a href = "./page2" class = ${activeHref == "./page2" ? "active" : ""}>Page2</a></li>
                    <li><a href = "./page3" class = ${activeHref == "./page3" ? "active" : ""}>Page3</a></li>
                </ul>
                <hr>
            </nav>
        `;
    }
}

customElements.define('c-header', Header);