const debounce = (fn, delay) => {
  let timeId;
  let lastCallTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCallTime < delay) {
      clearTimeout(timeId);
    }
    lastCallTime = now;

    timeId = setTimeout(() => {
      args.length > 0 ? console.log(args[0]) : null;
      fn.apply(this, args);
    }, delay);
  };
};

const COLORS = {
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  GRAY: "\x1b[90m",
  RED: "\x1b[31m",
};
module.exports = { debounce, COLORS };
