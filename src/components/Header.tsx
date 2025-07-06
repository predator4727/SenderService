import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "react-icons/fa";

export default function Header() {
    return (
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">tsender</h1>
                <a
                    href="https://github.com/predator4727/SenderService"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-black transition-colors"
                    aria-label="GitHub Repository"
                >
                    <FaGithub size={24} />
                </a>
            </div>

            <div>
                <ConnectButton />
            </div>
        </header>
    );
}