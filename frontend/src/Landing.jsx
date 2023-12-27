import {
  VStack,
  Text,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
} from "@chakra-ui/react";
import TopBar from "./TopBar";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const check = async () => {
    try {
      const res = await axios.get(`/check/${username}`);
      const status = res.data.status;
      if (status === "pending" || status === "error") {
        navigate(`/pending/${username}`);
      } else if (status === "success") {
        navigate(`/year/${username}`);
      } else {
        return false;
      }
      return true;
    } catch (e) {
      toast.error("Error checking username");
    }
  };

  const generate = async () => {
    if (username === "") {
      toast.error("Please enter a username");
      return;
    }
    setLoading(true);
    const userExists = await check();
    if (!userExists) {
      navigate(`/start-purchase?username=${username}`);
    }
    setUsername("");
    setLoading(false);
  };

  return (
    <VStack p="4" className="w-full">
      <TopBar />
      <div className="h-10" />
      <VStack className="w-full md:w-1/3">
        <Text className="w-full">
          hey, i&apos;m ivan! one of my friends created a year in review{" "}
          <a
            href="https://www.myyearinbooks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            for books
          </a>
          . i thought it would be cool to do the same for Twitter. so i did.
          here&apos;s how it works:
        </Text>
        <ol className="list-decimal w-[90%] md:w-[80%]">
          <li>make sure your Twitter account is public</li>
          <li>enter the your username below and click the button.</li>
          <li>
            if you&apos;ve already paid, you will be redirected to your
            year/status page. otherwise you will need to pay a $5 fee. this fee
            prevents spam and goes towards the cost of running the server, ai
            calls, and more.
          </li>
          <li>
            after you pay, the username will be added to the queue. depending on
            traffic, it may take some time to process. if it is taking more than
            24 hours, click the &quot;issues?&quot; button above to email me and
            i will look into it as soon as possible.
          </li>
          <li>
            check the status of your year in review here: <br />
            <span className="underline font-bold">
              {window.location.origin}/pending/USERNAME
            </span>
          </li>
          <li>
            once it is ready, you will receive an email with the link to your
            page. the email will be from myxtraordinaryyear@gmail.com (check
            spam if you don&apos;t see it).
          </li>
        </ol>
        <span className="italic">
          note that this only accounts for your past 1000 tweets, replies,
          and/or retweets.
        </span>
        <div className="h-5" />
        <InputGroup size="lg">
          <InputLeftAddon>https://twitter.com/</InputLeftAddon>
          <Input
            placeholder="twitter_handle"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </InputGroup>
        <Button
          className="w-full"
          type="submit"
          colorScheme="blue"
          onClick={generate}
          isLoading={loading}
          isDisabled={loading}
        >
          Generate for $5
        </Button>
        <div className="h-5" />
        <Text className="font-bold">Examples</Text>
        <Button
          as="a"
          href="/year/elonmusk"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          elon musk
        </Button>
        <Button
          as="a"
          href="/year/taylorswift13"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          taylor swift
        </Button>
        <Button
          as="a"
          href="/year/KingJames"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          lebron james
        </Button>
        <Button
          as="a"
          href="/year/jack"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          jack dorsey
        </Button>
        <Button
          as="a"
          href="/year/garrytan"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          garry tan
        </Button>
        <Button
          as="a"
          href="/year/pmarca"
          colorScheme="blue"
          target="_blank"
          rel="noopener noreferrer"
        >
          marc andreessen
        </Button>
        <div className="h-5" />
      </VStack>
    </VStack>
  );
}
