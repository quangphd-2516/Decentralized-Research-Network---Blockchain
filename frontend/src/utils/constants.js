export const API_URL = import.meta.env.VITE_API_URL;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    UPLOAD: '/upload',
    RESEARCH_LIST: '/research',
    RESEARCH_DETAIL: '/research/:id',
    PROFILE: '/profile',
};

export const CATEGORIES = [
    'Computer Science',
    'Physics',
    'Biology',
    'Chemistry',
    'Mathematics',
    'Medicine',
    'Engineering',
    'Other'
];