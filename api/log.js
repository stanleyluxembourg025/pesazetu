import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const logEntry = req.body;
    const logFilePath = path.join(process.cwd(), 'logs.txt');
    const logLine = JSON.stringify(logEntry) + '\n';

    try {
      fs.appendFileSync(logFilePath, logLine);
      console.log('Activity Log appended to logs.txt:', logEntry);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error writing to logs.txt:', error);
      res.status(500).json({ error: 'Failed to write log' });
    }
  } else {
    res.status(405).end();
  }
}
