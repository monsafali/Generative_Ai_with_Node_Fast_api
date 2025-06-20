go fronend
npm install
npm run dev



go backend
make .env
MONGO_URI=paste Mongo_DB_URL 

npm install
npm run dev





go ai-server
make .env
GEMINI_API_KEY=paste gemini api key
make virual invironment
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt


Run: 
uvicorn main:app --reload --port 8000



