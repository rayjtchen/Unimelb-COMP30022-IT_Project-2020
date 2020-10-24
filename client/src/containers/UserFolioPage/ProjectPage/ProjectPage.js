import React, {Component} from 'react';
import ImageGallery from 'react-image-gallery';
import AttachmentItem from '../../../components/ProfilePageFileTemplate/AttachmentItem/AttachmentItem';
import './ProjectPage.css'

import EditIcon from '../../../assets/EditIcons/edit.svg';
import AddIcon from '../../../assets/EditIcons/add.svg';
import CancelIcon from '../../../assets/EditIcons/cancel.svg';

import BackDrop from '../../../components/UI/BackDrop/BackDrop'
import FilesUpload from '../../../components/FilesUpload/FilesUpload';
import ImgUpload from '../../../components/FilesUpload/ImgUpload';
import Aux from '../../../hoc/Auxiliary/Auxiliary'

//redux
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/index';
import axios from "axios";

import crossIcon from '../../../assets/LoginPage-icons/cross.svg';

import eggImg1 from '../../../assets/ProfilePageDocuments/egg1.jpg'
import eggImg2 from '../../../assets/ProfilePageDocuments/egg2.jpg'
import eggImg3 from '../../../assets/ProfilePageDocuments/egg3.jpg'
import eggImg4 from '../../../assets/ProfilePageDocuments/egg4.jpg'
import eggImg5 from '../../../assets/ProfilePageDocuments/egg5.jpg'

import EditForm from '../../../components/ProfilePageFileTemplate/EditForm/EditForm';

const defaultTitle = "My theses on eggs"
const defaultDes = "The egg is the organic vessel containing the zygote in which an embryo develops until it can survive on its own, at which point the animal hatches. An egg results from fertilization of an egg cell. Most arthropods, vertebrates (excluding live-bearing mammals), and mollusks lay eggs, although some, such as scorpions, do not. Reptile eggs, bird eggs, and monotreme eggs are laid out of water and are surrounded by a protective shell, either flexible or inflexible. Eggs laid on land or in nests are usually kept within a warm and favorable temperature range while the embryo grows. When the embryo is adequately developed it hatches, i.e., breaks out of the egg's shell. Some embryos have a temporary egg tooth they use to crack, pip, or break the eggshell or covering.The egg is the organic vessel containing the zygote in which an embryo develops until it can survive on its own, at which point the animal hatches. An egg results from fertilization of an egg cell. Most arthropods, vertebrates (excluding live-bearing mammals), and mollusks lay eggs, although some, such as scorpions, do not. Reptile eggs, bird eggs, and monotreme eggs are laid out of water and are surrounded by a protective shell, either flexible or inflexible. Eggs laid on land or in nests are usually kept within a warm and favorable temperature range while the embryo grows. When the embryo is adequately developed it hatches, i.e., breaks out of the egg's shell. Some embryos have a temporary egg tooth they use to crack, pip, or break the eggshell or covering."



class ProjectPage extends Component {
    
    state = {
        showPdf: false,
        files: [],
      
        titleDesEditable: false,
        filesEditable: false,
        
        editMode: false,
        
        title: defaultTitle,
        description: defaultDes        
    }


    componentDidMount() {
        //const item_id = this.props.itemBlock_id;5f81bdf6db99e33e48002c54

        const item_id = "5f81bdf6db99e33e48002c54";

        if(!item_id) return;

        //set item id for query data
        const data = {
            item_id: item_id
        }

        //get all files by given item_id
        axios.post('/api/files/seeAll', data)
            .then(response => {
                //console.log(response.data.files);
                this.setState({files: response.data.files});
 
            })
            .catch(error => {
                this.setState({files: []});
                console.log(error);
            });
    }

       

    changeTitleDes = (inputs) => {
        this.setState({title: inputs[0], description: inputs[1]})
    }

    changeTitleDesEditable = () => {
        this.setState({titleDesEditable: !this.state.titleDesEditable})
    }

    changeFileEditable = () => {
        this.setState({filesEditable: !this.state.filesEditable})
    }

    deleteImageByIndex = (index) => {
        const newImages = [...this.state.images];
        newImages.splice(index, 1);
        this.setState({images: newImages});
    }



    editingImages = () => {
        return this.state.images.map((image, index) => {
            return <Aux>
                        <img src={crossIcon} alt="delete" onClick={() => this.deleteImageByIndex(index)}/>
                        <img src={image.original} alt={"image:"+image.id} />
                    </Aux>
        })
    }

    

    doNothing = () => {

    }

  

    // return true if the visitor has the right to edit this userFolioPage
    checkHasRightToEdit = () => {
        const folioOwnerId = this.props.match.params.userId;
        const visitorToken = this.props.userAuthToken;
        // return true, if the visitor is the folioPage owner, or the visitor is an admin staff
        if (visitorToken !== null && folioOwnerId !== null && (folioOwnerId===visitorToken._id || this.props.userAuthToken.isAdmin)){
            return true;
        }
        return false;
        // otherwise return false
    }

    editButtons = () => {
        if (this.state.titleDesEditable){
            return <input className="education-history__cancel" type="image" src={CancelIcon} alt="edit" onClick={() => {this.changeTitleDesEditable(); this.changeFileEditable(); this.setState({editMode: false})}} />  
        }
        return <input className="education-history__edit" type="image" src={EditIcon} onClick={() => {this.changeTitleDesEditable(); this.changeFileEditable(); this.setState({editMode: true})}} alt="edit"/>
    }

    // Renders all the attachment blocks that are not images when in view mode
    // Renders all the attachments that are not images than all the images when in edit mode
    
    getImages = (items) => {
        let imageList = [];
        for (let i=0; i<items.length; i++) {
            if (items[i].mimetype.slice(0, 5) == "image") {
                imageList.push(items[i]);
            }
        }
        return imageList;
    }

    deleteAttachmentHandler = (index) => {
        let filesNew = [...this.state.files];
        filesNew.splice(index, 1)
        this.setState({files: filesNew});
    }

    galleryFormatConvertor = (items) => {
        let convertedList = [];
        for (let i=0; i<items.length; i++) {
            if (items[i].mimetype.slice(0, 5) == "image") {
                convertedList.push({
                    original: items[i].urlCloudinary,
                    thumbnail: items[i].urlCloudinary,
                    id: items[i]._id
                });
            }
        }
        return convertedList;
    }

    render() {
        const showNonImageAttachments = this.state.files.map((item, index) => {
            
            if (item.mimetype.slice(0, 5) !== "image") {
                return <AttachmentItem
                    fileName=""
                    key={item._id}
                    name={item.title}
                    size={item.size}
                    url={item.urlCloudinary}
                    editable={this.state.editMode}
                    hasThumbnail={false}
                    deleteAttachmentHandler={this.deleteAttachmentHandler}
                    index={index}/>
            } else {
                return null;
            }
        });

        const showImageAttachments = this.state.files.map((item, index) => {
            
            if (item.mimetype.slice(0, 5) === "image") {
                return <AttachmentItem
                    fileName=""
                    key={item._id}
                    name={item.title}
                    size={item.size}
                    url={item.urlCloudinary}
                    editable={this.state.editMode}
                    hasThumbnail={true}
                    deleteAttachmentHandler={this.deleteAttachmentHandler}
                    index={index}/>
            } else {
                return null;
            }
        });
                       
        return (
            <div className="project-page-container">
                <div style={{margin: "1rem 0"}}>
                    <button className="project-page__goBack"> {"<"} Back to main portfolio </button>
                </div>
                {this.state.titleDesEditable && this.checkHasRightToEdit()? <h1 className="project-page-container__title">Edit Mode</h1>:
                <h1 className="project-page-container__title">{this.state.title}</h1>}
                
                {this.state.filesEditable? null:   
                <Aux>
                    <div className="ImageGallery">   
                        {this.getImages(this.state.files).length > 0? 
                            <ImageGallery items={this.galleryFormatConvertor(this.getImages(this.state.files))} 
                                showThumbnails={false}
                                autoPlay={true}/>
                        :null}
                    </div> 
                </Aux>}
                                
                {this.state.titleDesEditable && this.checkHasRightToEdit()? 
                    <EditForm values={[this.state.title, this.state.description]} 
                        changeEditable = {() => {this.changeTitleDesEditable(); this.changeFileEditable(); this.setState({editMode: false})}} 
                        changeValues={this.changeTitleDes}
                        fields={["Project Title", "Project Description"]}
                        inputTypes={["input", "large input"]}/>
                    :<Aux>
                        <p style={{fontSize: "1.2rem"}}>{this.state.description}</p>
                    </Aux>
                }
                {this.state.titleDesEditable && this.checkHasRightToEdit() && (this.state.files.length - this.getImages(this.state.files).length) > 0? 
                <div className="project-attachment-info">
                    <h3>Delete an attachment</h3>
                </div>:null}
                
                {showNonImageAttachments}
                
                {this.state.titleDesEditable && this.checkHasRightToEdit() && this.getImages(this.state.files).length > 0? 
                <div className="project-attachment-info">
                    <h3>Delete an image from carousel</h3>
                </div>:null}

                {this.state.titleDesEditable && this.checkHasRightToEdit()? 
                showImageAttachments:null}

                {this.state.titleDesEditable && this.checkHasRightToEdit()? 
                <div className="project-attachment-info">
                    <h3>Drag and drop images or files below. Images will be added to a viewer and attachments at bottom of page.</h3>
                </div>:null}    

                {this.state.titleDesEditable && this.checkHasRightToEdit()?
                <FilesUpload
                    itemBlock_id='5f81bdf6db99e33e48002c54'
                    type='File'
                    maxFiles = {10}
                    accept = '*'
                    fileRejectMessage = 'Image, audio and video files only'
                />:null}
                   

                {this.checkHasRightToEdit()? this.editButtons()
                : null}
                <div style={{margin: "1rem 0"}}>
                    <button className="project-page__goBack"> {"<"} Back to main portfolio </button>
                </div>
            </div>
        )
    }
}

//bring in redux state
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        LoginMessage: state.auth.message,
        userAuthToken: state.auth.userAuthToken
    };
};


//bring in redux actions
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password) => dispatch( actionCreators.auth(email, password)),
        onLogout: () => dispatch(actionCreators.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);