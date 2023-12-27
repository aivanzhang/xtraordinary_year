from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
import stripe

# stripe.api_key = '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'
stripe.api_key = 'sk_test_51ORo6nDbJuqwhaWcMRErszF9hBqitjLOAktSiVj0AOdlE0V4OvOQ85iiuhoqR6MjwWl7spjitTf9bnt9GhDK9bqq00wwzaApuN'
uri = "mongodb+srv://ivan2:Q3DitAGvTrMsCuwA@cluster0.zcfgio2.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi("1"))
db = client["xtraordinary"]  # Name of the database
# {
#     username: {
#         ...
#     }
# }
review_collection = db["reviews"]  # Name of the collection
# {
#     "username": {
#         "status": "pending" | "error" | "success",
#         "customer_id": "customer_id",
# }
# }
# }
status_collection = db["statuses"]  # Name of the collection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


YOUR_DOMAIN = "https://www.myxtraordinaryyear.com"

# check username status
@app.get("/check/{username}")
async def check_username(username: str) -> dict:
    status = status_collection.find_one({"username": username})
    if status:
        return {"status": status["status"]}
    else:
        return {"status": "not_found"}

# get username contents
@app.get("/get/{username}")
async def get_username(username: str) -> dict:
    review = review_collection.find_one({"username": username})
    if review:
        return review
    else:
        return {"error": "not_found"}


# create checkout session
@app.get("/create-checkout-session/{username}")
async def create_checkout_session(username: str):
    # NEED TO TEST THIS
    status = status_collection.find_one({"username": username})
    if status:
        if status["status"] == "pending":
            return RedirectResponse(url=YOUR_DOMAIN + '/pending/'+ username, status_code=303)
        elif status["status"] == "success":
            return RedirectResponse(url=YOUR_DOMAIN + '/year/'+ username, status_code=303)
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    # 'price': 'price_1ORoAeDbJuqwhaWcyMCiGGGd',
                    'price': 'price_1ORoHWDbJuqwhaWcbpAf9vVv',
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/pending/'+ username,
            cancel_url=YOUR_DOMAIN + '/',
            metadata={
                "username": username
            },
            customer_creation="always"
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return RedirectResponse(url=checkout_session.url, status_code=303)

endpoint_secret_test = 'whsec_41268a3fd6a6a71c851ab184f87b6a025d4d6c3f8494b525570ad971e3512334'
# endpoint_secret = 'whsec_6e20936ac9eff834f22f320766fdd4168de5fccb9359fd03dc5c2f39a83c85a0'
endpoint_secret = endpoint_secret_test

# create username pending from stripe
@app.post("/pending_user")
async def pending_user(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        print(e)
        raise HTTPException(status_code=400)
    except stripe.error.SignatureVerificationError as e:
        print(e)
        raise HTTPException(status_code=400)

    if event['type'] == 'checkout.session.completed':
        session = stripe.checkout.Session.retrieve(
            event['data']['object']['id'],
            expand=['line_items'],
        )
        username = session["metadata"]["username"]
        customer_id = session["customer"]
        status_collection.insert_one({"username": username, "status": "pending", "customer_id": customer_id})

    return Response(status_code=200)