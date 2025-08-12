import { useState } from "react"

interface PyintelLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'full' | 'icon' | 'text'
    className?: string
    animated?: boolean
}

const PyintelLogo = ({ 
    size = 'md', 
    variant = 'full', 
    className = '',
    animated = true 
}: PyintelLogoProps) => {
    const [isHovered, setIsHovered] = useState(false)

    const sizeClasses = {
        sm: { container: 'h-8', text: 'text-lg', icon: 'w-6 h-6' },
        md: { container: 'h-12', text: 'text-2xl', icon: 'w-8 h-8' },
        lg: { container: 'h-16', text: 'text-3xl', icon: 'w-12 h-12' },
        xl: { container: 'h-20', text: 'text-4xl', icon: 'w-16 h-16' }
    }

    const sizes = sizeClasses[size]

    const LogoIcon = () => (
        <div 
            className={`${sizes.icon} relative flex items-center justify-center ${animated ? 'transition-all duration-300' : ''} ${isHovered && animated ? 'scale-110 rotate-12' : ''}`}
        >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30 rounded-xl blur-md opacity-75"></div>
            
            {/* Main Icon Container */}
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-1.5 shadow-lg">
                {/* Python-inspired Snake */}
                <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                    <path
                        fill="currentColor"
                        d="M12 2C8 2 6 4 6 7v3h6v1H5c-2 0-4 1-4 4s2 4 4 4h2v-2c0-2 2-4 4-4h6c2 0 3-1 3-3V7c0-3-2-5-5-5h-3zm-2 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                    />
                    <path
                        fill="currentColor"
                        d="M12 22c4 0 6-2 6-5v-3h-6v-1h7c2 0 4-1 4-4s-2-4-4-4h-2v2c0 2-2 4-4 4H7c-2 0-3 1-3 3v3c0 3 2 5 5 5h3zm2-3a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
                        opacity="0.7"
                    />
                </svg>
            </div>
        </div>
    )

   
    return (
        <div 
            className={`${sizes.container} flex items-center gap-3 ${className} ${animated ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {(variant === 'full' || variant === 'icon') && <LogoIcon />}
            {/* Animated Particles */}
            {animated && isHovered && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-ping"
                            style={{
                                top: `${30 + i * 20}%`,
                                left: `${20 + i * 30}%`,
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: '1s'
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default PyintelLogo
