import { useTabs } from "@/context/TabContext"
import useLocalStorage from "@/hooks/useLocalStorage"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ReactNode } from "react"
import Split from "react-split"

function SplitterComponent({ children }: { children: ReactNode }) {
    const { isSidebarOpen } = useTabs()
    const { isMobile } = useWindowDimensions()
    const { setItem, getItem } = useLocalStorage()

    const getGutter = () => {
        const gutter = document.createElement("div")
        gutter.className = "h-full cursor-col-resize hidden md:block relative group"
        
        // Enhanced gutter styling
        gutter.style.cssText = `
            background: linear-gradient(to right, 
                rgba(55, 65, 81, 0.3) 0%, 
                rgba(20, 184, 166, 0.1) 50%, 
                rgba(55, 65, 81, 0.3) 100%
            );
            border-left: 1px solid rgba(55, 65, 81, 0.3);
            border-right: 1px solid rgba(55, 65, 81, 0.3);
            transition: all 0.2s ease;
            position: relative;
        `
        
        // Add hover effect
        gutter.addEventListener('mouseenter', () => {
            gutter.style.background = 'linear-gradient(to right, rgba(20, 184, 166, 0.2) 0%, rgba(20, 184, 166, 0.4) 50%, rgba(20, 184, 166, 0.2) 100%)'
            gutter.style.borderLeftColor = 'rgba(20, 184, 166, 0.5)'
            gutter.style.borderRightColor = 'rgba(20, 184, 166, 0.5)'
        })
        
        gutter.addEventListener('mouseleave', () => {
            gutter.style.background = 'linear-gradient(to right, rgba(55, 65, 81, 0.3) 0%, rgba(20, 184, 166, 0.1) 50%, rgba(55, 65, 81, 0.3) 100%)'
            gutter.style.borderLeftColor = 'rgba(55, 65, 81, 0.3)'
            gutter.style.borderRightColor = 'rgba(55, 65, 81, 0.3)'
        })
        
        return gutter
    }

    const getSizes = () => {
        if (isMobile || !isSidebarOpen) return [0, 100]
        const savedSizes = getItem("editorSizes")
        let sizes = [25, 75] // Better default ratio
        if (savedSizes) {
            try {
                sizes = JSON.parse(savedSizes)
            } catch {
                sizes = [25, 75]
            }
        }
        return sizes
    }

    const getMinSizes = () => {
        if (isMobile || !isSidebarOpen) return [0, 100]
        return [280, 400]
    }

    const getMaxSizes = () => {
        if (isMobile || !isSidebarOpen) return [0, Infinity]
        return [600, Infinity]
    }

    const handleGutterDrag = (sizes: number[]) => {
        setItem("editorSizes", JSON.stringify(sizes))
    }

    const getGutterStyle = () => ({
        width: "6px",
        display: isSidebarOpen && !isMobile ? "block" : "none",
        zIndex: "10",
    })

    return (
        <div className="h-screen bg-gradient-to-br from-dark-950 to-dark-900 overflow-hidden">
            <Split
                sizes={getSizes()}
                minSize={getMinSizes()}
                gutter={getGutter}
                maxSize={getMaxSizes()}
                dragInterval={1}
                direction="horizontal"
                gutterAlign="center"
                cursor="col-resize"
                snapOffset={50}
                gutterStyle={getGutterStyle}
                onDrag={handleGutterDrag}
                className="flex h-full w-full"
            >
                {children}
            </Split>
        </div>
    )
}

export default SplitterComponent
