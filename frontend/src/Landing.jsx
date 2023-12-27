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
  const [isGenerated, setIsGenerated] = useState();
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
        setIsGenerated(false);
      }
    } catch (e) {
      toast.error("Error checking username");
    }
  };

  const generate = async () => {
    if (username === "") {
      toast.error("Please enter a username");
      return;
    }
    navigate(`/start-purchase?username=${username}`);
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
            enter the your username below and check if a year in review has
            already been created for you
          </li>
          <li>
            If not you will need to pay a $5 fee. this fee prevents spam and
            goes towards the cost of running the server, ai calls, and more.
          </li>
          <li>
            after you pay, the username will be added to the queue. depending on
            traffic, it may take some time to process. if it is taking more than
            24 hours, by clicking the &quot;issues?&quot; button above, you can
            email me and i will look into it.
          </li>
          <li>
            check the status of your year in review here: <br />
            <span className="underline font-bold">
              {window.location.origin}/pending/USERNAME
            </span>
          </li>
          <li>
            sometime in January, any additional money (less costs) will be
            donated to charity (to be determined via a poll).
          </li>
        </ol>
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
        <Button className="w-full" colorScheme="blue" onClick={check}>
          Check
        </Button>
        {isGenerated !== undefined && !isGenerated && (
          <Button
            className="w-full"
            type="submit"
            colorScheme="blue"
            onClick={generate}
          >
            Generate for $5
          </Button>
        )}
      </VStack>
    </VStack>
  );
}
