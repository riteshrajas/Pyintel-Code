import { useFileStore } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import { MessageEvent } from "@/types/socket"
import { useEffect, useRef, useState } from "react"
import { HiOutlineArrowPath, HiOutlineEye, HiOutlineEyeSlash, HiOutlineGlobeAlt } from "react-icons/hi2"
import toast from "react-hot-toast"

interface PreviewComponentProps {
    isVisible: boolean
    onToggle: () => void
}

function PreviewComponent({ isVisible, onToggle }: PreviewComponentProps) {
    const { currentFile } = useFileStore()
    const { socket } = useSocket()
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

    const isHtmlFile = currentFile?.name.toLowerCase().endsWith('.html') || 
                      currentFile?.name.toLowerCase().endsWith('.htm')

    const updatePreview = () => {
        if (!currentFile || !isHtmlFile || !iframeRef.current) return

        setIsLoading(true)
        
        try {
            const iframe = iframeRef.current
            const doc = iframe.contentDocument || iframe.contentWindow?.document
            
            if (doc) {
                // Clear existing content
                doc.open()
                
                // Inject the HTML content
                let htmlContent = currentFile.content
                
                // If it's not a complete HTML document, wrap it
                if (!htmlContent.includes('<!DOCTYPE') && !htmlContent.includes('<html')) {
                    htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview - ${currentFile.name}</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
        }
        .preview-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-bottom: 1px solid #e9ecef;
            padding: 10px 20px;
            font-size: 12px;
            color: #6c757d;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .preview-content {
            margin-top: 50px;
        }
    </style>
</head>
<body>
    <div class="preview-header">
        📄 Live Preview: ${currentFile.name} • Last updated: ${new Date().toLocaleTimeString()}
    </div>
    <div class="preview-content">
        ${htmlContent}
    </div>
</body>
</html>`
                }
                
                doc.write(htmlContent)
                doc.close()
                
                setLastUpdate(new Date())
                
                // Broadcast preview update to other users
                socket.emit(MessageEvent.PREVIEW_UPDATED, { 
                    fileName: currentFile.name,
                    content: htmlContent
                })
            }
        } catch (error) {
            console.error('Error updating preview:', error)
            toast.error('Failed to update preview')
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-update preview when file content changes
    useEffect(() => {
        if (isVisible && isHtmlFile && currentFile) {
            const timeoutId = setTimeout(updatePreview, 500) // Debounce updates
            return () => clearTimeout(timeoutId)
        }
    }, [currentFile?.content, isVisible, isHtmlFile])

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
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
                <HiOutlineGlobeAlt className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Preview available for HTML files</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            {/* Preview Toggle Button */}
            <button
                onClick={onToggle}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                    isVisible 
                        ? 'bg-primary-500/10 border-primary-500/30 text-primary-400 hover:bg-primary-500/20' 
                        : 'bg-gray-700/50 border-gray-600/50 text-gray-400 hover:bg-gray-700/70'
                }`}
                title={isVisible ? 'Hide Preview' : 'Show Live Preview'}
            >
                {isVisible ? (
                    <HiOutlineEyeSlash className="w-4 h-4" />
                ) : (
                    <HiOutlineEye className="w-4 h-4" />
                )}
                <span className="text-xs font-medium">
                    {isVisible ? 'Hide' : 'Preview'}
                </span>
            </button>

            {/* Refresh Button */}
            {isVisible && (
                <button
                    onClick={updatePreview}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-2 py-1.5 bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:bg-gray-700/70 rounded-lg transition-all disabled:opacity-50"
                    title="Refresh Preview"
                >
                    <HiOutlineArrowPath className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            )}

            {/* Last Update Indicator */}
            {isVisible && lastUpdate && (
                <div className="text-xs text-gray-500">
                    Updated {lastUpdate.toLocaleTimeString()}
                </div>
            )}

            {/* Hidden iframe for preview */}
            {isVisible && (
                <iframe
                    ref={iframeRef}
                    style={{ display: 'none' }}
                    title="HTML Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            )}
        </div>
    )
}

export default PreviewComponent
