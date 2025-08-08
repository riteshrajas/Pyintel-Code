import { useNavigate } from "react-router-dom"
import { HiOutlineWifi, HiOutlineHome, HiOutlineRefresh } from "react-icons/hi"
import { useState, useEffect } from "react"

function ConnectionStatusPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_110%)]"></div>

            <div className="relative z-10 flex h-screen min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
                <ConnectionError />
            </div>
        </div>
    )
}

const ConnectionError = () => {
    const navigate = useNavigate()
    const [dots, setDots] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".")
        }, 500)
        return () => clearInterval(interval)
    }, [])

    const reloadPage = () => {
        window.location.reload()
    }

    const gotoHomePage = () => {
        navigate("/")
    }

    return (
        <div className="max-w-md mx-auto">
            {/* Icon with Animation */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse-soft"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-full border border-gray-700/50">
                    <HiOutlineWifi className="w-12 h-12 text-red-400 animate-bounce-subtle" />
                </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Connection Lost
                </h1>
                <p className="text-gray-400 text-lg mb-2">
                    Oops! Something went wrong
                </p>
                <p className="text-gray-500 text-sm">
                    Attempting to reconnect{dots}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={reloadPage}
                    className="group btn-primary flex items-center justify-center gap-2 min-w-[140px]"
                >
                    <HiOutlineRefresh className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    Try Again
                </button>
                <button
                    onClick={gotoHomePage}
                    className="btn-secondary flex items-center justify-center gap-2 min-w-[140px]"
                >
                    <HiOutlineHome className="w-4 h-4" />
                    Go Home
                </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-gray-800/30 border border-gray-700/30 rounded-xl backdrop-blur-sm">
                <p className="text-gray-400 text-sm">
                    <strong className="text-gray-300">Troubleshooting:</strong>
                </p>
                <ul className="text-gray-500 text-xs mt-2 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Refresh the page</li>
                    <li>• Try creating a new room</li>
                </ul>
            </div>
        </div>
    )
}

export default ConnectionStatusPage
