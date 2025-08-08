import { useAppContext } from "@/context/AppContext"
import { useFileStore } from "@/context/FileContext"
import { ACTIVITY_STATE } from "@/types/app"
import DrawingEditor from "../drawing/DrawingEditor"
import Editor from "./Editor"
import PyintelLogo from "../common/PyintelLogo"
import { HiOutlineDocumentText, HiOutlinePaintBrush } from "react-icons/hi2"

function EditorComponent() {
    const { currentFile } = useFileStore()
    const { activityState } = useAppContext()

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_40%,transparent_110%)]"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-md mx-auto px-6">
                {/* Logo */}
                <div className="mb-8">
                    <PyintelLogo size="lg" variant="full" animated={true} />
                </div>

                {/* Icon */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-xl animate-pulse-soft"></div>
                        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-full border border-gray-700/50">
                            {activityState === ACTIVITY_STATE.DRAWING ? (
                                <HiOutlinePaintBrush className="w-12 h-12 text-secondary-400" />
                            ) : (
                                <HiOutlineDocumentText className="w-12 h-12 text-primary-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">
                        {activityState === ACTIVITY_STATE.DRAWING 
                            ? "Ready to Draw" 
                            : "Ready to Code"
                        }
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                        {activityState === ACTIVITY_STATE.DRAWING 
                            ? "Start sketching ideas and collaborate visually with your team."
                            : "Select a file from the sidebar to start coding, or create a new file to begin your project."
                        }
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-sm text-gray-300">
                        💡 Tip: Use Ctrl+N to create a new file
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface-dark">
            {activityState === ACTIVITY_STATE.DRAWING ? (
                <div className="flex-1 relative">
                    <DrawingEditor />
                </div>
            ) : currentFile !== null ? (
                <div className="flex-1 relative">
                    <Editor />
                </div>
            ) : (
                <EmptyState />
            )}
        </div>
    )
}

export default EditorComponent
