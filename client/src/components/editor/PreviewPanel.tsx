import { useFileStore } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import { MessageEvent } from "@/types/socket"
import { useEffect, useRef, useState } from "react"
import { HiOutlineArrowPath, HiOutlineXMark, HiOutlineGlobeAlt } from "react-icons/hi2"
import toast from "react-hot-toast"

interface PreviewPanelProps {
    onClose: () => void
}

function PreviewPanel({ onClose }: PreviewPanelProps) {
    const { currentFile } = useFileStore()
    const { socket } = useSocket()
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)

    const isHtmlFile = currentFile?.name.toLowerCase().endsWith('.html') || 
                      currentFile?.name.toLowerCase().endsWith('.htm')

    const updatePreview = () => {
        if (!currentFile || !isHtmlFile || !iframeRef.current) return

        setIsLoading(true)
        setError(null)
        
        try {
            const iframe = iframeRef.current
            const doc = iframe.contentDocument || iframe.contentWindow?.document
            
            if (doc) {
                // Clear existing content
                doc.open()
                
                // Inject the HTML content
                let htmlContent = currentFile.content.trim()
                
                // If it's not a complete HTML document, wrap it
                if (!htmlContent.includes('<!DOCTYPE') && !htmlContent.includes('<html')) {
                    htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview - ${currentFile.name}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #ffffff;
        }
        .preview-badge {
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        .preview-content {
            position: relative;
        }
    </style>
</head>
<body>
    <div class="preview-badge">
        🚀 Live Preview • ${new Date().toLocaleTimeString()}
    </div>
    <div class="preview-content">
        ${htmlContent}
    </div>
</body>
</html>`
                } else {
                    // For complete HTML documents, inject our preview badge
                    if (htmlContent.includes('</body>')) {
                        const badgeHtml = `
    <div style="position: fixed; top: 10px; right: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; backdrop-filter: blur(10px);">
        🚀 Live Preview • ${new Date().toLocaleTimeString()}
    </div>`
                        htmlContent = htmlContent.replace('</body>', `${badgeHtml}</body>`)
                    }
                }
                
                doc.write(htmlContent)
                doc.close()
                
                setLastUpdate(new Date())
                
                // Broadcast preview update to other users
                socket.emit(MessageEvent.PREVIEW_UPDATED, { 
                    fileName: currentFile.name,
                    content: htmlContent
                })
                
                toast.success('Preview updated!', { duration: 1000 })
            }
        } catch (error) {
            console.error('Error updating preview:', error)
            setError('Failed to update preview. Check your HTML syntax.')
            toast.error('Failed to update preview')
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-update preview when file content changes
    useEffect(() => {
        if (isHtmlFile && currentFile) {
            const timeoutId = setTimeout(updatePreview, 1000) // Debounce updates
            return () => clearTimeout(timeoutId)
        }
    }, [currentFile?.content, isHtmlFile])

    // Initial load
    useEffect(() => {
        if (isHtmlFile && currentFile) {
            updatePreview()
        }
    }, [])

    // Listen for preview updates from other users
    useEffect(() => {
        const handlePreviewUpdate = ({ fileName, content }: { fileName: string, content: string }) => {
            if (currentFile?.name === fileName && iframeRef.current) {
                const iframe = iframeRef.current
                const doc = iframe.contentDocument || iframe.contentWindow?.document
                
                if (doc) {
                    doc.open()
                    doc.write(content)
                    doc.close()
                    setLastUpdate(new Date())
                }
            }
        }

        socket.on(MessageEvent.PREVIEW_UPDATED, handlePreviewUpdate)
        return () => {
            socket.off(MessageEvent.PREVIEW_UPDATED, handlePreviewUpdate)
        }
    }, [socket, currentFile?.name])

    if (!isHtmlFile) {
        return (
            <div className="h-full flex flex-col bg-surface-dark border-l border-gray-700/30">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-surface-dark/80 backdrop-blur-sm border-b border-gray-700/30">
                    <div className="flex items-center gap-2">
                        <HiOutlineGlobeAlt className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Live Preview</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                    >
                        <HiOutlineXMark className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <HiOutlineGlobeAlt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Preview is only available for HTML files</p>
                        <p className="text-xs mt-2 opacity-75">Create or open an .html file to see live preview</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-700/30">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary-500/10 rounded-lg border border-primary-500/20">
                            <HiOutlineGlobeAlt className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Live Preview</h3>
                            <p className="text-xs text-gray-500">
                                {currentFile?.name} {lastUpdate && `• Updated ${lastUpdate.toLocaleTimeString()}`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Refresh Button */}
                    <button
                        onClick={updatePreview}
                        disabled={isLoading}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all disabled:opacity-50 text-xs"
                        title="Refresh Preview"
                    >
                        <HiOutlineArrowPath className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <HiOutlineXMark className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 relative overflow-hidden">
                {error ? (
                    <div className="h-full flex items-center justify-center bg-red-50">
                        <div className="text-center text-red-600">
                            <p className="text-sm font-medium">Preview Error</p>
                            <p className="text-xs mt-1">{error}</p>
                            <button
                                onClick={updatePreview}
                                className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        title="HTML Live Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border">
                            <HiOutlineArrowPath className="w-4 h-4 animate-spin text-primary-500" />
                            <span className="text-sm text-gray-600">Updating preview...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PreviewPanel
