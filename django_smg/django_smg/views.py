from django.shortcuts import redirect
from django.views.decorators.http import require_GET


@ require_GET
def loginRedirect(request, *args, **kwargs):
    """
    I'm using the built in password reset page, this redirects the user to
    the react app after they've reset their password.
    """
    return redirect('/login', *args, **kwargs)
