from multiprocessing import freeze_support

import uvicorn
from dotenv import load_dotenv

load_dotenv(override=True)

host = "localhost"
port = 8000
url = "http://{}:{}".format(host, port)

if __name__ == "__main__":
    freeze_support()
    uvicorn.run("app:app", host=host, port=port, reload=True)