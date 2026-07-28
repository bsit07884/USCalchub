import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <style>{`
          .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
          .btn-hover { transition: background-color 0.2s ease, transform 0.1s ease; }
          .btn-hover:hover { background-color: #1e40af; }
          .btn-hover:active { transform: scale(0.98); }
          .card-icon { transition: transform 0.3s ease; }
          .card-hover:hover .card-icon { transform: scale(1.1) rotate(-3deg); }
        `}</style>
      </Head>
      <body className="bg-white text-slate-800 font-sans antialiased flex flex-col min-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
