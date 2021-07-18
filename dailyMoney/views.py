from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .utils import calcPayday, calcDiff, calcDaily
from django.views.decorators.http import require_http_methods

# Create your views here.


def index(request):
    payday = calcPayday()
    diff = calcDiff(payday)
    return render(request, 'index.html', context={
        'payday': payday,
        'diff': diff
    })


@require_http_methods(['GET'])
def calc(request):
    account = float(request.GET['account'])
    save = float(request.GET['save'])
    payday = calcPayday()
    diff = calcDiff(payday)

    daily = calcDaily(account, save, diff)

    return JsonResponse({
        'daily': daily
    })
