import React, {Component} from 'react';
import './EditForm.css';
import CancelIcon from '../../../assets/EditIcons/cancel.svg';
import _ from 'lodash';
import ContentEditable from 'react-contenteditable'

const regInput = "input";
const largeInput = "large input";
const timePeriodInput = "time period input";
const MAXYEAR = 2020;
const MINYEAR = 1950;

// Dynamically makes a form, fields and field types get specified in props
class EditForm extends Component{
    
    state = {
        inputs: this.props.values,
        fields: this.props.fields,
        fieldName: this.props.fieldName,
        inputTypes: this.props.inputTypes,
        oldValues: this.props.values,
        firstRender: true
    }

    // Updates state if the values change
    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.values.id !== null && nextProps.values.id !== prevState.oldValues.id)) {
            return {
                inputs: nextProps.values,
                fields: nextProps.fields,
                fieldName: nextProps.fieldName,
                inputTypes: nextProps.inputTypes,
                oldValues: nextProps.values,
                firstRender: false
            };
        }
    }

    // Updates input values in state when they are changed by user
    inputChangeHandler = (event, value) => {
        const newValue = event.target.value;
        const newInputs = {...this.state.inputs};
        newInputs[value] = newValue;
        this.setState({inputs: newInputs});
    }

    // Updates large input values in state when they are changed by user
    largeInputChangeHandler = (event, value) => {
        const newValue = event.currentTarget.textContent;
        const newInputs = {...this.state.inputs};
        newInputs[value] = newValue;
        this.setState({inputs: newInputs});
    }
    
    // Updates time input values in state when they are changed by user
    timePeriodInputChangeHandler = (event, value) => {
        const newValue =event.target.value;
        const newInputs = {...this.state.inputs};
        newInputs[value] = newValue;
        this.setState({inputs: newInputs, requireRerender: true});
    }
    
    render(){

        // Generats fields based on props the class was instantiated with
        const fieldsOutput = this.state.fields.map((value, index) => {
                if (this.state.inputTypes[index] === regInput) {
                    return (
                        <form key={index} className="edit-form__single-form-entry">
                            <p className="single-form-entry__desc">Set {this.state.fieldName[index]}:</p>
                            <input className="single-form-entry__regInput" type="text" defaultValue={this.state.inputs[value]} onChange={(event) => this.inputChangeHandler(event, value)}></input>
                        </form>
                    );
                } else if (this.state.inputTypes[index] === largeInput) {
                    return  (
                        <form key={index} className="edit-form__single-form-entry">
                            <p className="single-form-entry__desc">Set {this.state.fieldName[index]}:</p>
                            {/*https://github.com/lovasoa/react-contenteditable/issues/182 solution from*/}

                            <ContentEditable
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                    document.execCommand('insertLineBreak')
                                    event.preventDefault()
                                    }}}
                                className="single-form-entry__textarea"
                                innerRef={this.contentEditable}
                                html={this.state.inputs[value]} // innerHTML of the editable div
                                disabled={false}       // use true to disable editing
                                onChange={(event) => this.largeInputChangeHandler(event, value)} // handle innerHTML change
                                tagName='article' // Use a custom HTML tag (uses a div by default)
                            />
                        </form>
                    );
                } else if (this.state.inputTypes[index] === timePeriodInput) {
                    return  (
                        <form key={index} className="edit-form__single-form-entry">

                            <label className="single-form-entry__desc" htmlFor={this.state.fields[index]}>Set {this.state.fieldName[index]}:</label>
                            <select className="single-form-entry__regInput" id={this.state.fields[index]} name={this.state.fieldName[index]} onChange={(event) => this.timePeriodInputChangeHandler(event, value)} value={this.state.inputs[value]} >
                                {this.state.fields[index] === "endDate"?<option value="present">present</option>:null}
                                { _.range(MAXYEAR, MINYEAR-1).map(value => <option key={value} value={value}>{value}</option>) }
                            </select>
                        </form>
                    );
                }else {
                    return <p>Error</p>
                }
            });
        
        return(
            <div className="edit-form__container">
                <h2 style={{margin: 0}}>Edit Form</h2>
                {fieldsOutput}
                <hr className="edit-form-horizontal-line"></hr>
                <div className="edit-form__button-selection">
                    {this.props.isDeletable === true ? <button className="edit-form__delete-button" onClick={this.props.deleteItem}>Delete</button> : <div></div>}
                    <button className="edit-form__save-button" onClick={() => {this.props.changeEditable(); this.props.changeValues(this.state.inputs)}}>Save Changes</button>
                </div>
                <input className="edit-form__cancel" type="image" src={CancelIcon} alt="edit" onClick={this.props.changeEditable} />
            </div>
        );
    }
}

export default EditForm;