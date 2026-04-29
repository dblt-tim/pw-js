"use client"

import '@/app/styles/components/footer.css'

export default function Footer() {
    return (
        <footer id="footer">
            <span>
                <p>© {new Date().getFullYear()} GamMap. Tous droits réservés.</p>
            </span>
        </footer>
    );
}