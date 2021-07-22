document.getElementById("edit-payday").addEventListener("click", () => {
  const paydayForm = document.getElementById("payday-form");
  if (paydayForm.hasAttribute("hidden")) {
    paydayForm.removeAttribute("hidden");
  } else {
    paydayForm.setAttribute("hidden", true);
  }
});

function getDaily() {
  const form = document.getElementById("data-form");
  const account = form.elements.account.value;
  let pending = form.elements.pending.value;
  pending = pending ? pending : 0;
  const save = form.elements.save.value;
  const accountFinal = account - pending;
  const diff = +document.getElementById("diff").innerText;
  // not using url matching, but that seems kinda rubbish (at least for this use case)
  fetch(`/calc?account=${accountFinal}&save=${save}&diff=${diff}`).then(
    (res) => {
      res.json().then((json) => {
        // json: { daily: string }
        document.getElementById("results").removeAttribute("hidden");
        document.getElementById("daily").innerHTML = json.daily;
      });
    }
  );
}

function changePayday() {
  const form = document.getElementById("payday-form");
  const day = form.elements.day.value;
  fetch(`/payday?day=${day}`).then((res) => {
    res.json().then((json) => {
      // json: { payday: date, diff: number}
      document.getElementById("payday").innerHTML = dateConverter(json.payday);
      document.getElementById("diff").innerHTML = json.diff;
    });
  });
}

function dateConverter(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year.slice(2, 4)}`;
}
