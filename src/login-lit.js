import { LitElement, css, html } from "lit";

export class LoginLit extends LitElement{
    static get styles(){
        return css`
            .container{
                border: solid 3px #0a9fea;
                border-radius: 10px;
                width: 350px;
                height: 400px;
                text-align: center;
            }

            input{
                width: 90%;
                height: 30px;
                margin-top: 8vh;
                border: solid 1px #414141;
                border-top: 0px;
                border-radius: 5px;
            }

            button{
                width: 60%;
                height: 40px;
                background: #0a9fea;
                color: #414141;
                border: none;
                border-radius: 6px;
                margin-top: 8vh;
            }

            button:hover{
                background: #0a9fea;
                cursor: pointer;
            }
        `
    }

    render(){
        return html`
            <div class="container">
                <h2>Ingresar</h2>
                <input id="email" type="email" placeholder="Escribe tu email">
                <input id="password" type="password" placeholder="Password">

                <button @click=${this._login}>Ingresar</button>
            </div>
        `;
    }

    _login(){
        const email = this.shadowRoot.querySelector("#email").value;
        const pass = this.shadowRoot.querySelector("#password").value;

        if((email === 'admin@mail.com') && (pass === '12345')){
            this.dispatchEvent(new CustomEvent('sign', {
                detail: {login: true}, bubbles: true, composed: true
            }));
        }
    }
}
customElements.define('login-lit', LoginLit);