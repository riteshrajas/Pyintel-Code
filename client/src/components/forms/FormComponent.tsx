import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { MessageEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { HiOutlineSparkles, HiOutlineUsers, HiOutlineKey, HiOutlineArrowRight } from "react-icons/hi2"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()
    const [isLoading, setIsLoading] = useState(false)
    const [formErrors, setFormErrors] = useState<{ username?: string; roomId?: string }>({})

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const roomIdRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        const newRoomId = uuidv4()
        setCurrentUser({ ...currentUser, roomId: newRoomId })
        toast.success("✨ Created a new Room ID!")
        usernameRef.current?.focus()
        
        // Clear room ID error if it exists
        if (formErrors.roomId) {
            setFormErrors(prev => ({ ...prev, roomId: undefined }))
        }
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
        
        // Clear errors as user types
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const validateForm = () => {
        const errors: { username?: string; roomId?: string } = {}
        
        if (currentUser.username.length === 0) {
            errors.username = "Username is required"
        } else if (currentUser.username.length < 3) {
            errors.username = "Username must be at least 3 characters"
        } else if (currentUser.username.length > 20) {
            errors.username = "Username must be less than 20 characters"
        }
        
        if (currentUser.roomId.length === 0) {
            errors.roomId = "Room ID is required"
        } else if (currentUser.roomId.length < 5) {
            errors.roomId = "Room ID must be at least 5 characters"
        }
        
        setFormErrors(errors)
        
        if (Object.keys(errors).length > 0) {
            // Focus first field with error
            if (errors.roomId) roomIdRef.current?.focus()
            else if (errors.username) usernameRef.current?.focus()
            return false
        }
        
        return true
    }

    const joinRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN || isLoading) return
        if (!validateForm()) return
        
        setIsLoading(true)
        const loadingToast = toast.loading("🚀 Joining room...")
        
        try {
            setStatus(USER_STATUS.ATTEMPTING_JOIN)
            socket.emit(MessageEvent.JOIN_REQUEST, currentUser)
        } catch (error) {
            toast.error("Failed to join room. Please try again.")
            setIsLoading(false)
            setStatus(USER_STATUS.DISCONNECTED)
        }
        
        toast.dismiss(loadingToast)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("✅ Room ID loaded! Enter your username to continue.")
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            const username = currentUser.username
            sessionStorage.setItem("redirect", "true")
            setIsLoading(false)
            toast.success("🎉 Welcome to the room!")
            navigate(`/editor/${currentUser.roomId}`, {
                state: { username },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
            setIsLoading(false)
        }
        
        if (status === USER_STATUS.CONNECTION_FAILED) {
            setIsLoading(false)
            toast.error("Failed to connect. Please check your connection.")
        }
    }, [currentUser, location.state?.redirect, navigate, socket, status])

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
                    <HiOutlineSparkles className="w-4 h-4" />
                    Real-time Collaboration
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Join the Session
                </h2>
                <p className="text-gray-400 text-lg">
                    Start coding together in seconds
                </p>
            </div>

            {/* Form Card */}
            <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-purple/20 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                
                {/* Form Container */}
                <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                    <form onSubmit={joinRoom} className="space-y-6">
                        {/* Room ID Input */}
                        <div className="space-y-2">
                            <label htmlFor="roomId" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <HiOutlineKey className="w-4 h-4 text-primary-400" />
                                Room ID
                            </label>
                            <div className="relative">
                                <input
                                    ref={roomIdRef}
                                    type="text"
                                    name="roomId"
                                    id="roomId"
                                    placeholder="Enter room ID or generate one"
                                    className={`input-primary ${formErrors.roomId ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                                    onChange={handleInputChanges}
                                    value={currentUser.roomId}
                                    autoComplete="off"
                                />
                                {formErrors.roomId && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                            {formErrors.roomId && (
                                <p className="text-error text-sm flex items-center gap-1 animate-fade-in-down">
                                    <span className="w-1 h-1 bg-error rounded-full"></span>
                                    {formErrors.roomId}
                                </p>
                            )}
                        </div>

                        {/* Username Input */}
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <HiOutlineUsers className="w-4 h-4 text-primary-400" />
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    ref={usernameRef}
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Choose your username"
                                    className={`input-primary ${formErrors.username ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                                    onChange={handleInputChanges}
                                    value={currentUser.username}
                                    autoComplete="username"
                                />
                                {formErrors.username && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                            {formErrors.username && (
                                <p className="text-error text-sm flex items-center gap-1 animate-fade-in-down">
                                    <span className="w-1 h-1 bg-error rounded-full"></span>
                                    {formErrors.username}
                                </p>
                            )}
                        </div>

                        {/* Join Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Joining...
                                    </>
                                ) : (
                                    <>
                                        Join Room
                                        <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                        </button>

                        {/* Generate Room ID Button */}
                        <div className="text-center pt-4 border-t border-gray-700/30">
                            <button
                                type="button"
                                onClick={createNewRoomId}
                                disabled={isLoading}
                                className="text-primary-400 hover:text-primary-300 text-sm font-medium underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto group"
                            >
                                <HiOutlineSparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                                Generate Unique Room ID
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                {[
                    { icon: "⚡", text: "Instant Sync" },
                    { icon: "🔒", text: "Secure" },
                    { icon: "💬", text: "Chat" },
                    { icon: "🎨", text: "Themes" }
                ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <span className="text-lg">{feature.icon}</span>
                        {feature.text}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FormComponent
