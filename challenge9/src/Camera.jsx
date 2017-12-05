import React, { Component } from 'react';
import UploadPicture from "./UploadPicture";

var localStream;
var bob;
class Camera extends Component {

    render() {
        return (
            <div className="col-md-6 col-sm-12">
                <video ref="camera" className="camera"></video>
                <canvas ref="imageHolder" className="hidden"></canvas>
                <img ref="image" src="" alt="snapshot" className="hidden" />
                {this.props.webcamState ? (
                    <div>
                        <button ref="webcamButton" onClick={(e) => this.handleWebcamButton(e)} className="btn btn-primary">Use Webcam</button>
                        <button ref="uploadPicButton" onClick={(e) => this.handleUploadButton(e)} className="btn btn-primary">Input Picture URL</button>
                    </div>
                ) : (
                        <div>
                            <button ref="cancelButton" onClick={(e) => this.handleCancelButton(e)} className="btn btn-default">Cancel</button>
                            <button ref="takePicButton" onClick={(e) => this.handleTakePicButton(e)} className="btn btn-default">Take Picture</button>
                        </div>
                    )
                }
            </div>
        );
    }

    handleWebcamButton(e) {
        e.preventDefault();
        var video = this.refs.camera;
        var componentObject = this;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
                video.play();
                componentObject.props.onClick(false);
                localStream = stream;
            })
            .catch(function (error) {
                window.alert("Error occured. Please try again.");
            }); 
    }

    handleCancelButton(e) {
        e.preventDefault();
        var video = this.refs.camera;
        this.props.onClick(true);
        // takes out video streaming
        video.srcObject = null;
        // turns off camera
        localStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    handleTakePicButton(e) {
        e.preventDefault();
        var video = this.refs.camera;
        video.pause();
        localStream.getTracks().forEach(function (track) {
            track.stop();
        });
        this.refs.takePicButton.classList.add("hidden");

        var canvas = this.refs.imageHolder;
        canvas.setAttribute("height", video.clientHeight);
        canvas.setAttribute("width", video.clientWidth);
        var photo = this.refs.image;
        var context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        var data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);

        canvas.toBlob((blob) => {
            this.props.passFaceURL(blob);
        })
        
    }

    handleUploadButton(e) {
        this.props.useUploadedPicture(true);
    }
}

export default Camera;