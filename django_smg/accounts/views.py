from django.shortcuts import render

def pw_reset_placeholder(request):
    return render(request, 'reset.html')
