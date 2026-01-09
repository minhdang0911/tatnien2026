import './globals.css';
export const metadata = { title: "Tất niên IKY 2026" };

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
