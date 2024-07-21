import express from 'express';
import {
    startRecording,
    stopRecording,
    listRecordings,
    replayRecording,
    deleteRecording,
    filterRecordings
} from '../controller/recordingController.js';

const router = express.Router();

router.get('/startRecord', startRecording);
router.get('/stopRecord', stopRecording);
router.get('/list', listRecordings);
router.get('/replay/:id', replayRecording);
router.delete('/delete/:id', deleteRecording);
router.get('/filter', filterRecordings);

export default router;
