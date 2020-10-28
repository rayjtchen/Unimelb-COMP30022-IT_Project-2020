import React, {Component} from 'react';
import './JobHistoryItem.css';
import '../../../../containers/UserFolioPage/profileShared.css';
import Aux from '../../../../hoc/Auxiliary/Auxiliary'
import EditForm from '../../EditForm/EditForm';
import EditIcon from '../../../../assets/EditIcons/edit.svg';
import FilesUpload from '../../../FilesUpload/FilesUpload';
import ShowMoreText from 'react-show-more-text';


class JobHistoryItem extends Component {
    state = {
        itemEditable: false,
        jobEditable: false,
        durationEditable: false,
        descriptionEditable: false,
    }

    componentDidUpdate = () => {
        if (! this.props.editable && this.state.itemEditable){
            this.setState({itemEditable: false})
        }
    } 


    itemEditableHandler = () => {
        this.setState({itemEditable: !this.state.itemEditable, 
                        jobEditable: false,
                        durationEditable: false,
                        descriptionEditable: false})
    }

    checkItemEditable = () => {
        return this.props.editable && this.state.itemEditable;
    }

    changeItemHandler = (input) =>{
        this.props.changeItemHandler(this.props.id, input)
    }

    itemDeleteHandler = () => {
        this.setState({itemEditable: false});
        this.props.hisItemRemoveHandler(this.props.id);
    }

    changeJobItemProfileImg = (img) => {
        this.props.changeJobItemProfileImg(img, this.props.id);
    }



    render(){
        let overviewOffset = ["profile-sub-item__title"]; //classes

        if (this.props.editable) {
            overviewOffset.push("profile-sub-item__tab-off-set");
        }

        return (
            <Aux>
                <div className="profile-sub-item">
                    <div className="profile-sub-item__pic">
                        <img src={this.props.item["urlThumbnail"]} alt="job-history"/>
                    </div>
                    <div className="profile-item__info">
                        {!this.state.itemEditable? 
                            <Aux>
                                <div className={overviewOffset.join(" ")}>
                                     <h1>{this.props.item["organisation"] + ": " + this.props.item["title"]}</h1>

                                    <h1>{this.props.item["startDate"]} - {this.props.item["endDate"]}</h1>
                                </div>

                                <div className="profile-sub-item__description-nowrap">
                                    <ShowMoreText
                                        /* Default options */
                                        lines={3}
                                        more='Show more'
                                        less='Show less'
                                        anchorClass=''
                                        onClick={this.executeOnClick}
                                        expanded={false}
                                        
                                    >
                                    <div className="profile-sub-item__description">   
                                        {this.props.item["description"]}
                                    </div> 
                                        
                                    </ShowMoreText> 
                                </div>
                            </Aux>
                        :
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <EditForm 
                                    values={this.props.item} 
                                    fields={["title", "organisation", "startDate", "endDate", "description"]} 
                                    fieldName={["Job Role", "Company", "Start Date", "End Date", "Job Description"]}
                                    changeEditable = {this.itemEditableHandler} 
                                    changeValues = {this.changeItemHandler}
                                    inputTypes={["input", "input", "time period input", "time period input", "large input"]}
                                    isDeletable={true}
                                    deleteItem={this.itemDeleteHandler}
                                    />
                                <p>Upload Thumbnail Below. Note: File uploads cannot be undone.</p>
                                <FilesUpload
                                    type='ItemBlock'
                                    maxFiles = {1}
                                    itemBlock_id= {this.props.item._id}
                                    accept = 'image/*'
                                    fileRejectMessage = 'Image only'
                                    returnResult = {this.changeJobItemProfileImg}
                                />
                            </div>
                        }
                    </div>

                    {this.props.editable && !this.state.itemEditable? 
                    <Aux>
                        <input className="profile-sub-item_edit" type="image" src={EditIcon} onClick={this.itemEditableHandler} alt="edit"/>
                        
                    </Aux> 
                    :null}
                    
                </div>               
                {!this.props.isLastItem? <div className="horizontal-divider"></div>: <div style={{minHeight: "1rem"}}></div>} 
            </Aux>
        );
    }
}

export default JobHistoryItem; 