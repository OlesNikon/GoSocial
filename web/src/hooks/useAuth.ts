import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.types';
import type { AuthContextType } from '../context/AuthContext.types';

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
