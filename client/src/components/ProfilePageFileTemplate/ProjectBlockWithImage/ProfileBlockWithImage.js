import React, {Component} from 'react';
import './ProfileBlockWithImage.css'

class ProfileBlockWithImage extends Component {
    render () {
        return(
            <section className="project-block-with-image">
                <div className="project-block-with-image__pic">
                    <a href="#image">
                        <img src={this.props.image} alt='img'/>
                    </a>
                </div>
                <div className="project__overview">
                    <div className="overview__title">
                        <a href="#title">
                            <h1>{this.props.title}</h1>
                        </a>
                    </div>

                    <div className="overview__description">
                        {this.props.text}    
                    </div>
                    <div className="overview__see-more">
                        <a href="#see-more">See more</a>
                    </div>
                </div>
            </section>
        );
    }
}

export default ProfileBlockWithImage; 