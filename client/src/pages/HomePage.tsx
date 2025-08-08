import illustration from "@/assets/illustration.png"
import FormComponent from "@/components/forms/FormComponent"
import PyintelLogo from "@/components/common/PyintelLogo"
import { useEffect, useState } from "react"

function HomePage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/10 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_110%)]"></div>

            {/* Content */}
            <div className={`relative z-10 flex min-h-screen flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Header Section */}

                <div className="text-center mb-16 px-4" style={{ marginTop: '100px' }}>
                    <div className="flex justify-center mb-8">
                        <PyintelLogo size="xl" variant="full" animated={true} />
                    </div>
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-down">
                        <span className="gradient-text">Code</span>
                        <span className="text-white mx-4">Sync</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                        Real-time collaborative coding powered by Python intelligence. Code together, learn together.
                    </p>
                    
                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {[
                            '🚀 Real-time Collaboration',
                            '💬 Integrated Chat',
                            '🎨 Multiple Themes',
                            '📱 Mobile Responsive'
                        ].map((feature, index) => (
                            <span 
                                key={index}
                                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                            >
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Illustration Section */}
                        <div className="flex justify-center lg:justify-end order-2 lg:order-1">
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-accent-purple/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-300 opacity-50 group-hover:opacity-75"></div>
                                
                                {/* Image Container */}
                                <div className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 group-hover:scale-105">
                                    <img
                                        src={illustration}
                                        alt="Code Sync Collaborative Coding Illustration"
                                        className="w-full max-w-md mx-auto animate-float drop-shadow-2xl"
                                        style={{ filter: 'drop-shadow(0 20px 40px rgba(20, 184, 166, 0.3))' }}
                                    />
                                    
                                    {/* Floating Elements */}
                                    <div className="absolute top-4 right-4 w-3 h-3 bg-success rounded-full animate-pulse-soft"></div>
                                    <div className="absolute bottom-8 left-6 w-2 h-2 bg-primary-400 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
                                    <div className="absolute top-1/3 left-2 w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="flex justify-center lg:justify-start order-1 lg:order-2">
                            <div className="w-full max-w-md">
                                <FormComponent />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
              

                {/* Call to Action */}
                <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                        Start coding together in seconds. No signup required.
                    </p>
                </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none"></div>
        </div>
    )
}

export default HomePage
