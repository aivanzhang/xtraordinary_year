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
  const [email, setEmail] = useState("");
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
      try {
        await axios.post("/add_pending_user", {
          username,
          customer_email: email,
        });
        navigate(`/pending/${username}`);
      } catch (e) {
        toast.error("Error adding user");
        return;
      }
    }
    setEmail("");
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
          <li>
            enter the your username and email (optional) below and click the
            button.
          </li>
          <li>
            your username will be added to the queue. depending on traffic and
            limits, it may take some time to process.
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
          <li>
            check out your year in review here: <br />
            <span className="underline font-bold">
              {window.location.origin}/year/USERNAME
            </span>
          </li>
        </ol>
        <div>
          <span className="italic">
            note 0: if you like this project, please consider donating to a good
            cause. here are some suggestions:
            <ul className="list-disc w-full ml-5">
              <li>
                <a
                  href="https://www.stjude.org/donate/donate-to-st-jude-today.html?sc_icid=wtg-lz-donatenow&adobe_mc_sdid=SDID%3D2257728622E4B9DB-71C3C7ACFD5FB2DA%7CMCORGID%3D091B467352782E0D0A490D45%40AdobeOrg%7CTS%3D1703787163&adobe_mc_ref=https%3A%2F%2Fwww.stjude.org%2Fgive.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  St. Jude Children&apos;s Research Hospital
                </a>
              </li>
              <li>
                <a
                  href="https://give.feedingamerica.org/a/donate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Feeding America
                </a>
              </li>
              <li>
                <a
                  href="https://give.salvationarmyusa.org/give/164006/#!/donation/checkout?c_src=USN_hero&c_src2=EOYappeal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Salvation Army
                </a>
              </li>
              <li>
                <a
                  href="https://donate.code.org/give/529456/#!/donation/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Code.org
                </a>
              </li>
              <li>
                <a
                  href="https://give.girlswhocode.com/give/77372/#!/donation/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Girls Who Code
                </a>
              </li>
            </ul>
          </span>
          <br />
          <span className="italic">
            note 1: if you want to support this project, consider buying me a
            coffee{" "}
            <a
              href="https://www.buymeacoffee.com/aivanzhang"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              here!
            </a>
          </span>
          <br />
          <span className="italic">
            note 2: i might post cool stuff, consider following me on Twitter{" "}
            <a
              href="https://twitter.com/aivanzhang"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              here!
            </a>
          </span>
          <br />
          <span className="italic">
            note 3: because of rate limits, this only accounts for your last 100
            tweets, replies, and/or retweets. if you want a more complete
            version, contact me and i&apos;ll see what i can do.
          </span>
        </div>
        <div className="h-5" />
        <InputGroup size="lg">
          <InputLeftAddon>Email</InputLeftAddon>
          <Input
            placeholder="email to receive notification"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </InputGroup>
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
          Generate
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
