from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .utils import calcPayday, calcDiff, calcDaily
from django.views.decorators.http import require_http_methods

# Create your views here.


def index(request):
    payday = calcPayday()
    diff = calcDiff(payday)
    paydayDisplay = payday.strftime(
        '%d') + "/" + payday.strftime('%m') + "/" + payday.strftime('%y')
    return render(request, 'index.html', context={
        'payday': paydayDisplay,
        'diff': diff
    })


@require_http_methods(['GET'])
def calc(request):
    account = float(request.GET['account'])
    save = float(request.GET['save'])
    diff = int(request.GET['diff'])

    daily = calcDaily(account, save, diff)

    return JsonResponse({
        'daily': "£" + str(daily),
        'raw': daily
    })


@require_http_methods(['GET'])
def payday(request):
    # IMPORTANT: day = 1 is not working for some reason
    day = int(request.GET['day'])
    payday = calcPayday(day)
    diff = calcDiff(payday)

    return JsonResponse({
        'payday': payday,
        'diff': diff
    })
