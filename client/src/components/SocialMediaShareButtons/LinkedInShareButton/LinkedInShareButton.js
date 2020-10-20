import React from "react";
import classes from "./LinkedInShareButton.module.css";
import LinkedInIcon from '../../../assets/Homepage-icons/linkedin-icon.svg';

const linkedInShareButton = (props) => {
    let linkedInLink = "https://www.linkedin.com/sharing/share-offsite/?url=";
    
    if (props.profileLink) {
        linkedInLink = linkedInLink.concat(props.profileLink);
    }
  
      
    return (
    <div className={classes.button}>
        <a href={linkedInLink}>
            <img src={LinkedInIcon} alt="Share Your Profile On Twitter" />
        </a>
    </div>
    )
};

export default linkedInShareButton;