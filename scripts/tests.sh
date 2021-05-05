# Run all frontend and backend tests

cd django_smg
source venv/bin/activate
python3 manage.py test --parallel 2

cd frontend
npm run test
