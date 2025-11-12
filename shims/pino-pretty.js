// Pino-pretty shim to disable Pino pretty printing
module.exports = function() {
  return {
    write: () => {},
    end: () => {},
    flush: () => {}
  };
};
