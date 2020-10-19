import React, {Component} from 'react';
import './UserFolioPage.css'


import ProfileBlockWithImage from '../../components/ProfilePageFileTemplate/ProjectBlockWithImage/ProfileBlockWithImage';
import EducationHistory from '../../components/ProfilePageFileTemplate/EducationHistory/EducationHistory';

import google1 from '../../assets/ProfilePageDocuments/google.png';
import google2 from '../../assets/ProfilePageDocuments/google2.jpg';

import "react-image-gallery/styles/css/image-gallery.css";
import UserProfile from '../../components/ProfilePageFileTemplate/UserProfile/UserProfile'

//redux
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import axios from "axios";


const text = "The egg is the organic vessel containing the zygote in which an embryo develops until it can survive on its own, at which point the animal hatches. An egg results from fertilization of an egg cell. Most arthropods, vertebrates (excluding live-bearing mammals), and mollusks lay eggs, although some, such as scorpions, do not. Reptile eggs, bird eggs, and monotreme eggs are laid out of water and are surrounded by a protective shell, either flexible or inflexible. Eggs laid on land or in nests are usually kept within a warm and favorable temperature range while the embryo grows. When the embryo is adequately developed it hatches, i.e., breaks out of the egg's shell. Some embryos have a temporary egg tooth they use to crack, pip, or break the eggshell or covering."
    
class UserFolioPage extends Component {
    state = {
        educationHistory: {
            ids: [0,1,2],
            schools: ["Eggy Junior High", "University of Eggplication", "Institute of Making Benedict Egg"],
            descriptions:[text+text, text, text], 
            images: [google1, google1, google2],
            durations:["2022-2024", "2024-2027", "2027-2???"]
        },
        itemBlocks: [],
        profileBlocks: []
    }

    //get the data right after the user access his/her folio page
    componentDidMount() {
        let user_id;

        //check if redux userAuthToken exit, if not check if userAuthToken is in local storage
       if(this.props.userAuthToken){
           user_id = this.props.userAuthToken._id;

       }else{
           const userAuthToken = JSON.parse(localStorage.getItem('userAuthToken'));
           if(!userAuthToken){
               this.setState({itemBlocks: []});
               return;
           }
           else{
               user_id = userAuthToken._id;
           }
       }

       //set user id for query data
        const data = {
            user_id: user_id
        }

       //get itemBlocks
        axios.post('/api/itemblocks/seeall', data)
            .then(response => {
                console.log(response.data);
                this.setState({itemBlocks: response.data});
            })
            .catch(error => {
                this.setState({itemBlocks: []});
                console.log(error);
            });

       //get user profileBlock
        axios.post('/api/profileblocks/see', data)
            .then(response => {
                console.log(response);
                this.setState({profileBlocks: response.data});
            })
            .catch(error => {
                this.setState({profileBlocks: []});
                console.log(error);
            });
    }


    changeHisItemHandler = (itemType, id, input) => {
        const newEduHis = {...this.state.educationHistory}
        switch (itemType) {
            case "school":
                const newSchools = [...this.state.educationHistory.schools]
                newSchools[id] = input
                newEduHis.schools = newSchools
                this.setState({educationHistory:newEduHis})
                console.log("newState: " + this.state.toString())
                break;
            case "duration":
                const newDurations = [...this.state.educationHistory.durations]
                newDurations[id] = input
                newEduHis.durations = newDurations
                this.setState({educationHistory:newEduHis})
                break;
            case "description":
                const newDes = [...this.state.educationHistory.descriptions]
                newDes[id] = input
                newEduHis.descriptions = newDes
                this.setState({educationHistory:newEduHis})
                break;
            default:
                return;
        }
    }

    render() {
          return (
            <div className="UserFolioPage">

                <UserProfile />

                <h2>My eggucation history</h2>

                <EducationHistory
                        ids = {this.state.educationHistory.ids}
                        schools={this.state.educationHistory.schools}
                        descriptions={this.state.educationHistory.descriptions}
                        images={this.state.educationHistory.images}
                        durations={this.state.educationHistory.durations} 
                        changeItemHandler = {this.changeHisItemHandler}/>

                <h2>My projeggcts</h2>

                <ProfileBlockWithImage image={google2} text={text+text+text} title="Founded Eooggle" itemBlock_id='5f81bdf6db99e33e48002c54' />
                <ProfileBlockWithImage image={google1} text={text} title="Founded Eggipedia" itemBlock_id='5f81bdf6db99e33e48002c54' />
                {/* <ProfileBlockNoImage text={text} title="Founded Eooggle" />
                <ProfileBlockTwoProject texts={[text, text]} titles={["Founded Eooggle", "Founded Eggipedia"]} /> */}
                
            </div>
        
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(UserFolioPage);