let formDisabled = false;
let advanced = false; // whether the advanced options are being used

loadFromLocal();

document.getElementById("edit-payday").addEventListener("click", () => {
  const paydayForm = document.getElementById("payday-form");
  if (paydayForm.hasAttribute("hidden")) {
    paydayForm.removeAttribute("hidden");
  } else {
    paydayForm.setAttribute("hidden", true);
  }
});

document.getElementById("advanced").addEventListener("click", () => {
  const advancedOptions = document.getElementById("advanced-options");
  if (advancedOptions.hasAttribute("hidden")) {
    advanced = true;
    advancedOptions.removeAttribute("hidden");
  } else {
    advanced = false;
    advancedOptions.setAttribute("hidden", true);
  }
});

function loadFromLocal() {
  // load save and payday from localstorage if they are present
  // save
  const save = window.localStorage.getItem("save");
  if (save !== null) {
    document.getElementById("save").value = save;
    document.getElementById("storeSave").checked = true;
  }
  // payday
  const payday = window.localStorage.getItem("day");
  if (payday !== null) {
    document.getElementById("day").value = payday;
    document.getElementById("savePayday").checked = true;
    setPayday(payday);
  }
}

function getDaily() {
  // might be possible to submit the form when the submit button is disabled
  if (!formDisabled) {
    const form = document.getElementById("data-form");
    const account = form.elements.account.value;
    let pending = form.elements.pending.value;
    pending = pending ? pending : 0;
    const save = form.elements.save.value;
    const accountFinal = account - pending;
    const diff = +document.getElementById("diff").innerText;

    const store = form.elements.storeSave.checked; // boolean
    if (store) {
      window.localStorage.setItem("save", save);
    }

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
}

function changePayday() {
  const form = document.getElementById("payday-form");
  const day = form.elements.day.value;
  const save = form.elements.savePayday.checked;
  if (save) {
    window.localStorage.setItem("day", day);
  }
  setPayday(day);
}

function setPayday(day) {
  flipDisableForm();
  fetch(`/payday?day=${day}`).then((res) => {
    res.json().then((json) => {
      // json: { payday: date, diff: number}
      document.getElementById("payday").innerHTML = dateConverter(json.payday);
      document.getElementById("diff").innerHTML = json.diff;
      flipDisableForm();
    });
  });
}

function dateConverter(date) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year.slice(2, 4)}`;
}

function flipDisableForm() {
  formDisabled = !formDisabled;
  document.getElementById("main-submit").disabled = formDisabled;
}
