const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: String,
    source: String,
    resume: String,
    coverLetter: String,
    interviewProcess: String,
    interviewQuestions: String,
    url: String,
    interviewHelperFiles: [{ name: String, path: String }],
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
