from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.views.decorators.http import require_GET

@require_GET
def robots(request, *args, **kwargs):
    lines = [
        # Hello :)
        'User-agent: *',
        'Disallow: /admin',
        'Sitemap: https://songmakergallery.com/sitemap.xml',
    ]
    return HttpResponse('\n'.join(lines), content_type="text/plain")

@require_GET
def sitemap(request, *args, **kwargs):
    return render(request, 'sitemap.xml')

@require_GET
def loginRedirect(request, *args, **kwargs):
    return redirect('https://songmakergallery.com/login', *args, **kwargs)