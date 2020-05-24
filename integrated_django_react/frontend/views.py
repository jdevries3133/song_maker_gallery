from django.shortcuts import render

def index(request, gal_ext):
    return render(request, 'frontend/index.html')