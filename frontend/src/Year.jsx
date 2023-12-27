import { VStack, Box, HStack, Text, Heading, Spinner } from "@chakra-ui/react";
import { BsTwitterX, BsTwitter } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import TopBar from "./TopBar";

const getRandomPosition = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  transform: `translate(-50%, -50%)`, // Center the images at random positions
});

const BackgroundWithImages = () => {
  const array_emojis = Array(350).fill(0);
  return (
    <Box position="absolute" overflow="hidden" className="h-full w-full -z-40">
      {array_emojis.map((pos, index) => (
        <Box
          key={index}
          position="absolute"
          style={getRandomPosition()}
          className="opacity-30"
        >
          {index % 2 === 0 ? <BsTwitterX /> : <BsTwitter color="#1DA1F2" />}
        </Box>
      ))}
    </Box>
  );
};

const TweetComponent = ({ username, tweetId, emoji }) => {
  const array_emojis = Array(8).fill(0);
  const [tweetUrl, setTweetUrl] = useState();

  useEffect(() => {
    setTweetUrl(
      `https://twitter.com/${username}/status/${tweetId}?ref_src=twsrc%5Etfw`,
    );
  }, [tweetId, username]);

  if (!tweetUrl) {
    return null;
  }

  return (
    <VStack position="relative" className="w-full">
      <blockquote className="twitter-tweet">
        <a href={tweetUrl} />
      </blockquote>{" "}
      {emoji &&
        array_emojis.map((index) => (
          <Box key={index} position="absolute" style={getRandomPosition()}>
            {emoji}
          </Box>
        ))}
    </VStack>
  );
};

const XWrapper = ({ text }) => (
  <span className="inline-flex justify-center items-center">
    <BsTwitterX />
    {text}
  </span>
);

export default function Year() {
  const { username } = useParams();
  const [tw_details, setTwDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const get_details = async () => {
      try {
        const res = await axios.get(`/get/${username}`);
        const details = res.data;
        if (details.error) {
          navigate("/pending/" + username);
        } else {
          setTwDetails(details);
        }
      } catch (e) {
        toast.error("Error getting details");
      }
    };
    get_details();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VStack className="w-full md:w-screen">
      {tw_details && <BackgroundWithImages />}
      <VStack p="4" className="w-full">
        <TopBar />
        <div className="h-10" />
        {!tw_details ? (
          <VStack spacing="2" className="w-full">
            <Heading className="w-1/2 text-[#1DA1F2] text-xl text-center">
              fetching your details . . .
            </Heading>
            <div className="h-10" />
            <Spinner
              size="xl"
              thickness="5px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#1DA1F2"
            />
          </VStack>
        ) : (
          <VStack spacing="2" className="w-full">
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              here&apos;s one of the first things you said
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.first_tweet}
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              and ended it with
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.last_tweet}
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              sometimes you said a lot
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.longest_tweet}
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              sometimes you said a little
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.shortest_tweet}
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              people liked your Tweets
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.most_liked_tweet}
              emoji="❤️"
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              retweeted your messages
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.most_retweeted_tweet}
              emoji="🔁"
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              and commented on your thoughts
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.most_commented_tweet}
              emoji="💬"
            />
            <Text className="text-2xl text-white font-bold text-center bg-[#1DA1F2] p-2 rounded-md">
              now for some fun 🎉🍾🎊
            </Text>
            <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
              <span>you had some </span> <XWrapper text="treme" />{" "}
              <span>tweets</span>
            </HStack>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.gpt_tweets.extreme}
              emoji="🥵"
            />
            <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
              <span>a few </span> <XWrapper text="plosive" /> <span>ones</span>
            </HStack>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.gpt_tweets.explosive}
              emoji="💥"
            />
            <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
              <span>some that were quite </span> <XWrapper text="quisite" />
            </HStack>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.gpt_tweets.exquisite}
              emoji="✨"
            />
            <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
              <span>some more </span> <XWrapper text="pressive" />{" "}
              <span>than others </span>
            </HStack>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.gpt_tweets.expressive}
              emoji="🗣️"
            />
            <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
              <span>and finally a few </span> <XWrapper text="tradorinary" />{" "}
              <span>ones to cap off the year</span>
            </HStack>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.gpt_tweets.extraordinary}
              emoji="🚀"
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              your spirit animal for the year is
            </Text>
            <Text className="text-2xl bg-[#1DA1F2] text-white font-bold text-center underline p-4 rounded-md">
              {tw_details.tweets.gpt_tweets.spirit_animal}
            </Text>
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              here&apos;s a summary of your year
            </Text>
            <Text className="text-lg bg-[#1DA1F2] text-white p-2 rounded-lg md:w-1/2">
              {tw_details.tweets.gpt_tweets.year_summary}
            </Text>
            <div className="h-[10vh]" />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              p.s. here&apos; are something random you tweeted this year
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.random_tweet}
            />
            <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
              p.p.s. here&apos; are something random you quoted this year
            </Text>
            <TweetComponent
              username={tw_details.username}
              tweetId={tw_details.tweets.random_quoted_tweet}
            />
          </VStack>
        )}
      </VStack>
    </VStack>
  );
}
