const os = require('os');
const logger = require('./logger');

class CPUMonitor {
  constructor() {
    this.cpuUsage = 0;
    this.highCPUCount = 0;
    this.threshold = 70; // percentage
  }

  /**
   * Get CPU usage percentage
   */
  getCPUUsage() {
    return new Promise((resolve) => {
      const startMeasure = this._cpuAverage();
      
      setTimeout(() => {
        const endMeasure = this._cpuAverage();
        
        const idleDifference = endMeasure.idle - startMeasure.idle;
        const totalDifference = endMeasure.total - startMeasure.total;
        
        const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
        
        resolve(percentageCPU);
      }, 1000);
    });
  }

  /**
   * Calculate CPU average
   */
  _cpuAverage() {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;

    cpus.forEach((core) => {
      for (const type in core.times) {
        totalMs += core.times[type];
      }
      idleMs += core.times.idle;
    });

    return {
      idle: idleMs / cpus.length,
      total: totalMs / cpus.length,
    };
  }

  /**
   * Check CPU usage and restart if threshold exceeded
   */
  async checkAndRestart(threshold = this.threshold) {
    try {
      const usage = await this.getCPUUsage();
      this.cpuUsage = usage;

      logger.info(`Current CPU Usage: ${usage.toFixed(2)}%`);

      if (usage > threshold) {
        this.highCPUCount++;
        logger.warn(`CPU usage above threshold (${threshold}%). Count: ${this.highCPUCount}`);

        // Restart if CPU is high for 3 consecutive checks (30 seconds)
        if (this.highCPUCount >= 3) {
          logger.error(`CPU usage consistently above ${threshold}%. Restarting server...`);
          
          // Give some time for logging
          setTimeout(() => {
            process.exit(1); // Exit with error code, PM2 will restart
          }, 1000);
        }
      } else {
        // Reset counter if CPU is normal
        this.highCPUCount = 0;
      }

      return usage;
    } catch (error) {
      logger.error(`CPU monitoring error: ${error.message}`);
      return 0;
    }
  }

  /**
   * Get current CPU usage
   */
  getCurrentUsage() {
    return this.cpuUsage;
  }
}

module.exports = new CPUMonitor();
