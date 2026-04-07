// This layout overrides the parent management/layout.js for login page only
// It renders without sidebar/header and without auth check
export default function LoginLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh' }}>
            {children}
        </div>
    );
}
