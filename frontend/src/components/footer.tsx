import React from 'react';

// css in '../index.css'.
export default function Footer() {
    const start = 2020;
    const current = new Date().getFullYear();
    const text = (current > start)? start + '-' + current: start;
    const site = 'Masquerade';

    return (
        <footer>
            Copyright {site} {text} test version.
        </footer>
    );
}
