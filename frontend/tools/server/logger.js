/* eslint-disable no-console */

const chalk = require('chalk')
const ip = require('ip')

const divider = chalk.gray('\n-----------------------------------');



/**
 * Logger middleware, you can customize it to make messages more personal
 */
const logger = {

  // Called whenever there's an error on the server we want to print
  error: (err) => {
    console.error(chalk.red(err));
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host, tunnelStarted) => {
    console.log(`${chalk.green('✓')} Server started`);

    // If the tunnel started, log that and the URL it's available at
    if (tunnelStarted) {
      console.log(` ${chalk.green('✓')} Tunnel initialized`);
    }

    console.log(`
${chalk.bold('Access URLs:')}${divider}
 Use this: ${chalk.green.inverse(`http://localhost.timecamp.com:${port}`)} 
           ${chalk.dim(`[cookies require at least one dot domain to save]
           [workaround Chrome DNS 10s resolve with 1 dot FQDN]`)}
Localhost: ${(`http://${host}:${port}`)}
      LAN: ${(`http://${ip.address()}:${port}`) +
(tunnelStarted ? `\n    Proxy: ${chalk.magenta(tunnelStarted)}` : '')}${divider}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },
};

module.exports = logger
