interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    color?: 'primary' | 'secondary' | 'white' | 'gray'
    text?: string
    className?: string
}

const LoadingSpinner = ({ 
    size = 'md', 
    color = 'primary', 
    text, 
    className = '' 
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    }

    const colorClasses = {
        primary: 'border-primary-500',
        secondary: 'border-secondary-500',
        white: 'border-white',
        gray: 'border-gray-400'
    }

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            {/* Spinner */}
            <div className="relative">
                {/* Outer ring */}
                <div className={`
                    ${sizeClasses[size]} 
                    rounded-full 
                    border-2 
                    border-gray-700/30 
                    animate-spin
                `}>
                    {/* Inner spinning gradient */}
                    <div className={`
                        absolute inset-0 
                        rounded-full 
                        border-2 
                        border-transparent 
                        border-t-current
                        ${colorClasses[color]}
                        animate-spin
                    `} />
                </div>
                
                {/* Center dot */}
                <div className={`
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    w-1 h-1 
                    ${color === 'primary' ? 'bg-primary-500' : 
                      color === 'secondary' ? 'bg-secondary-500' :
                      color === 'white' ? 'bg-white' : 'bg-gray-400'}
                    rounded-full 
                    animate-pulse-soft
                `} />
            </div>
            
            {/* Loading Text */}
            {text && (
                <p className="text-sm text-gray-400 font-medium animate-pulse-soft">
                    {text}
                </p>
            )}
        </div>
    )
}

export default LoadingSpinner
