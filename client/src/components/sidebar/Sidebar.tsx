import TabButton from "@/components/tabs/TabButton"
import PyintelLogo from "@/components/common/PyintelLogo"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useTabs } from "@/context/TabContext"
import useResponsive from "@/hooks/useResponsive"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { MessageEvent } from "@/types/socket"
import { TABS } from "@/types/tab"
import { IoCodeSlash } from "react-icons/io5"
import { MdOutlineDraw } from "react-icons/md"
import { HiX } from "react-icons/hi"

function Sidebar() {
    const {
        activeTab,
        isSidebarOpen,
        tabComponents,
        tabIcons,
        setIsSidebarOpen,
    } = useTabs()
    const { showSidebar } = useResponsive()
    const { activityState, setActivityState } = useAppContext()
    const { socket } = useSocket()
    const { isMobile } = useWindowDimensions()

    const changeState = () => {
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING)
            socket.emit(MessageEvent.REQUEST_DRAWING)
        } else {
            setActivityState(ACTIVITY_STATE.CODING)
        }

        if (isMobile) {
            setIsSidebarOpen(false)
        }
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto relative">
            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Tab Bar */}
            <div
                className={`fixed bottom-0 left-0 z-50 flex h-[60px] w-full gap-2 self-end overflow-hidden border-t border-gray-700/50 bg-surface-darker/95 backdrop-blur-lg p-3 md:static md:h-full md:w-[60px] md:min-w-[60px] md:flex-col md:border-r md:border-t-0 md:p-3 md:pt-6 transition-all duration-300 ${!showSidebar ? 'translate-y-full md:translate-y-0' : ''}`}
            >
                {/* Logo - Hidden on mobile */}
                <div className="hidden md:flex md:justify-center md:mb-4">
                    <PyintelLogo size="sm" />
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-2 md:flex-col md:gap-3 flex-1">
                    <TabButton tabName={TABS.FILES} icon={tabIcons[TABS.FILES]} />
                    <TabButton tabName={TABS.CHATS} icon={tabIcons[TABS.CHATS]} />
                    <TabButton tabName={TABS.RUN} icon={tabIcons[TABS.RUN]} />
                    <TabButton
                        tabName={TABS.CLIENTS}
                        icon={tabIcons[TABS.CLIENTS]}
                    />
                    <TabButton
                        tabName={TABS.SETTINGS}
                        icon={tabIcons[TABS.SETTINGS]}
                    />
                </div>

                {/* Activity State Toggle */}
                <div className="flex md:flex-col gap-2 md:gap-3 md:mt-auto">
                    <button 
                        onClick={changeState}
                        className="group relative p-3 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 hover:from-primary-600/20 hover:to-primary-700/20 border border-gray-600/30 hover:border-primary-500/40 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary-500/40"
                        title={activityState === ACTIVITY_STATE.CODING ? "Switch to Drawing" : "Switch to Coding"}
                    >
                        <div className="relative">
                            {activityState === ACTIVITY_STATE.CODING ? (
                                <MdOutlineDraw className="w-6 h-6 text-gray-300 group-hover:text-primary-300 transition-colors duration-200" />
                            ) : (
                                <IoCodeSlash className="w-6 h-6 text-gray-300 group-hover:text-primary-300 transition-colors duration-200" />
                            )}
                            
                            {/* Activity Indicator */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-surface-darker transition-colors duration-200 ${
                                activityState === ACTIVITY_STATE.CODING ? 'bg-primary-500' : 'bg-accent-purple'
                            }`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Sidebar Panel */}
            <div
                className={`fixed left-0 top-0 z-40 w-full h-full md:static md:w-[350px] md:h-auto flex-col bg-surface-darker/95 md:bg-surface-dark backdrop-blur-xl border-r border-gray-700/30 transition-all duration-300 ease-smooth ${
                    isSidebarOpen 
                        ? 'translate-x-0 flex' 
                        : '-translate-x-full md:translate-x-0 hidden md:flex'
                }`}
            >
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-700/30 md:hidden">
                        <h2 className="text-lg font-semibold text-white">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                            title="Close sidebar"
                        >
                            <HiX className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                )}

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {tabComponents[activeTab]}
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700/30 hidden md:block">
                    <div className="text-xs text-gray-500 text-center">
                        Code Sync v2.0
                    </div>
                </div>
            </div>

            {/* Resize Handle for Desktop */}
            <div className="hidden md:block w-1 bg-gray-700/30 hover:bg-primary-500/50 cursor-col-resize transition-colors duration-200 group">
                <div className="w-full h-full group-hover:bg-primary-500/20 transition-colors duration-200" />
            </div>
        </aside>
    )
}

export default Sidebar
