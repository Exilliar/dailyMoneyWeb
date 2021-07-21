function result(daily) {
  return `
    <fieldset class="perDayContainer">
        <legend class="perDayTitle">Spend per day</legend>
        <div class="daily">
            ${daily}
        </div>
    </fieldset>
  `;
}
