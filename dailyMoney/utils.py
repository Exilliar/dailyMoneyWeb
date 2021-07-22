import datetime
import calendar


def calcPayday(day = 15): # default day to 15, but allow for customisation
    currentDate = datetime.date.today()

    month = currentDate.month
    # inc the month by 1 if the payday for this month has already past
    month += 0 if currentDate.day < day else 1
    # if the payday month has gone to 13 (e.g. if december payday has passed
    # ) change the month to January
    month = 1 if month == 13 else month

    payday = datetime.date(currentDate.year, month, day)
    weekday = payday.weekday()

    if (weekday == 5):
        if (payday.day - 1 > 0):
            payday = payday.replace(day=payday.day-1)
        else: # if subtracting 1 from the day will move back a year
            monthrange = calendar.monthrange(currentDate.year, payday.month-1)
            payday = payday.replace(month=payday.month-1, day=monthrange[1])
    elif (weekday == 6):
        if (payday.day - 2 > 0):
            payday = payday.replace(day=payday.day-2)
        else: # if subtracting 2 from the day will move back a year
            monthrange = calendar.monthrange(currentDate.year, payday.month-1)
            day = 999 # just initialising the variable
            if (payday.day == 1):
                day = monthrange[1] - 1
            else:
                day = monthrange[1]
            payday = payday.replace(month=payday.month-1, day=day)

    return payday


def calcDiff(payday):
    currentDate = datetime.date.today()

    return (payday - currentDate).days


def calcDaily(bankaccount, save, diff):
    return "£" + str(round((bankaccount-save)/diff, 2))
