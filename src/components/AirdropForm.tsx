"use client"
import { InputForm } from "@/components/ui/InputField";
import { useMemo, useState } from "react";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amounts, setAmounts] = useState("");
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const { data: hash, isPending, writeContractAsync } = useWriteContract()

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address is found, please a supported chain");
            return 0;
        }
        // read from the chain if amount is approved
        // allowance
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`],
        })
        return response as number;
    }

    async function handleSubmit() {
        // 1a. if already approved, send our tokens
        // 1b. if not approved, approve the tSender contract to send our tokens
        // 2. call the airdrop function on the tSender contract
        // 3. Wait for the transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        console.log("tSender Address:", tSenderAddress);
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        console.log("Approved Amount:", approvedAmount);
        if (approvedAmount < total) {
            // approve the tSender contract to send our tokens
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            })
            console.log("Approval Receipt:", approvalReceipt);

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            },)

        }
    }

    return (
        <div>
            <InputForm
                label="Token Address"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputForm
                label="Recipients"
                placeholder="0x..., 0x... ..."
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                large={true}
            />
            <InputForm
                label="Amount"
                placeholder="100...200...300"
                value={amounts}
                onChange={(e) => setAmounts(e.target.value)}
                large={true}
            />
            <button
                onClick={handleSubmit}
                className="
                        px-6 py-3 mt-3
                        bg-gradient-to-r from-blue-500 to-indigo-600
                        text-white font-medium rounded-lg
                        shadow-md hover:shadow-lg
                        transform hover:-translate-y-0.5 transition duration-150 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        active:scale-[0.98] active:bg-indigo-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                "
            >
                Send tokens
            </button>
        </div>
    )
}