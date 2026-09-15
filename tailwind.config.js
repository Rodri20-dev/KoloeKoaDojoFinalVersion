/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.vue"],

    theme: {
        fontFamily: {
            "theme-heading": ["'Exo 2'", "sans-serif"],
            "theme-content": ["Alegreya Sans", "sans-serif"],
        },

        extend: {
            colors: {
                "theme-primary": "#C08401",
                "theme-secondary": "#C08401",
                "theme-grayish-blue": "#FFFFFF",
                "theme-dark-blue": "#000000",
                "theme-dark-blue-tp": "rgba(0, 0, 0, 0.9)",
            },
        },
    },

    plugins: [require("@tailwindcss/forms")],
};