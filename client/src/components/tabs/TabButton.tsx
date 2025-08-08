import { useChatRoom } from "@/context/ChatContext"
import { useTabs } from "@/context/TabContext"
import { TABS } from "@/types/tab"

interface TabButtonProps {
    tabName: TABS
    icon: JSX.Element
}

const TabButton = ({ tabName, icon }: TabButtonProps) => {
    const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useTabs()
    const { isNewMessage } = useChatRoom()

    const handleTabClick = (tabName: TABS) => {
        if (tabName === activeTab) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveTab(tabName)
        }
    }

    const isActive = activeTab === tabName && isSidebarOpen

    return (
        <button
            onClick={() => handleTabClick(tabName)}
            className={`group relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 ${
                isActive
                    ? 'bg-gradient-to-br from-primary-500/20 to-primary-600/30 border border-primary-500/40 text-primary-300 shadow-glow scale-105'
                    : 'bg-gray-700/30 hover:bg-gray-600/40 border border-gray-600/30 hover:border-gray-500/50 text-gray-400 hover:text-gray-200 hover:scale-105'
            }`}
            title={tabName.charAt(0).toUpperCase() + tabName.slice(1)}
        >
            {/* Icon with enhanced styling */}
            <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
                {icon}
            </div>

            {/* Active indicator */}
            {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent rounded-xl animate-pulse-soft" />
            )}

            {/* Notification Badge */}
            {tabName === TABS.CHATS && isNewMessage && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-surface-darker animate-bounce-subtle">
                        <div className="w-full h-full bg-red-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                </div>
            )}

            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-600/0 group-hover:from-primary-500/5 group-hover:to-primary-600/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
        </button>
    )
}

export default TabButton
