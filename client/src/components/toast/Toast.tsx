import { Toaster } from "react-hot-toast"

function Toast() {
    return (
        <Toaster
            position="top-right"
            gutter={12}
            containerStyle={{
                top: 20,
                right: 20,
            }}
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
                    color: '#e5e7eb',
                    border: '1px solid rgba(55, 65, 81, 0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(12px)',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '12px 16px',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    maxWidth: '400px',
                },
                success: {
                    duration: 3000,
                    style: {
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(31, 41, 55, 0.95) 100%)',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        color: '#a7f3d0',
                    },
                    iconTheme: {
                        primary: '#14b8a6',
                        secondary: '#ffffff',
                    },
                },
                error: {
                    duration: 5000,
                    style: {
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(31, 41, 55, 0.95) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                    },
                    iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                    },
                },
                loading: {
                    style: {
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(31, 41, 55, 0.95) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#93c5fd',
                    },
                    iconTheme: {
                        primary: '#3b82f6',
                        secondary: '#ffffff',
                    },
                },
            }}
        />
    )
}

export default Toast
