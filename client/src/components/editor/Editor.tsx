import { useAppContext } from "@/context/AppContext"
import { useFileStore } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import { editorThemes } from "@/resources/Themes"
import { File } from "@/types/file"
import { MessageEvent } from "@/types/socket"
import placeholder from "@/utils/editorPlaceholder"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, { ViewUpdate, scrollPastEnd } from "@uiw/react-codemirror"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import PyintelLogo from "../common/PyintelLogo"
import { HiOutlineCode, HiOutlineEye } from "react-icons/hi"
import { HiOutlineEyeSlash } from "react-icons/hi2"
import PreviewPanel from "./PreviewPanel"
import Split from "react-split"

function Editor() {
    const { users, currentUser } = useAppContext()
    const { currentFile, setCurrentFile } = useFileStore()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const [showPreview, setShowPreview] = useState(false)
    
    const filteredUsers = users.filter(
        (u) => u.username !== currentUser.username,
    )

    const isHtmlFile = currentFile?.name.toLowerCase().endsWith('.html') || 
                      currentFile?.name.toLowerCase().endsWith('.htm')

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!currentFile) return

        const file: File = { ...currentFile, content: code }
        setCurrentFile(file)
        socket.emit(MessageEvent.FILE_UPDATED, { file })
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(MessageEvent.TYPING_START, { cursorPosition })

        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(MessageEvent.TYPING_PAUSE),
            1000,
        )
        setTimeOut(newTimeOut)
    }

    // Listen wheel event to zoom in/out and prevent page reload
    usePageEvents()

    const getExtensions = useMemo(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }
        return extensions
    }, [language, currentFile?.name])

    return (
        <div className="h-full flex bg-surface-dark">
            {showPreview && isHtmlFile ? (
                <Split
                    sizes={[50, 50]}
                    minSize={[300, 300]}
                    direction="horizontal"
                    className="flex h-full w-full"
                    gutterStyle={() => ({
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        cursor: 'col-resize',
                        width: '4px',
                    })}
                >
                    {/* Editor Section */}
                    <div className="flex flex-col bg-surface-dark h-full">
                        {/* Editor Header (Sticky) */}
                        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-surface-dark/80 backdrop-blur-sm border-b border-gray-700/30 relative z-10">
                            <div className="flex items-center gap-3">
                                {/* File Icon */}
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                                        <HiOutlineCode className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white">
                                            {currentFile?.name || "Untitled"}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {language} • {currentFile?.content?.length || 0} characters
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center gap-3">
                                {/* HTML Preview Button */}
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20"
                                    title="Hide Live Preview"
                                >
                                    <HiOutlineEyeSlash className="w-4 h-4" />
                                    Hide Preview
                                </button>

                                {/* Active Users */}
                                {filteredUsers.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {filteredUsers.slice(0, 3).map((user) => (
                                                <div
                                                    key={user.username}
                                                    className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-2 border-surface-dark flex items-center justify-center text-xs font-medium text-white"
                                                    title={user.username}
                                                >
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                            ))}
                                            {filteredUsers.length > 3 && (
                                                <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-surface-dark flex items-center justify-center text-xs font-medium text-white">
                                                    +{filteredUsers.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {filteredUsers.length} collaborator{filteredUsers.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}

                                {/* Theme & Font Size */}
                                <div className="text-xs text-gray-500">
                                    {theme} • {fontSize}px
                                </div>

                                {/* Pyintel Logo */}
                                <PyintelLogo size="sm" variant="icon" animated={false} />
                            </div>
                        </div>

                        {/* Editor Container (Scrollable) */}
                        <div className="flex-1 relative overflow-hidden">
                            {/* Background Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
                            
                            {/* CodeMirror Editor */}
                            <div className="relative z-10 h-full">
                                <CodeMirror
                                    placeholder={placeholder(currentFile?.name || "")}
                                    theme={editorThemes[theme]}
                                    onChange={onCodeChange}
                                    value={currentFile?.content}
                                    extensions={getExtensions}
                                    height="100%"
                                    width="100%"
                                    style={{
                                        fontSize: fontSize + "px",
                                        height: "100%",
                                    }}
                                    basicSetup={{
                                        lineNumbers: true,
                                        foldGutter: true,
                                        dropCursor: false,
                                        allowMultipleSelections: false,
                                    }}
                                />
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                                {/* Connection Status */}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark/90 backdrop-blur-sm border border-gray-700/30 rounded-lg">
                                    <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                                    <span className="text-xs text-gray-400">Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Preview Panel */}
                    <div className="h-full">
                        <PreviewPanel onClose={() => setShowPreview(false)} />
                    </div>
                </Split>
            ) : (
                /* Single Editor View */
                <div className="flex flex-col bg-surface-dark h-full w-full">
                    {/* Editor Header (Sticky) */}
                    <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-surface-dark/80 backdrop-blur-sm border-b border-gray-700/30 relative z-10">
                        <div className="flex items-center gap-3">
                            {/* File Icon */}
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                                    <HiOutlineCode className="w-4 h-4 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white">
                                        {currentFile?.name || "Untitled"}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        {language} • {currentFile?.content?.length || 0} characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex items-center gap-3">
                            {/* HTML Preview Button */}
                            {isHtmlFile && (
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700/70"
                                    title="Show Live Preview"
                                >
                                    <HiOutlineEye className="w-4 h-4" />
                                    Live Preview
                                </button>
                            )}

                            {/* Active Users */}
                            {filteredUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {filteredUsers.slice(0, 3).map((user) => (
                                            <div
                                                key={user.username}
                                                className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full border-2 border-surface-dark flex items-center justify-center text-xs font-medium text-white"
                                                title={user.username}
                                            >
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        ))}
                                        {filteredUsers.length > 3 && (
                                            <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-surface-dark flex items-center justify-center text-xs font-medium text-white">
                                                +{filteredUsers.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {filteredUsers.length} collaborator{filteredUsers.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}

                            {/* Theme & Font Size */}
                            <div className="text-xs text-gray-500">
                                {theme} • {fontSize}px
                            </div>

                            {/* Pyintel Logo */}
                            <PyintelLogo size="sm" variant="icon" animated={false} />
                        </div>
                    </div>

                    {/* Editor Container (Scrollable) */}
                    <div className="flex-1 relative overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
                        
                        {/* CodeMirror Editor */}
                        <div className="relative z-10 h-full">
                            <CodeMirror
                                placeholder={placeholder(currentFile?.name || "")}
                                theme={editorThemes[theme]}
                                onChange={onCodeChange}
                                value={currentFile?.content}
                                extensions={getExtensions}
                                height="100%"
                                width="100%"
                                style={{
                                    fontSize: fontSize + "px",
                                    height: "100%",
                                }}
                                basicSetup={{
                                    lineNumbers: true,
                                    foldGutter: true,
                                    dropCursor: false,
                                    allowMultipleSelections: false,
                                }}
                            />
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none">
                            {/* Connection Status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-dark/90 backdrop-blur-sm border border-gray-700/30 rounded-lg">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft"></div>
                                <span className="text-xs text-gray-400">Connected</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Editor
