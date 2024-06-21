import "./App.css"
import { useAccount, useConnect, useWalletClient } from "wagmi"
import { tokenConfig } from "./const"
import { getContract, InternalRpcError, SwitchChainError } from "viem"
import { useEffect } from "react"
import { baseSepolia } from "viem/chains"

function App() {
  const { address, chainId } = useAccount()
  const walletClient = useWalletClient()
  const { connectAsync, connectors } = useConnect()
  const [metamask] = connectors
  const handleImport = async () => {
    try {
      if (!walletClient.data) {
        throw Error("WalletClient does not exist.")
      } else if (!address) {
        throw Error("Haven't connect.")
      }
      const tokenContract = getContract({
        address: tokenConfig.tokenAddress,
        abi: tokenConfig.tokenABI,
        client: walletClient.data,
      })
      const decimals = await tokenContract.read.decimals()
      const symbol = await tokenContract.read.symbol()

      await walletClient.data?.watchAsset({
        type: "ERC20",
        options: {
          address: address,
          symbol,
          decimals: Number(decimals),
        },
      })
      console.log("import token")
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {}, [address, chainId])

  const handleConnect = () => {
    connectAsync({
      connector: metamask,
    })
      .then((res) => {
        console.log(res.accounts)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const changeChain = async () => {
    try {
      await walletClient.data?.switchChain({
        id: baseSepolia.id,
      })

      console.log("switchChain")
    } catch (err) {
      if (
        (err as SwitchChainError).code === 4902 ||
        (err as InternalRpcError).code === -32603
      ) {
        //4902, SwitchChainError
        // -32603 'InternalRpcError'
        try {
          await walletClient.data?.addChain({
            chain: baseSepolia,
          })
          console.log("addChain")
        } catch (err) {
          alert(err)
        }
      } else {
        alert(err)
      }
    }
  }
  return (
    <>
      <div>address:{address}</div>
      <div>chainId:{chainId}</div>
      <div style={{ height: 20 }}></div>
      <button onClick={handleImport}>import to wallet</button>
      <div style={{ height: 20 }}></div>
      <button onClick={handleConnect}> Connect</button>{" "}
      <div style={{ height: 20 }}></div>
      <button onClick={changeChain}> change to {baseSepolia.name}</button>
    </>
  )
}

export default App
