import { useState, useEffect } from 'react';

export class Keys {
    static ATTENDANCE = 'attendance-record';
}

// TODO deberia usar redux-persist o similar, por factor tiempo se uso esto en reemplazo

function useLocalStorage(key, initialValue = '') {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
            window.dispatchEvent(new Event('storage')); // Dispara un evento de storage
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const item = localStorage.getItem(key);
            setStoredValue(item ? JSON.parse(item) : initialValue);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    return [storedValue, setValue];
}

export default useLocalStorage;