import React, { Component } from 'react';
import ListModal from './ListModal';
import { get } from 'axios';
import Plot from 'react-plotly.js';

class App extends Component {

  constructor() {
    super()
    this.state = {
      url: 'http://127.0.0.1:5000/',
      patient: '',
      patients: [],
      modalDisplay: 'none',
      isLoading: false,
      isLoaded: false,
      isAnimationLoaded: false,
      is3dLoading: false,
      isDiag: false,
      superior: 'figures/superior.png',
      frontal: 'figures/frontal.png',
      lateral: 'figures/lateral.png',
      diagnostico: '',
      tab: '3d',
      viz_1: 'pulmon3D',
      cmap: 'viridis',
      vista: 'Superior',
      bordes: false,

      // imagen actual de la animacion
      n_slide: 0,
      // aqui luego almaceno las 100 imagenes
      animacion: [],
      // aqui almaceno el interval para luego poder limpiarlo
      interval: undefined,
      
      pulmon3Dr: '',
      x: [],
      y: [],
      z: [],
      i: [],
      j: [],
      k: [],
      n_max: 100,
      cmaps: ['Accent', 'Accent_r', 'Blues', 'Blues_r', 'BrBG', 'BrBG_r', 'BuGn', 'BuGn_r', 'BuPu', 'BuPu_r', 'CMRmap', 'CMRmap_r', 'Dark2', 'Dark2_r', 'GnBu', 'GnBu_r', 'Greens', 'Greens_r', 'Greys', 'Greys_r', 'OrRd', 'OrRd_r', 'Oranges', 'Oranges_r', 'PRGn', 'PRGn_r', 'Paired', 'Paired_r', 'Pastel1', 'Pastel1_r', 'Pastel2', 'Pastel2_r', 'PiYG', 'PiYG_r', 'PuBu', 'PuBuGn', 'PuBuGn_r', 'PuBu_r', 'PuOr', 'PuOr_r', 'PuRd', 'PuRd_r', 'Purples', 'Purples_r', 'RdBu', 'RdBu_r', 'RdGy', 'RdGy_r', 'RdPu', 'RdPu_r', 'RdYlBu', 'RdYlBu_r', 'RdYlGn', 'RdYlGn_r', 'Reds', 'Reds_r', 'Set1', 'Set1_r', 'Set2', 'Set2_r', 'Set3', 'Set3_r', 'Spectral', 'Spectral_r', 'Wistia', 'Wistia_r', 'YlGn', 'YlGnBu', 'YlGnBu_r', 'YlGn_r', 'YlOrBr', 'YlOrBr_r', 'YlOrRd', 'YlOrRd_r', 'afmhot', 'afmhot_r', 'autumn', 'autumn_r', 'binary', 'binary_r', 'bone', 'bone_r', 'brg', 'brg_r', 'bwr', 'bwr_r', 'cividis', 'cividis_r', 'cool', 'cool_r', 'coolwarm', 'coolwarm_r', 'copper', 'copper_r', 'cubehelix', 'cubehelix_r', 'flag', 'flag_r', 'gist_earth', 'gist_earth_r', 'gist_gray', 'gist_gray_r', 'gist_heat', 'gist_heat_r', 'gist_ncar', 'gist_ncar_r', 'gist_rainbow', 'gist_rainbow_r', 'gist_stern', 'gist_stern_r', 'gist_yarg', 'gist_yarg_r', 'gnuplot', 'gnuplot2', 'gnuplot2_r', 'gnuplot_r', 'gray', 'gray_r', 'hot', 'hot_r', 'hsv', 'hsv_r', 'inferno', 'inferno_r', 'jet', 'jet_r', 'magma', 'magma_r', 'nipy_spectral', 'nipy_spectral_r', 'ocean', 'ocean_r', 'pink', 'pink_r', 'plasma', 'plasma_r', 'prism', 'prism_r', 'rainbow', 'rainbow_r', 'seismic', 'seismic_r', 'spring', 'spring_r', 'summer', 'summer_r', 'tab10', 'tab10_r', 'tab20', 'tab20_r', 'tab20b', 'tab20b_r', 'tab20c', 'tab20c_r', 'terrain', 'terrain_r', 'viridis', 'viridis_r', 'winter', 'winter_r']
    }
    this.handleClick = this.handleClick.bind(this);
    this.handlePlot = this.handlePlot.bind(this)
    this.handleClickAnimation = this.handleClickAnimation.bind(this)
    this.handleDoubleClick = this.handleDoubleClick.bind(this)
  }

  handlePlot = (e) => {
    this.setState({ is3dLoading: true })
    get(this.state.url + 'verts_faces?patient=' + this.state.patient + '&tipo=' + e.target.id).then((res) => {
      this.setState({
        x: res.data[0],
        y: res.data[1],
        z: res.data[2],
        i: res.data[3],
        j: res.data[4],
        k: res.data[5],
        is3dLoading: false
      })
    }).catch((error) => {
      console.log('error en verts_faces --->', error)
    })
  }


  // esta es la funcion que controla los botones de play y pause
  handleClickAnimation = (e) => {
    switch (e.target.id) {
      case 'play':
      case 'iplay':
        if (this.state.interval === undefined) {
          var interval = setInterval(() => {
            this.state.n_slide === this.state.n_max ? this.setState({ n_slide: 0 }) : this.setState({ n_slide: parseInt(this.state.n_slide, 10) + 1 })
          }, 50)
          this.setState({ interval })
        }
        break
      case 'pause':
      case 'ipause':
        clearInterval(this.state.interval)
        this.setState({ interval: undefined })
        break
      default:
        break;
    }
  }

  handleDoubleClick = (patient) => {
    this.setState({ isLoading: true, modalDisplay: 'none', patient })
    get(this.state.url + 'vistas?patient=' + patient).then((res) => {
      let data = res.data.split(",")
      console.log(data)
      this.setState({
        superior: data[0],
        frontal: data[1],
        lateral: data[2],
        isLoading: false,
        isLoaded: true
      })
    }).catch((e) => {
      console.log(e)
      this.setState({ isLoading: false })
    })
  }

  handleClick = (e) => {
    let bordes
    switch (e.target.id) {
      case "diag":
        this.setState({ isLoading: true })

        get(this.state.url + 'verts_faces?patient=' + this.state.patient + '&tipo=pulmones').then((res) => {
          console.log(res)
          this.setState({
            x: res.data[0],
            y: res.data[1],
            z: res.data[2],
            i: res.data[3],
            j: res.data[4],
            k: res.data[5]
          })
        }).then(() => {
          return get(this.state.url + 'diagnosticar?patient=' + this.state.patient)
        }).then((res) => {
          let data = res.data.split(",")
          this.setState({
            diagnostico: data[0],
            isDiag: true,
            isLoading: false,
          })
        }).then(() => {
          return this.state.bordes ? 1 : 0
        }).then((bordes) => {
          return get(this.state.url + 'animacion?cmap=' + this.state.cmap + '&vista=' + this.state.vista + '&bordes=' + bordes + '&patient=' + this.state.patient)
        }).then((res) => {
          let data = res.data.split(",")
          this.setState({
            animacion: data,
            n_max: data.length,
            isAnimationLoaded: true
          })
        }).catch((e) => {
          console.log(e)
        })

        break
      case 'apply':
        this.setState({ isLoading: true })
        bordes = this.state.bordes ? 1 : 0
        get(this.state.url + 'animacion?cmap=' + this.state.cmap + '&vista=' + this.state.vista + '&bordes=' + bordes + '&patient=' + this.state.patient)
          .then((res) => {
            let data = res.data.split(",")
            this.setState({
              animacion: data,
              n_max: data.length,
              isLoading: false
            })
          }).catch((e) => {
            console.log(e)
          })
        break
      case 'select':
      case 'selectt':
        get(this.state.url + 'patients').then((res) => {
          let data = res.data.split(',')
          this.setState({
            patients: data,
            modalDisplay: 'block'
          })
        }).catch((e) => {
          console.log('error en listar pacientes', e)
        })
        break
      case 'closeModal':
        this.setState({
          modalDisplay: 'none'
        })
        break
      default:
        break
    }

  }

  render() {
    return (
      <div className="w3-col l12 m12 s12 w3-container w3-padding-32">
        <div className="w3-row">
          <div className="w3-col l12 w3-center" style={{ display: this.state.isLoaded ? 'none' : 'inline-block' }}>
            <button id="select"
              className={"w3-btn w3-blue"}
              onClick={(e) => this.handleClick(e)}
              disabled={this.state.isLoading}>
              {this.state.isLoading ?
                (<div><i className="fa fa-spinner fa-spin"></i> cargando</div>) : <i id="selectt" className="fa fa-upload"> Seleccionar paciente</i>}

            </button>
          </div>
        </div>
        <ListModal patients={this.state.patients} display={this.state.modalDisplay} handleClick={this.handleClick} handleDoubleClick={this.handleDoubleClick} />
        <div className="w3-row">
          <div className="w3-col l2 m1 s0">{'\u00A0'}</div>
          <div className=" w3-center w3-container w3-col l8 m10 s12">
            {this.state.isLoaded ? (
              <div>
                <h3 className="w3-blue ">PERFIL DEL PACIENTE</h3>
                <h5>Vista Axial:</h5>
                <img width="100%" src={'data:image/png;base64,' + this.state.superior} alt="Vista Axial" />
                <h5>Vista Coronal:</h5>
                <img width="100%" src={'data:image/png;base64,' + this.state.frontal} alt="Vista Coronal" />
                <h5>Vista Sagital:</h5>
                <img width="100%" src={'data:image/png;base64,' + this.state.lateral} alt="Vista Sagital" />
                <br /> <br /> <br />
                <button disabled={this.state.isLoading} id="diag" className="w3-btn w3-green" onClick={(e) => this.handleClick(e)} style={{ display: this.state.isDiag ? 'none' : 'inline-block' }}>{this.state.isLoading ? <i className="fa fa-spinner fa-spin"></i> : null} <i className="fa fa-eye"></i> DIAGNOSTICAR</button>
              </div>
            ) : null}


            {this.state.isDiag ? (
              <div>
                {// <img width="100%" src={'data:image/png;base64,' + this.state.pulmon3D} alt="pñulmones 3d" />
                }
                <h2>{'DIAGNOSTICO AI - ' + this.state.diagnostico}</h2>
                <br />
                <br />
                <div className="w3-row">
                  <div className="w3-bar" style={{ width: '100%' }}>
                    <button className={this.state.tab === '3d' ? "w3-btn w3-indigo" : "w3-btn w3-blue w3-hover-indigo"} style={{ width: '50%' }} onClick={(e) => this.setState({ tab: '3d' })}>visualización 3D </button>
                    <button className={this.state.tab === 'animacion' ? "w3-btn w3-indigo" : "w3-btn w3-blue w3-hover-indigo"} style={{ width: '50%' }} onClick={(e) => this.setState({ tab: 'animacion' })}>Animacion</button>
                  </div>
                </div>
                {this.state.tab === '3d' ?
                  <div className="w3-row">
                    <div className="w3-col l12 m12 s12">

                      <div className="w3-border w3-border-red">
                        <div className="w3-bar" style={{ width: '100%' }}>
                          {this.state.is3dLoading ? <i className="fa fa-spinner fa-spin"></i> :
                            <div>
                              <button id="pulmones" className="w3-bar-item w3-button w3-blue" style={{ width: '33.3%' }} onClick={(e) => this.handlePlot(e)}>Pulmones</button>
                              <button id="huesos" className="w3-bar-item w3-button w3-blue" style={{ width: '33.3%' }} onClick={(e) => this.handlePlot(e)}>Huesos</button>
                              <button id="bronquios" className="w3-bar-item w3-button w3-blue" style={{ width: '33.3%' }} onClick={(e) => this.handlePlot(e)}>Bronquios</button>
                            </div>
                          }
                        </div>

                        <Plot
                          data={[
                            {
                              x: this.state.x,
                              y: this.state.y,
                              z: this.state.z,
                              i: this.state.i,
                              j: this.state.j,
                              k: this.state.k,
                              type: 'mesh3d',
                              opacity: 0.6,
                              color: 'rgb(227, 83, 83)',
                            }
                          ]}
                          layout={{ width: '100%', height: 700 }}
                        />
                      </div>
                    </div>
                  </div>
                  :
                  <div className="w3-row">
                    {this.state.isAnimationLoaded ?
                      <div>
                        <div className="w3-col l6 m6 s12">
                          {/* este es el img en la que cambio la imagen*/}
                          <img width="100%" src={'data:image/png;base64,' + this.state.animacion[this.state.n_slide]} alt="vista superior" />
                        </div>
                        <div className="w3-col l6 m6 s12">
                          <div className="w3-row" style={{ width: '100%' }}>
                            <label className="w3-col w3-padding-large" style={{ width: '30%' }}>Vista:</label>
                            <select className="w3-select" style={{ width: '70%' }} name="option" defaultValue="Superior" onChange={(e) => this.setState({ vista: e.target.value })}>
                              <option value="Superior">Axial</option>
                              <option value="Lateral">Sagital</option>
                              <option value="Frontal">Coronal</option>
                            </select>
                          </div>
                          <div className="w3-row" style={{ width: '100%' }}>
                            <label className="w3-col w3-padding-large" style={{ width: '30%' }}>Cmap:</label>
                            <select className="w3-select" style={{ width: '70%' }} name="option" defaultValue="viridis" onChange={(e) => this.setState({ cmap: e.target.value })}>
                              {this.state.cmaps.map((cmap) =>
                                <option value={cmap} key={cmap}>{cmap}</option>
                              )}
                            </select>
                          </div>
                          <input className="w3-check" type="checkbox" onChange={(e) => this.setState({ bordes: e.target.checked })} />
                          <label> Bordes </label>
                          <br />
                          <br />
                          <button disabled={this.state.isLoading} id="apply" className="w3-btn w3-green" onClick={(e) => this.handleClick(e)}>{this.state.isLoading ? <i className="fa fa-spinner fa-spin"></i> : null} <i className="fa fa-check"></i> Aplicar</button>
                          <br />
                          <br />
                          <div className="w3-bar w3-block">
                            <button id="play" className="w3-button w3-circle w3-ripple" onClick={(e) => this.handleClickAnimation(e)}><i id="iplay" className="w3-xlarge fa fa-play"></i></button>
                            <button id="pause" className="w3-button w3-circle w3-ripple" onClick={(e) => this.handleClickAnimation(e)}><i id="ipause" className="w3-xlarge fa fa-pause"></i></button>
                            <input type="range" min={0} max={this.state.n_max} value={this.state.n_slide} onChange={(e) => this.setState({ n_slide: e.target.value })} />
                          </div>
                        </div>
                      </div>
                      :
                      <div className="w3-display-container">
                        <div className="spinner">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    }

                  </div>
                }
              </div>

            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
