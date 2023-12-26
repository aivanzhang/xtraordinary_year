import { VStack, Box, HStack, Text } from "@chakra-ui/react";
import { BsTwitterX, BsTwitter } from "react-icons/bs";
import { useEffect, useState } from "react";

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

const TweetComponent = ({ tweetId, emoji }) => {
  const array_emojis = Array(8).fill(0);
  const [tweetUrl, setTweetUrl] = useState();

  useEffect(() => {
    setTweetUrl(
      `https://twitter.com/SpaceX/status/${tweetId}?ref_src=twsrc%5Etfw`,
    );
  }, [tweetId]);

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
  const tw_details = {
    longest_tweet: "1659576309432090625",
    shortest_tweet: "1661329935167033346",
    most_liked_tweet: "1620466730572349442",
    most_retweeted_tweet: "1659576309432090625",
    most_commented_tweet: "1659576309432090625",
    first_tweet: "1619418820984340481",
    last_tweet: "1666616416307646465",
    random_tweet: "1666616416307646465",
    random_quoted_tweet: "1619418820984340481",
    gpt_tweets: {
      extreme: "1620466730572349442",
      explosive: "1659576309432090625",
      exquisite: "1625224820786094080",
      expressive: "1633223640110989315",
      extraordinary: "1661418376038871040",
      spirit_animal: "inspiring eagle",
      year_summary:
        "Throughout the year, you've shared your amazement and gratitude in various moments. From being in awe of incredible storytelling to expressing gratitude and best wishes, you've also shared excitement for rocketry achievements. Your spirit animal for the year is an inspiring eagle, a creature known for its majesty and formidable presence in nature.",
    },
  };

  return (
    <VStack className="w-full md:w-screen">
      <BackgroundWithImages />
      <VStack p="4" className="w-full">
        <HStack className="text-3xl font-bold text-[#1DA1F2]">
          <span>my</span>
          <span className="inline-flex justify-center items-center">
            <XWrapper text="traordinary" />
          </span>
          <span> year </span>
        </HStack>
        <div className="h-10" />
        <VStack spacing="2" className="w-full">
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            you started your year with a tweet
          </Text>
          <TweetComponent tweetId={tw_details.first_tweet} />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            and ended it with
          </Text>
          <TweetComponent tweetId={tw_details.last_tweet} />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            sometimes you said a lot
          </Text>
          <TweetComponent tweetId={tw_details.longest_tweet} />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            sometimes you said a little
          </Text>
          <TweetComponent tweetId={tw_details.shortest_tweet} />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            people liked your Tweets
          </Text>
          <TweetComponent tweetId={tw_details.most_liked_tweet} emoji="❤️" />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            retweeted your messages
          </Text>
          <TweetComponent
            tweetId={tw_details.most_retweeted_tweet}
            emoji="🔁"
          />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            and commented on your thoughts
          </Text>
          <TweetComponent
            tweetId={tw_details.most_commented_tweet}
            emoji="💬"
          />
          <Text className="text-2xl text-white font-bold text-center bg-[#1DA1F2] p-2 rounded-md">
            now for some fun 🎉🍾🎊
          </Text>
          <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
            <span>you had some </span> <XWrapper text="treme" />{" "}
            <span>tweets</span>
          </HStack>
          <TweetComponent tweetId={tw_details.gpt_tweets.extreme} emoji="🥵" />
          <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
            <span>a few </span> <XWrapper text="plosive" /> <span>ones</span>
          </HStack>
          <TweetComponent
            tweetId={tw_details.gpt_tweets.explosive}
            emoji="💥"
          />
          <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
            <span>some that were quite </span> <XWrapper text="quisite" />
          </HStack>
          <TweetComponent
            tweetId={tw_details.gpt_tweets.exquisite}
            emoji="✨"
          />
          <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
            <span>some more </span> <XWrapper text="pressive" />{" "}
            <span>than others </span>
          </HStack>
          <TweetComponent
            tweetId={tw_details.gpt_tweets.expressive}
            emoji="🗣️"
          />
          <HStack className="text-2xl text-[#1DA1F2] font-bold text-center">
            <span>and finally a few </span> <XWrapper text="tradorinary" />{" "}
            <span>ones to cap off the year</span>
          </HStack>
          <TweetComponent
            tweetId={tw_details.gpt_tweets.extraordinary}
            emoji="🚀"
          />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            your spirit animal for the year is
          </Text>
          <Text className="text-2xl bg-[#1DA1F2] text-white font-bold text-center underline p-4 rounded-md">
            {tw_details.gpt_tweets.spirit_animal}
          </Text>
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            here&apos;s a summary of your year
          </Text>
          <Text className="text-lg bg-[#1DA1F2] text-white p-2 rounded-lg md:w-1/2">
            {tw_details.gpt_tweets.year_summary}
          </Text>
          <div className="h-[10vh]" />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            p.s. here&apos; are something random you tweeted this year
          </Text>
          <TweetComponent tweetId={tw_details.random_tweet} />
          <Text className="text-2xl text-[#1DA1F2] font-bold text-center">
            p.p.s. here&apos; are something random you quoted this year
          </Text>
          <TweetComponent tweetId={tw_details.random_quoted_tweet} />
        </VStack>
      </VStack>
    </VStack>
  );
}
