import React, { useEffect, useRef } from "react";
import { renderAsync } from "docx-preview";

interface DocxPreviewProps {
  buffer: ArrayBuffer;
  mode?: 'fullscreen' | 'card';
}

const DocxPreview: React.FC<DocxPreviewProps> = ({ buffer, mode = 'fullscreen' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!buffer || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const styleId = 'docx-preview-enhanced-style';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .docx-wrapper {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: ${mode === 'card' ? '11px' : '13px'};
        color: #2c3e50;
        line-height: 1.5;
        background: #ffffff;
        padding: ${mode === 'card' ? '8px' : '15px'};
        border-radius: 8px;
        width: 100%;
        box-sizing: border-box;
      }

      .docx-wrapper section {
        padding: ${mode === 'card' ? '20px 25px' : '25px 35px'};
        background: #ffffff;
        margin: 0 auto;
        width: 100%;
        max-width: ${mode === 'card' ? '100%' : '900px'};
        box-sizing: border-box;
        border: none;
        border-radius: 0;
        box-shadow: none;
        min-height: ${mode === 'card' ? '240px' : 'auto'};
        position: relative;
        overflow-wrap: break-word;
        word-break: normal;
      }

      .docx-wrapper p {
        margin: 0 0 12px 0;
        line-height: 1.6;
        text-align: left;
        color: #1a1a1a;
        word-wrap: break-word;
        hyphens: none;
        font-size: inherit;
        text-indent: 0;
        white-space: normal;
        overflow-wrap: break-word;
      }

      .docx-wrapper h1, .docx-wrapper h2, .docx-wrapper h3,
      .docx-wrapper h4, .docx-wrapper h5, .docx-wrapper h6 {
        color: #1a1a1a;
        font-weight: 700;
        margin: 20px 0 12px 0;
        line-height: 1.3;
        text-align: left;
      }

      .docx-wrapper h1 {
        font-size: ${mode === 'card' ? '16px' : '20px'};
        border-bottom: 2px solid #3498db;
        padding-bottom: 5px;
      }
      .docx-wrapper h2 {
        font-size: ${mode === 'card' ? '14px' : '18px'};
        color: #2980b9;
      }
      .docx-wrapper h3 {
        font-size: ${mode === 'card' ? '13px' : '16px'};
        color: #34495e;
      }

      .docx-wrapper strong, .docx-wrapper b {
        font-weight: 600;
        color: #2c3e50;
      }

      .docx-wrapper em, .docx-wrapper i {
        font-style: italic;
        color: #5d6d7e;
      }

      .docx-wrapper ul, .docx-wrapper ol {
        margin: 10px 0;
        padding-left: 25px;
      }

      .docx-wrapper li {
        margin: 5px 0;
        line-height: 1.6;
      }

      .docx-wrapper table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        font-size: ${mode === 'card' ? '11px' : '13px'};
      }

      .docx-wrapper td, .docx-wrapper th {
        border: 1px solid #bdc3c7;
        padding: 8px 12px;
        text-align: left;
      }

      .docx-wrapper th {
        background-color: #ecf0f1;
        font-weight: 600;
        color: #2c3e50;
      }

      .docx-wrapper img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 10px auto;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Styles pour améliorer la lisibilité */
      .docx-wrapper .text-center { text-align: center; }
      .docx-wrapper .text-right { text-align: right; }
      .docx-wrapper .text-left { text-align: left; }

      /* Amélioration des contrastes pour la lisibilité */
      .docx-wrapper [style*="color"] {
        filter: contrast(1.2);
      }

      /* Responsive pour le mode card */
      ${mode === 'card' ? `
        .docx-wrapper {
          font-size: 10px;
        }
        .docx-wrapper section {
          padding: 12px 16px;
          transform: none;
        }
        .docx-wrapper p {
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .docx-wrapper h1, .docx-wrapper h2, .docx-wrapper h3 {
          margin: 12px 0 8px 0;
        }
      ` : ''}

      /* Correction pour les éléments mal formatés */
      .docx-wrapper * {
        max-width: 100%;
        box-sizing: border-box;
      }

      .docx-wrapper [style*="font-size"] {
        font-size: inherit !important;
      }

      .docx-wrapper [style*="color: rgb(128, 128, 128)"] {
        color: #1a1a1a !important;
      }

      /* Forcer un affichage correct du texte */
      .docx-wrapper span, .docx-wrapper div {
        display: inline;
        white-space: normal;
      }

      .docx-wrapper p span {
        line-height: inherit;
      }

      /* Éviter les coupures de mots étranges */
      .docx-wrapper {
        word-break: normal;
        overflow-wrap: anywhere;
        hyphens: none;
      }
    `;
    document.head.appendChild(style);

    renderAsync(buffer, containerRef.current, null, {
      inWrapper: true,
      className: "docx-wrapper",
      ignoreWidth: true,
      ignoreHeight: true,
      breakPages: false,
      experimental: true,
      useBase64URL: false,
      renderHeaders: true,
      renderFooters: false,
      renderFootnotes: true,
      renderEndnotes: false,
      trimXmlDeclaration: true,
    }).then(() => {
      const wrapper = containerRef.current;
      if (!wrapper) return;

      const allTextElements = wrapper.querySelectorAll('p, span, div, td, th, li, h1, h2, h3, h4, h5, h6');
      allTextElements.forEach((element) => {
        const el = element as HTMLElement;
        el.style.fontSize = '';
        el.style.color = '';
        el.style.whiteSpace = '';
        el.style.wordBreak = '';

        if (el.tagName.match(/^H[1-6]$/)) {
          el.style.color = '#1a1a1a';
          el.style.fontWeight = '700';
        } else {
          el.style.color = '#1a1a1a';
        }

        if (el.tagName === 'SPAN' && el.parentElement?.tagName === 'P') {
          el.style.display = 'inline';
          el.style.whiteSpace = 'normal';
        }

        const computedStyle = window.getComputedStyle(el);
        const fontSize = parseFloat(computedStyle.fontSize);
        if (fontSize < (mode === 'card' ? 9 : 11)) {
          el.style.fontSize = mode === 'card' ? '11px' : '13px';
        }
      });

      const emptyElements = wrapper.querySelectorAll('p:empty, div:empty, span:empty');
      emptyElements.forEach(el => el.remove());

      if (mode === 'card') {
        const sections = wrapper.querySelectorAll('.docx-wrapper > section');
        sections.forEach((section, index) => {
          if (index > 0) section.remove();
        });

        const firstSection = wrapper.querySelector('.docx-wrapper > section') as HTMLElement;
        if (firstSection) {
          firstSection.style.maxHeight = '240px';
          firstSection.style.overflowY = 'auto';
          firstSection.style.overflowX = 'hidden';
          firstSection.style.paddingRight = '10px';

          const scrollbarStyle = `
            .docx-wrapper section::-webkit-scrollbar {
              width: 6px;
            }
            .docx-wrapper section::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .docx-wrapper section::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 3px;
            }
            .docx-wrapper section::-webkit-scrollbar-thumb:hover {
              background: #a8a8a8;
            }
          `;

          if (!document.getElementById('docx-scrollbar-style')) {
            const scrollStyle = document.createElement('style');
            scrollStyle.id = 'docx-scrollbar-style';
            scrollStyle.innerHTML = scrollbarStyle;
            document.head.appendChild(scrollStyle);
          }

          const allElements = firstSection.querySelectorAll('*');
          allElements.forEach((element) => {
            const el = element as HTMLElement;
            el.style.wordBreak = 'normal';
            el.style.overflowWrap = 'break-word';
            el.style.whiteSpace = 'normal';

            if (['SPAN', 'DIV', 'P'].includes(el.tagName)) {
              el.style.display = 'inline';
              el.style.whiteSpace = 'normal';
              el.style.wordBreak = 'normal';
              el.style.overflowWrap = 'break-word';
            }
            const pTags = wrapper.querySelectorAll('p');
            pTags.forEach(p => {
              const content = p.textContent?.trim() || '';
              if (content.length <= 3 && p.nextElementSibling?.tagName === 'P') {
                const next = p.nextElementSibling as HTMLElement;
                next.innerHTML = `${p.innerHTML} ${next.innerHTML}`;
                p.remove();
              }
            });

          });
        }
      }
    }).catch((error) => {
      console.error('Erreur lors du rendu du document:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            color: #e74c3c;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <h3>Erreur de chargement</h3>
              <p>Impossible d'afficher le document DOCX</p>
            </div>
          </div>
        `;
      }
    });
  }, [buffer, mode]);

  return (
    <div
      style={{
        width: "100%",
        height: mode === 'fullscreen' ? '100vh' : '280px',
        overflowY: mode === 'card' ? "hidden" : "auto",
        overflowX: "hidden",
        border: mode === 'card' ? '1px solid #d1d5db' : '1px solid #e5e7eb',
        borderRadius: mode === 'card' ? '8px' : '6px',
        background: '#ffffff',
        boxShadow: mode === 'card'
          ? '0 2px 8px rgba(0, 0, 0, 0.1)'
          : '0 1px 4px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "100%",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default DocxPreview;
