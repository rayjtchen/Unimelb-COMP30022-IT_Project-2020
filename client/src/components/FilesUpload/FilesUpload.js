import React, {Component} from 'react';
import axios from 'axios';

import LoadingAnimation from '../LoadingAnimation/LoadingAnimation';

class FilesUpload extends Component {

    state = {
        file: null,
        filename: '',
        uploadedFile: '',
        message: '',
        loading: false,
        uploadPercentage: 0
    }

    readFileHandler = event => {
        event.preventDefault();
        this.setState({message: '', uploadPercentage: 0});
        if(!event.target.files[0]) return;

        this.setState({file: event.target.files[0]});
        this.setState({filename: event.target.files[0].name});
    };


    postFileHandler = async (event) => {

        if(!this.state.file) return;
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', this.state.file);

        this.setState({loading: true});

        try {
            const res = await axios.post('http://localhost:5000/api/portfolio/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {

                    this.setState({uploadPercentage:
                            parseInt(
                                Math.round((progressEvent.loaded * 100) / progressEvent.total))});
                }
            })
                .then( (response) => {
                    console.log(response);

                    this.setState({message: response.data.status});

                });

            //remove file details
            this.setState({file: null, filename: ''});

            //const { fileName, filePath } = res.data;

            //setUploadedFile({ fileName, filePath });

        } catch (err) {
            this.setState({message: err.response.data.status});
        }
        this.setState({loading: false});
    };

    render(){
        let result;

        if(this.state.loading){
            result = (
                <div className="LoginWindow">
                    <LoadingAnimation />
                    <p>Please Upload Your Files</p>
                    {this.state.message}
                    <form>
                        <div>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                disabled
                            />
                            <label>
                                {this.state.filename}
                            </label>
                        </div>

                        <input
                            type='submit'
                            value='Upload'
                            disabled
                        />
                    </form>
                </div>
                );

        }else{

            result = (
                <div className="LoginWindow">
                    <p>Please Upload Your Files</p>
                    {this.state.message}
                    <form onSubmit={this.postFileHandler}>
                        <div>
                            <input
                                type='file'
                                className='custom-file-input'
                                id='customFile'
                                onChange={(event) => this.readFileHandler(event)}
                            />
                            <label>
                                {this.state.filename}
                            </label>
                        </div>

                        <input
                            type='submit'
                            value='Upload'
                        />
                    </form>
                </div>
            );
        }
        return result;
    }
}

export default FilesUpload;