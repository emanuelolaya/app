import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListModal extends Component {
    constructor(props) {
        super(props)
        this.props = {
            patients: PropTypes.array.isRequired,
            handleDoubleClick: PropTypes.func.isRequired,
            handleClick: PropTypes.func.isRequired,
            display: PropTypes.string.isRequired
        }
    }
    render() {
        return (
            <div className="w3-modal" style={{ display: this.props.display }}>
                <div className="w3-modal-content w3-animate-zoom" style={{ width: '30%' }}>
                    <header className="w3-container w3-green">
                        <span id="closeModal" className="w3-button w3-display-topright"
                            onClick={(e)=> this.props.handleClick(e)}>&times;</span>
                        <h2>Lista de pacientes</h2>
                    </header>
                    <div className="w3-container w3-padding-16">
                        <ul className="w3-ul">
                            {this.props.patients.map((patient) =>
                                <li onDoubleClick={(e)=>this.props.handleDoubleClick(patient)}
                                    style={{ cursor: 'pointer' }}
                                    className="w3-hover-pale-green"
                                    key={patient}>{patient}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default ListModal;