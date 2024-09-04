document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded"); // Add this

    const videoElement = document.getElementById('video');
    const uploadButton = document.getElementById('uploadButton');
    const resultContainer = document.getElementById('resultContainer');

    async function startStreaming() {
        console.log("Starting video streaming"); // Add this
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoElement.srcObject = stream;
            videoElement.play();
            console.log("Video streaming started"); // Add this
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    async function captureAndUpload() {
        console.log("Capturing and uploading video frame"); // Add this
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob, 'video.mp4');

            try {
                const response = await fetch('http://localhost:8000/upload_video/', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                displayResult(data);
            } catch (error) {
                console.error('Error uploading video frame:', error);
                resultContainer.textContent = "Error uploading video frame";
            }
        }, 'video/mp4');
    }

    function displayResult(data) {
        console.log("Displaying result", data); // Add this
        if (data.error) {
            resultContainer.textContent = `Error: ${data.error}`;
        } else {
            resultContainer.textContent = `Label: ${data.frames[0]?.label}, Confidence: ${data.frames[0]?.confidence}`;
        }
    }

    uploadButton.addEventListener('click', async () => {
        console.log("Upload button clicked"); // Add this
        await captureAndUpload();
    });

    startStreaming();
});
