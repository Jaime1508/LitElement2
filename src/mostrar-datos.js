import { LitElement, html, css } from "lit";
import './login-lit';

export class MostrarDatos extends LitElement{
    static get properties(){
        return {
            mostrar: {type: Array},
            buscar: {type: Array},
            success: {type: Boolean},
            url: { type: String },
            method: { type: String }
        };
    }

    static get styles(){
        return css`
            login-lit{
                display: flex;
                position: absolute;
                right: 38%;
                top: 10%;
            }

            #tabla{
                width: 100%;
                border-collapse: collapse;
            }

            tr:nth-of-type(odd){
                background: lightgray;
            }

            .container{
                margin: 3%;
            }

            th{
                background: #333;
                color: white;
                font-weight: bold;
            }

            td, th{
                padding: 6px;
                border: 1px solid #cccc;
                text-align: left;
            }
        `;
    }

    constructor(){
        super();

        this.mostrar = [];
        this.buscar = [];
        this.success = false;
        this.url="https://api.datos.gob.mx/v1/calidadAire";
        this.method="GET";

        //this.addEventListener('ApiData', (e) => {
        //    this._dataFormat(e.detail.data);
        //})
    }

    firstUpdated() {
        this.getData();
    }

    getData() {
        fetch(this.url, { method: this.method })
            .then((response) => {
                if (response.ok) return response.json();
                return Promise.reject(response);
            })
            .then((data) => { this._dataFormat(data) })
            .catch((error) => { console.warn("Algo falló", error) })
    }

    _dataFormat(data){
        let datos = [];
        data["results"].forEach((dato) =>{
            if((dato.stations[0].measurements[0]) === undefined){
                datos.push({
                    id: dato._id,
                    nombre: dato.stations[0].name,
                    escala: dato.stations[0].indexes[0].scale,
                    valor: dato.stations[0].indexes[0].value,
                    fecha: dato.stations[0].indexes[0].calculationTime,
                    valorMed: 'indefinido',
                    unidad: 'indefinido',
                    contaminante: 'indefinido'
                });
            }else{
                datos.push({
                    id: dato._id,
                    nombre: dato.stations[0].name,
                    escala: dato.stations[0].indexes[0].scale,
                    valor: dato.stations[0].indexes[0].value,
                    fecha: dato.stations[0].indexes[0].calculationTime,
                    valorMed: dato.stations[0].measurements[0].value,
                    unidad: dato.stations[0].measurements[0].unit,
                    contaminante: dato.stations[0].measurements[0].pollutant
                });
            }
            
        });
        this.mostrar = datos;
        this.buscar = datos;
        console.log(datos);
    }

    render(){
        return html`
            ${this.success
                ? html`
                    <div class="container">
                        <input type="text" id="form" @keyup=${this.buscarDato}>
                        <button @click=${this.buscarDato}>Buscar por localidad</button>
                        <button @click=${this.limpiarTexto}> limpiar</button>
                    </div>   
                    ${this.dateTemplate}
                `
                : html`<login-lit @sign=${this._hiddenLogin}></login-lit>`
            }     
        `;
    }

    get dateTemplate(){
        return html`
            <table id='tabla'>
                <tr>
                    <th colspan="2">Localidad</th>
                    <th colspan="3">Indices</th>
                    <th colspan="3">Mediciones</th>
                </tr>
                <tr>
                    <th>Nombre</th>
                    <th>Id</th>
                    <th>Escala</th>
                    <th>Valor</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Unidad</th>
                    <th>Contaminante</th>
                </tr>
                ${this.buscar.map(dato => html`
                <tr>
                    <td> ${dato.nombre }</td>
                    <td> ${dato.id }</td>
                    <td> ${dato.escala }</td>
                    <td> ${dato.valor }</td>
                    <td> ${dato.fecha }</td>
                    <td> ${dato.valorMed }</td>
                    <td> ${dato.unidad }</td>
                    <td> ${dato.contaminante }</td>
                </tr>
            `)}
            </table>
            
        `;
    }

    buscarDato(){
        const input = this.shadowRoot.querySelector("#form").value.toLowerCase();
        this.buscar = [];

        this.mostrar.map(dato => {
            const nombre = dato.nombre.toLowerCase();

            if(nombre.indexOf(input) !== -1){
                this.buscar = [...this.buscar, dato];
            }
        })
    }

    _hiddenLogin(){
        this.success = true;
    }

    limpiarTexto(){
        let texto = this.shadowRoot.querySelector("#form");
        texto.value = "";

    }
}

customElements.define('mostrar-datos', MostrarDatos)
