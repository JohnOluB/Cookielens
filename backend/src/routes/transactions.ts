import express from 'express';
import { fetchTransaction } from '../services/rpc';
import { decodeTx } from '../services/decoder';
import { formatAddress, formatTime, formatFee } from '../services/formatter';

const router = express.Router();

// GET /api/transactions/decode/:signature
router.get('/decode/:signature', async (req, res) => {
  try {
    const { signature } = req.params;

    // Validate signature format (88 chars, base58)
    if (!signature || signature.length !== 88) {
      return res.status(400).json({ error: 'Invalid signature format' });
    }

    // Fetch from RPC
    const rawTx = await fetchTransaction(signature);
    if (!rawTx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Decodes
    const decoded = await decodeTx(rawTx);

    // Format for frontend
    const response = {
      signature,
      status: decoded.status,
      action: decoded.action,
      program: decoded.program,
      from: formatAddress(decoded.from),
      to: formatAddress(decoded.to),
      fee: formatFee(decoded.fee),
      timestamp: formatTime(decoded.timestamp),
      details: decoded.details,
      raw: rawTx, // Include raw for "Show raw" toggle
    };

    res.json(response);
  } catch (error) {
    console.error('Decode error:', error);
    res.status(500).json({ error: 'Failed to decode transaction' });
  }
});

export default router;
