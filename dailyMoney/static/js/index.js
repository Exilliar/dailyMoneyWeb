let formDisabled = false;
let advanced = false; // whether the advanced options are being used

loadFromLocal();

document.getElementById("edit-payday").addEventListener("click", () => {
  toggleHidden("payday-form");
});

document.getElementById("advanced").addEventListener("click", () => {
  toggleHidden(
    "advanced-options",
    () => (advanced = true),
    () => (advanced = false)
  );
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
    hideResults();

    const form = document.getElementById("data-form");
    const account = form.elements.account.value;
    let pending = form.elements.pending.value;
    pending = pending ? pending : 0;
    const save = form.elements.save.value;
    let accountFinal = account - pending;
    const diff = +document.getElementById("diff").innerText;

    const store = form.elements.storeSave.checked; // boolean
    if (store) {
      window.localStorage.setItem("save", save);
    }

    let spentToday;
    let posSpend;

    if (advanced) {
      spentToday = +form.elements.spentToday.value;
      if (spentToday) {
        accountFinal += spentToday;
      }

      posSpend = form.elements.posSpend.value;
    }

    let requests = [calc(accountFinal, save, diff)];
    if (posSpend && diff !== 1)
      requests.push(calc(accountFinal - posSpend - spentToday, save, diff - 1));

    Promise.all(requests).then((res) => {
      displayResults(res[0], spentToday);
      // if res[1] is truthy then posSpend can be done
      if (res[1]) {
        displayPosSpend(res[1], spentToday, res[0], posSpend);
      }
      // scroll to results
      document.getElementById("results-container").scrollIntoView({
        behavior: "smooth"
      });
    });
  }
}

function displayResults(json, spentToday) {
  document.getElementById("results").removeAttribute("hidden");
  document.getElementById("dailyVal").innerHTML = json.daily;
  if (spentToday) {
    document.getElementById("dailyLeft").innerHTML =
      "£" + (json.raw - spentToday);
    document.getElementById("dailyLeftContainer").removeAttribute("hidden");
  } else {
    document.getElementById("dailyLeft").innerHTML = "";
  }
}

function displayPosSpend(json, spentToday, dailyToday, posSpend) {
  document.getElementById("posSpendRes").removeAttribute("hidden");
  document.getElementById("posSpendVal").innerHTML = json.daily;
  if (spentToday) {
    document.getElementById("posSpendDailyLeft").innerHTML =
      "£" + (dailyToday.raw - spentToday - posSpend);
    document
      .getElementById("posSpendDailyLeftContainer")
      .removeAttribute("hidden");
  } else {
    document.getElementById("posSpendDailyLeft").innerHTML = "";
  }
}

function calc(account, save, diff) {
  // not using url matching, but that seems kinda rubbish (at least for this use case)
  return new Promise((resolve, reject) => {
    fetch(`/calc?account=${account}&save=${save}&diff=${diff}`).then((res) => {
      res.json().then((json) => {
        // json: { daily: string, raw: number }
        resolve(json);
      });
    });
  });
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

function toggleHidden(id, showFunc, hideFunc) {
  const element = document.getElementById(id);
  if (element.hasAttribute("hidden")) {
    element.removeAttribute("hidden");
    if (showFunc) showFunc();
  } else {
    element.setAttribute("hidden", true);
    if (hideFunc) hideFunc();
  }
}

function hideResults() {
  // hide everything rather than checking what might need to be hidden
  document.getElementById("dailyLeftContainer").setAttribute("hidden", true);
  document
    .getElementById("posSpendDailyLeftContainer")
    .setAttribute("hidden", true);
  document.getElementById("results").setAttribute("hidden", true);
  document.getElementById("posSpendRes").setAttribute("hidden", true);
}
