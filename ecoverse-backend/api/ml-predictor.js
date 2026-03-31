const { spawn } = require('child_process');
const path = require('path');

/**
 * Call Python ML prediction script
 */
function callPythonScript(args) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, '..', 'ml-service', 'predict.py');
    const pythonProcess = spawn('python', [pythonScript, ...args]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject({
          success: false,
          error: `Python script failed with code ${code}`,
          details: stderr,
        });
      } else {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (e) {
          reject({
            success: false,
            error: 'Failed to parse Python output',
            details: e.message,
          });
        }
      }
    });
  });
}

/**
 * Predict carbon footprint with ML
 * @param {number} distance - Travel distance in km
 * @param {number} transportType - 1=flight, 2=car, 3=bus, 4=train
 * @param {number} electricityUsage - Monthly usage in kWh
 * @returns {Promise<Object>} Prediction result with recommendations
 */
async function predictCarbonImpact(distance, transportType, electricityUsage) {
  try {
    const result = await callPythonScript([
      String(distance),
      String(transportType),
      String(electricityUsage),
    ]);

    return result;
  } catch (error) {
    console.error('ML Prediction error:', error);
    throw error;
  }
}

module.exports = {
  predictCarbonImpact,
};
