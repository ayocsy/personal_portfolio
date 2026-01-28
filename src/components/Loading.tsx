"use client";

function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-titlebar">System</div>
            <div className="loading-body">
                <div className="loading-text">Starting up...</div>
                <div className="loading-progress">
                    <div className="loading-progress-bar"></div>
                </div>
                <div className="loading-subtext">Welcome to Gaster OS</div>
            </div>
        </div>
    );
}


export default Loading;
