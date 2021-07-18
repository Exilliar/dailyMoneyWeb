import datetime


def calcPayday():
    currentDate = datetime.date.today()

    month = currentDate.month
    # inc the month by 1 if the payday for this month has already past
    month += 0 if currentDate.day < 15 else 1
    # if the payday month has gone to 13 (e.g. if december payday has passed
    # ) change the month to January
    month = 1 if month == 13 else month

    payday = datetime.date(currentDate.year, month, 15)
    weekday = payday.weekday()

    if (weekday == 5):
        payday = payday.replace(day=payday.day-1)
    elif (weekday == 6):
        payday = payday.replace(day=payday.day-2)

    return payday


def calcDiff(payday):
    currentDate = datetime.date.today()

    return (payday - currentDate).days


def calcDaily(bankaccount, save, diff):
    return "£" + str(round((bankaccount-save)/diff, 2))
