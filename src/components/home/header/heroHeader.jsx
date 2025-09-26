import './header.css'

function heroHeader () {
    return (
        //<!-- hearo header banner con contador cuenta descendente -->
        <header id={"hearo-header-landing"}
                className={"hero-header text-center text-white d-flex flex-column justify-content-center"}
        >
            <div id={'overlay-hero-header'}></div>
            <div id={'body-header'}>
                <h1 id="title-header" className={"text-white"}>
                    Sleepy Hollow</h1>
                <p id="subtitle-header">Tienda gótica para almas nocturnas</p>
                <div id="contador-regresivo">
                    <p>Faltan</p>
                    <p><span id="dias">0</span>d <span id="horas">0</span>h <span id="minutos">0</span>m <span
                        id="segundos">0</span>s </p>
                    <p>para el lanzamiento</p>
                </div>
            </div>
        </header>

    )
}

export default heroHeader