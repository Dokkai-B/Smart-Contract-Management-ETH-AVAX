import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import guessingGameArtifact from "../artifacts/contracts/Assessment.sol/GuessingGame.json";
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Input,
  Text,
  Heading,
  VStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  extendTheme,
} from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#1DB954", // Spotify green
    background: "#191414", // Spotify dark background
    text: "#FFFFFF", // White text
  },
});

const contractAddress = "0xA303374bda3A6Ce7550514E6681228Ca12020BBA"; // Replace with your deployed contract address
const guessingGameAbi = guessingGameArtifact.abi;

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [game, setGame] = useState(undefined);
  const [difficulty, setDifficulty] = useState(1);
  const [betAmount, setBetAmount] = useState(0.5);
  const [guess, setGuess] = useState(1);
  const [maxGuessRange, setMaxGuessRange] = useState(10);
  const [message, setMessage] = useState("");
  const [revealedNumber, setRevealedNumber] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [error, setError] = useState("");

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      console.log("Ethereum wallet found");
    } else {
      console.log("Ethereum wallet not found");
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account && account.length > 0) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getGameContract();
  };

  const getGameContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(contractAddress, guessingGameAbi, signer);

    setGame(gameContract);
    console.log("Game contract set");
  };

  const setGameDifficulty = async () => {
    if (!difficulty) {
      setMessage("Please set a difficulty level.");
      return;
    }

    if (game) {
      try {
        const tx = await game.setDifficulty(difficulty);
        await tx.wait();

        if (difficulty === 1) {
          setMaxGuessRange(10);
          setBetAmount(0.5);
        } else if (difficulty === 2) {
          setMaxGuessRange(50);
          setBetAmount(2);
        } else if (difficulty === 3) {
          setMaxGuessRange(100);
          setBetAmount(5);
        }

        setMessage("Difficulty set successfully!");
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const placeBet = async () => {
    if (game) {
      try {
        const minBet = getMinBet();
        const maxBet = getMaxBet();
        if (betAmount < minBet || betAmount > maxBet) {
          setMessage(`Bet amount must be between ${minBet} and ${maxBet} ETH for the current difficulty.`);
          return;
        }

        const tx = await game.placeBet(guess, {
          value: ethers.utils.parseEther(betAmount.toString()),
          gasLimit: 3000000 // Set a higher gas limit
        });
        const receipt = await tx.wait();

        const event = receipt.events.find(event => event.event === "BetPlaced");
        if (event) {
          const { args } = event;
          const won = args.won;
          setMessage(won ? "You won!" : "You lost. Try again!");
          updateUserBalance(); // Ensure this is called after the bet is placed
        } else {
          setMessage("Bet placed but no event found.");
        }

        console.log("Bet placed");
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  // Uncomment the following function to add the revealNumber functionality
  const revealNumber = async () => {
    if (game) {
      try {
        const number = await game.revealNumber();
        setRevealedNumber(number.toString());
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const updateUserBalance = async () => {
    if (game && account) {
      try {
        const balance = await game.balances(account);
        console.log("Raw Balance:", balance.toString()); // Log the raw balance
        setUserBalance(ethers.utils.formatEther(balance));
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const handleTransactionError = (err) => {
    setError("Transaction failed: " + err.message);
    console.error("Transaction error: ", err);
    onOpen();
  };

  useEffect(() => {
    getWallet();
  }, []);

  useEffect(() => {
    if (account) {
      getGameContract();
      updateUserBalance();
    }
  }, [account]);

  const getMinBet = () => {
    if (difficulty === 1) return 0.5;
    if (difficulty === 2) return 2;
    if (difficulty === 3) return 5;
    return 0.5;
  };

  const getMaxBet = () => {
    if (difficulty === 1) return 2;
    if (difficulty === 2) return 5;
    if (difficulty === 3) return 10;
    return 2;
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex bg="background" color="text" minH="100vh" align="center" justify="center" direction="column">
        <Heading as="h1" size="xl" mb={6} color="primary">Guessing Game</Heading>
        <Box bg="gray.700" p={4} borderRadius="md" width="100%" maxWidth="400px">
          <Text color="white">Account: {account}</Text>
          <Text color="white">Net Balance: {userBalance} ETH</Text>
          <FormControl mt={4}>
            <FormLabel color="white">Difficulty Level</FormLabel>
            <Slider
              defaultValue={1}
              min={1}
              max={3}
              step={1}
              onChange={(val) => setDifficulty(val)}
              mb={10}
            >
              <SliderMark value={1} mt="2" ml="-2.5" fontSize="sm">
                Easy
              </SliderMark>
              <SliderMark value={2} mt="2" ml="-3" fontSize="sm">
                Medium
              </SliderMark>
              <SliderMark value={3} mt="2" ml="-2.5" fontSize="sm">
                Hard
              </SliderMark>
              <SliderTrack bg="red.100">
                <SliderFilledTrack bg="tomato" />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="tomato" />
              </SliderThumb>
            </Slider>
            <Text color="white" mt={2}>Bet Range: {getMinBet()} - {getMaxBet()} ETH</Text>
            <Button colorScheme="green" onClick={setGameDifficulty} width="100%" mt={2}>Set Difficulty</Button>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color="white">Bet Amount (ETH)</FormLabel>
            <Input
              placeholder="Bet Amount"
              type="number"
              value={betAmount}
              min={getMinBet()}
              max={getMaxBet()}
              onChange={(e) => setBetAmount(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color="white">Guess (1-{maxGuessRange})</FormLabel>
            <Input placeholder="Guess" value={guess} onChange={(e) => setGuess(e.target.value)} max={maxGuessRange} />
          </FormControl>
          <Button colorScheme="green" onClick={placeBet} width="100%" mt={4}>Place Bet</Button>
          {/* Uncomment the following button to add the revealNumber functionality */}
          <Button colorScheme="blue" onClick={revealNumber} width="100%" mt={4}>Reveal Number</Button>
          {message && <Text color="white" mt={4}>{message}</Text>}
          {revealedNumber && <Text color="white" mt={4}>Secret Number: {revealedNumber}</Text>}
        </Box>
      </Flex>
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>{error}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ChakraProvider>
  );
}
