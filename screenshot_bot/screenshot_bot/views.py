from django.shortcuts import redirect
from django.views.decorators.http import require_GET

@require_GET
def adminRedirect(request, *args, **kwargs):
    return redirect('/admin', *args, **kwargs)