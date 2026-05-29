(function () {
  var WORDS  = ["vysněný","moderní","výkonný","úspěšný","bezpečný","stabilní"];
  var COLORS = {
    "vysněný":  "#c46aa3",
    "moderní":  "#2b6bff",
    "výkonný":  "#b81d3a",
    "úspěšný":  "#b45309",
    "bezpečný": "#1f8a5b",
    "stabilní": "#3a6a8c"
  };
  var INTERVAL = 2400;

  var slot = document.getElementById("slot");
  if (!slot) return;

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var i = 0;

  function render() {
    var word = WORDS[i];
    slot.innerHTML = "";
    var span = document.createElement("span");
    span.className = "word";
    span.style.color = COLORS[word] || "var(--color-accent)";
    span.textContent = word;
    slot.appendChild(span);
  }

  render();
  if (!reduced) {
    setInterval(function () {
      i = (i + 1) % WORDS.length;
      render();
    }, INTERVAL);
  }
})();
