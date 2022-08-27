const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Trace = mongoose.model('Trace');

const router = express.Router();

router.use(requireAuth);

router.get('/traces', async (req, res) => {
  const traces = await Trace.find({ userId: req.user._id });

  res.send(traces);
});

router.get('/traces/:id', async (req, res) => {
  const traceId = req.params.id;
  const traces = await Trace.findById(traceId);

  res.send(traces);
});

router.delete('/traces/:id', async (req, res) => {
  const traceId = req.params.id;
  const traces = await Trace.findOneAndDelete(traceId);

  res.send(traces);
});

router.post('/traces', async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    let errorMessage = 'You must provide a name and locations';
    if (!name) errorMessage = 'You must provide trace name';
    if (!locations) errorMessage = 'You must provide location, try move further';
    return res
      .status(422)
      .send({ message: errorMessage });
  }

  try {
    const trace = new Trace({ name, locations, userId: req.user._id });
    await trace.save();
    res.send(trace);
  } catch (err) {
    res.status(422).send({ message: err.message });
  }
});

module.exports = router;
