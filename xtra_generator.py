from ntscraper import Nitter
import re
from datetime import datetime
import random
import time
from dotenv import load_dotenv
from openai import OpenAI
import json
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from email.message import Message
import smtplib

load_dotenv()
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

client = OpenAI()

scraper = Nitter(log_level=1, skip_instance_check=False)

YOUR_DOMAIN = "https://www.myxtraordinaryyear.com"

def send_email(url, to_email):
    WRAPPED_EMAIL = "myxtraordinaryyear@gmail.com"
    SMTP_USER = "myxtraordinaryyear@gmail.com"
    SMTP_PASS = "kouw fqwy anxa chtz"
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    if (
        not SMTP_USER
        or not SMTP_PASS
        or not SMTP_SERVER
        or not SMTP_PORT
        or not WRAPPED_EMAIL
    ):
        print(
            "SMTP_USER, SMTP_PASS, SMTP_SERVER, and SMTP_PORT must be set in the environment in order to send emails."
        )
        return

    msg = Message()
    msg["From"] = WRAPPED_EMAIL
    msg["To"] = to_email
    msg["Subject"] = "here's your xtraordinary year!"
    msg.add_header("Content-Type", "text/html")
    msg.set_payload("See your xtraordinary year here: " + "<a href='" + url + "'>" + url + "</a>")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(WRAPPED_EMAIL, [to_email], msg.as_string())


def get_user_tweets(user):
    max_retries = 5
    retries = 0

    while retries < max_retries:
        try:
            random_instance = scraper.get_random_instance()
            tweets = scraper.get_tweets(user, number=1000, max_retries=10, mode='user', since="2023-01-01", instance=random_instance)
            returned_tweets = tweets["tweets"]
            if len(returned_tweets) == 0:
                raise Exception("No tweets returned")
            return returned_tweets
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            retries += 1
            time.sleep(1)  # Wait for 1 second before retrying
    if retries == max_retries:
        print("Using self-hosted instance")
        tweets = scraper.get_tweets(user, mode='user', since="2023-01-01", instance="http://34.207.197.35/")
    return tweets["tweets"]

def get_status_id(url):
    match = re.search(r'/status/(\d+)', url)
    if match:
        return match.group(1)
    else:
        return None

def distill_tweet(tweet):
    tweet_id = get_status_id(tweet['link'])
    tweet_text = tweet['text']
    tweet_user = tweet['user']['username']
    tweet_likes = tweet['stats']['likes']
    tweet_retweets = tweet['stats']['retweets']
    tweet_comments = tweet['stats']['comments']
    tweet_quotes = tweet['stats']['quotes']
    date_format = '%b %d, %Y · %I:%M %p %Z'
    date = datetime.strptime(tweet['date'], date_format)
    quoted = tweet['quoted-post']
    
    return {
        'id': tweet_id,
        'text': tweet_text,
        'user': tweet_user,
        'likes': tweet_likes,
        'retweets': tweet_retweets,
        'comments': tweet_comments,
        'quotes': tweet_quotes,
        'date': date,
        'quoted': quoted
    }

def get_gpt_tweets(tweets):
    preprompt = """
    The following is a formatted roundup of a user's tweets for the past year. Each tweet is contained with <|tweet|> and <|/tweet|>. Each tweet has an id within <|id|> and <|/id> and text within <|text|> and <|/text|>.
    From this list of tweets can you find the user's most extreme, explosive, exquisite, expressive, and extraordinary tweet of the year. Based off all the user's tweets, determine a user's spirit animal with an adjective followed by the animal (i.e. productive panda).
    Also generate a cute, casual, interesting, and funny one paragraph summary of the user's year based off their tweets and address the user with pronouns like "you". Finally output JSON in the following format:
    {
        "extreme": tweet_id,
        "explosive": tweet_id,
        "exquisite": tweet_id,
        "expressive": tweet_id,
        "extraordinary": tweet_id,
        "spirit_animal": adjective animal_name,
        "year_summary": text
    }
    Make sure the tweet_id are the tweet ids from tweets above. It has to be correct and accurate. 
    Make sure the spirit animal is not a number nor id.
    """

    formatted_tweets = "\n".join( ["<|tweet|><|id|>" + tweet['id']+  "<|/id|>" + "<|text|>" + tweet['text'] +  "<|/text|><|/tweet|>" for tweet in tweets])
    sys_prompt = "You are curator of tweets and you are trying to find a user's best and most interesting tweets of the year. You want to find the best tweets that will be remembered for years to come."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user", "content": preprompt + formatted_tweets},
        ],
        response_format={ "type": "json_object" },
    )
    notable_tweets = response.choices[0].message.content;
    notable_tweets = json.loads(notable_tweets)
    notable_tweets = {str(key): str(value) for key, value in notable_tweets.items()}
    return notable_tweets

def get_user_wrapped_tweets(user):
    tweets = get_user_tweets(user)
    distilled_tweets = [distill_tweet(tweet) for tweet in tweets]
    if len(distilled_tweets) == 0:
        return None

    quoted_tweets = []
    for tweet in distilled_tweets:
        if tweet['quoted']:
            quoted_tweets.append(tweet)

    longest_tweet = max(distilled_tweets, key=lambda x: len(x['text']))
    shortest_tweet = min(distilled_tweets, key=lambda x: len(x['text']))



    most_liked_tweet = max(distilled_tweets, key=lambda x: x['likes'])
    distilled_tweets = [tweet for tweet in distilled_tweets if tweet['id'] != most_liked_tweet['id']]

    most_retweeted_tweet = max(distilled_tweets, key=lambda x: x['retweets'])
    distilled_tweets = [tweet for tweet in distilled_tweets if tweet['id'] != most_retweeted_tweet['id']]

    most_commented_tweet = max(distilled_tweets, key=lambda x: x['comments'])
    distilled_tweets = [tweet for tweet in distilled_tweets if tweet['id'] != most_commented_tweet['id']]

    first_tweet = min(distilled_tweets, key=lambda x: x['date'])
    last_tweet = max(distilled_tweets, key=lambda x: x['date'])

    num_rand_distilled_tweets = 1 if len(distilled_tweets) > 1 else len(distilled_tweets)
    random_tweets = random.sample(distilled_tweets, num_rand_distilled_tweets)

    num_random_quoted_tweets = 1 if len(quoted_tweets) > 1 else len(quoted_tweets)
    random_quoted_tweets = random.sample(quoted_tweets, num_random_quoted_tweets)

    top_tweets = sorted(distilled_tweets, key=lambda x: x['likes'], reverse=True)[:25]
    remaining_tweets = [tweet for tweet in distilled_tweets if tweet not in top_tweets]
    num_remaining_tweets = 25 if len(remaining_tweets) > 25 else len(remaining_tweets)
    random_gpt_tweets = random.sample(remaining_tweets, num_remaining_tweets)
    gpt_tweets = top_tweets + random_gpt_tweets

    for tweet in gpt_tweets:
        tweet['text'] = tweet['text'][:300]

    gpt_tweet_ids = get_gpt_tweets(gpt_tweets)

    return {
        'longest_tweet': str(longest_tweet['id']),
        'shortest_tweet': str(shortest_tweet['id']),
        'most_liked_tweet': str(most_liked_tweet['id']),
        'most_retweeted_tweet': str(most_retweeted_tweet['id']),
        'most_commented_tweet': str(most_commented_tweet['id']),
        'first_tweet': str(first_tweet['id']),
        'last_tweet': str(last_tweet['id']),
        'random_tweet': str(random_tweets[0]['id']) if len(random_tweets) > 0 else None,
        'random_quoted_tweet': str(random_quoted_tweets[0]['id']) if len(random_quoted_tweets) > 0 else None,
        'gpt_tweets': gpt_tweet_ids
    }

def get_pending_username():
    return status_collection.find_one(
        {'status': 'pending'},
        sort=[('created_at', 1)]
    )

def create_wrapped_from_collection():
    status = get_pending_username()

    while status is not None:
        username = status['username']
        print("Creating wrapped for " + username)
        generation_status = ""
        user_tweets = get_user_wrapped_tweets(username)
        if user_tweets is None:
            status_collection.update_one(
                {'username': username},
                {'$set': {'status': 'error'}}
            )
            generation_status = "error"
        else:
            status_collection.update_one(
                {'username': username},
                {'$set': {'status': 'success'}}
            )
            generation_status = "success"
            review_collection.insert_one({
                'username': username,
                'tweets': user_tweets
            })
            # Check if email is in the status collection, then send email
            user_email = status_collection.find_one(
                {'username': username},
                {'email': 1}
            )
            if user_email:
                send_email(YOUR_DOMAIN + '/year/' + username, user_email['email'])
        print("Finished creating wrapped for " + username + " with status " + generation_status)
        time.sleep(random.randint(1, 10))
        status = get_pending_username()

while True:
    create_wrapped_from_collection()
    print("No pending usernames, sleeping for a minute")
    time.sleep(60)