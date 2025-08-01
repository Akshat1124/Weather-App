import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'

export const useThemedToast = () => {
  const { isDark } = useTheme()

  const showToast = (message, type = 'default') => {
    const baseStyle = {
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      backdropFilter: 'blur(12px)',
      border: '1px solid',
    }

    const lightStyle = {
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1e293b',
      borderColor: 'rgba(226, 232, 240, 0.8)',
    }

    const darkStyle = {
      background: 'rgba(30, 41, 59, 0.95)',
      color: '#e2e8f0',
      borderColor: 'rgba(71, 85, 105, 0.8)',
    }

    const style = {
      ...baseStyle,
      ...(isDark ? darkStyle : lightStyle),
    }

    switch (type) {
      case 'success':
        return toast.success(message, {
          style: {
            ...style,
            borderColor: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
            color: isDark ? '#4ade80' : '#059669',
          },
        })
      case 'error':
        return toast.error(message, {
          style: {
            ...style,
            borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
            color: isDark ? '#f87171' : '#dc2626',
          },
        })
      case 'loading':
        return toast.loading(message, { style })
      default:
        return toast(message, { style })
    }
  }

  return {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    loading: (message) => showToast(message, 'loading'),
    toast: (message) => showToast(message),
    dismiss: toast.dismiss,
  }
}
