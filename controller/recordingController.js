import Recording from '../model/Record.js';

let isRecording = false;

const startRecording = async (req, res) => {
    try {
        if (isRecording) {
            return res.status(400).json({ message: "Recording already in progress" });
        }

        isRecording = true;
        res.status(200).json({ message: "Recording started successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const stopRecording = async (req, res) => {
    try {
        if (!isRecording) {
            return res.status(400).json({ message: "No recording in progress" });
        }

        isRecording = false;
        res.status(200).json({ message: "Recording stopped successfully" });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const listRecordings = async (req, res) => {
    try {
        const recordings = await Recording.find();
        res.status(200).json(recordings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const replayRecording = async (req, res) => {
    const { id } = req.params;
    
    try {
        const recording = await Recording.findById(id);
        if (!recording) {
            return res.status(404).json({ message: 'Recording not found' });
        }

 
        res.status(200).json({
            message: 'Replaying recording...',
            recording: recording
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteRecording = async (req, res) => {
    const { id } = req.params;

    try {
        const recording = await Recording.findByIdAndDelete(id);
        if (!recording) {
            return res.status(404).json({ message: 'Recording not found' });
        }

        res.status(200).json({ message: 'Recording deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const filterRecordings = async (req, res) => {
    const { method, url } = req.query;

    try {
        const recordings = await Recording.find({ 
            'request.method': method,
            'request.url': url 
        });

        res.status(200).json(recordings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export {
    isRecording,
    startRecording,
    stopRecording,
    listRecordings,
    replayRecording,
    deleteRecording,
    filterRecordings
};
