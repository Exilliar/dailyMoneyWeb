function getDaily() {
  const form = document.getElementById("data-form");
  const account = form.elements.account.value;
  let pending = form.elements.pending.value;
  pending = pending ? pending : 0;
  const save = form.elements.save.value;
  const accountFinal = account - pending;
  // not using url matching, but that seems kinda rubbish (at least for this use case)
  fetch(`/calc?account=${accountFinal}&save=${save}`).then((res) => {
    res.json().then((json) => {
      document.getElementById("results").innerHTML = result(json.daily);
    });
  });
}
