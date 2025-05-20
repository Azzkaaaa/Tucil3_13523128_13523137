import React from 'react'
import { Toaster } from 'sonner';

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
          <Toaster 
            position="top-center" 
            richColors 
            closeButton
            theme="light"
          />
          {children}
        </>
      );
}

export default ToastProvider