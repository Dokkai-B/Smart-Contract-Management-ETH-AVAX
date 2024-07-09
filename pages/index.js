import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Input,
  Text,
  Heading,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Container,
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

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [error, setError] = useState("");

  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
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

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatEther(balance));
    }
  };

  const handleTransactionError = (err) => {
    if (err.message.includes("Insufficient balance")) {
      setError("Insufficient balance");
    } else {
      setError("Transaction failed");
    }
    onOpen();
  };

  const deposit = async () => {
    if (atm) {
      try {
        const tx = await atm.deposit({ value: ethers.utils.parseEther(amount) });
        await tx.wait();
        getBalance();
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const withdraw = async () => {
    if (atm) {
      try {
        const tx = await atm.withdraw(ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const transfer = async () => {
    if (atm) {
      try {
        const tx = await atm.transfer(recipient, ethers.utils.parseEther(amount));
        await tx.wait();
        getBalance();
      } catch (err) {
        handleTransactionError(err);
      }
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <Text>Please install Metamask in order to use this ATM.</Text>;
    }

    if (!account) {
      return <Button colorScheme="green" onClick={connectAccount}>Connect MetaMask</Button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <VStack spacing={4} align="stretch">
        <Box bg="gray.700" p={4} borderRadius="md" width="100%">
          <Text color="white">Account:</Text>
          <Text color="white" fontWeight="bold">{account}</Text>
        </Box>
        <Box bg="gray.700" p={4} borderRadius="md" width="100%">
          <Text color="white">Balance:</Text>
          <Text color="white" fontWeight="bold">{balance} ETH</Text>
        </Box>
        <FormControl>
          <FormLabel color="white">Amount</FormLabel>
          <Input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FormControl>
        <Button colorScheme="green" onClick={deposit}>Deposit</Button>
        <Button colorScheme="green" onClick={withdraw}>Withdraw</Button>
        <FormControl>
          <FormLabel color="white">Recipient Address</FormLabel>
          <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </FormControl>
        <Button colorScheme="green" onClick={transfer}>Transfer</Button>
      </VStack>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Flex bg="background" color="text" minH="100vh" align="center" justify="center" direction="column">
        <Heading as="h1" size="xl" mb={6} color="primary">Online Metacrafters Bank</Heading>
        {initUser()}
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>
            <AlertDialogBody>
              {error}
            </AlertDialogBody>
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
