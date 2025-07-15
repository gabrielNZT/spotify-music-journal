# 🎨 React.js Design Guide – Spotify Music Journal

## 1. Fundamentos

- **Design Tokens:** Variáveis (cores, tipografia, espaçamentos) armazenadas em um arquivo `tokens.css` ou em um objeto JS (`designTokens.js`).
- **Atomic Design:** Dividir a UI em Átomos, Moléculas, Organismos, Templates e Páginas (Brad Frost).
- **Mobile‑First & Responsividade:** Começar estilos para telas pequenas e escalar para desktop (Brad Frost, Ethan Marcotte).

---

## 2. Paleta de Cores

Defina no CSS como variáveis CSS ou em um objeto JS:

```css
:root {
  --color-bg: #191414;
  --color-surface: #282828;
  --color-on-surface: #FFFFFF;
  --color-on-surface-subtle: #B3B3B3;

  --color-primary: #1DB954;     
  --color-primary-hover: #1ED760;
  --color-secondary: #3E3E3E;
  --color-error: #E02424;

  --color-success: #28A745;
  --color-warning: #FFC107;
  
  /* Cores oficiais do Spotify */
  --spotify-black: #000000;
  --spotify-dark-gray: #121212;
  --spotify-gray: #191414;
  --spotify-light-gray: #282828;
  --spotify-green: #1DB954;
  --spotify-white: #FFFFFF;
  --spotify-text-bright: #FFFFFF;
  --spotify-text-base: #B3B3B3;
  --spotify-text-subdued: #6A6A6A;
}
````

| Token                | Uso                          |
| -------------------- | ---------------------------- |
| `--color-bg`         | Fundo geral                  |
| `--color-surface`    | Cards, modais, menus         |
| `--color-on-surface` | Texto principal              |
| `--color-primary`    | Botões principais, destaques |
| `--color-secondary`  | Botões secundários, bordas   |

---

## 3. Tipografia

Baseado em “Modular Scale” e “Perfect Fourth” (Tim Brown).

```css
:root {
  --font-family-base: 'Inter', 'Roboto', sans-serif;
  --font-size-base: 1rem;        
  --font-size-sm: 0.875rem;       
  --font-size-lg: 1.25rem;        
  --font-size-xl: 1.5rem;         
  --line-height-base: 1.5;
}
```

| Estilo      | Fonte  | Peso | Tamanho               | Altura de Linha         |
| ----------- | ------ | ---- | --------------------- | ----------------------- |
| **H1**      | Inter  | 700  | var(--font-size-xl)   | 1.2                     |
| **H2/H3**   | Inter  | 600  | var(--font-size-lg)   | 1.3                     |
| **Body**    | Roboto | 400  | var(--font-size-base) | var(--line-height-base) |
| **Caption** | Roboto | 400  | var(--font-size-sm)   | 1.4                     |

---

## 4. Espaçamento & Layout

Use um sistema de espaçamento modular (4‑point grid):

```css
:root {
  --spacing-xxs: 4px;
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

* **Containers:** `max-width: 1200px; margin: 0 auto; padding: var(--spacing-md);`
* **Grid:** 12 colunas, gap = `var(--spacing-md)`
* **Stack:** agrupamento vertical de componentes — utilize utilitário `<Stack spacing="sm">`

---

## 5. Componentes Atômicos

### 5.1 Button

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}
```

```css
.button {
  font-family: var(--font-family-base);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.button.primary {
  background: var(--color-primary);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
}
.button.primary:hover {
  background: var(--color-primary-hover);
}
.button.secondary {
  background: var(--color-secondary);
  color: #fff;
  padding: var(--spacing-sm) var(--spacing-md);
}
```

### 5.2 Card

```tsx
interface CardProps {
  elevation?: 0 | 1 | 2;
  padding?: 'sm' | 'md' | 'lg';
}
```

```css
.card {
  background: var(--color-surface);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  overflow: hidden;
}
.card.elevation-0 { box-shadow: none; }
.card.elevation-2 { box-shadow: 0 4px 8px rgba(0,0,0,0.3); }
```

---

## 6. Componentes Compostos

### 6.1 PlaylistCard

* **Átomo:** Card + Image + Text + Button
* Props:

  * `imageUrl: string`
  * `title: string`
  * `trackCount: number`

### 6.2 TrackItem

* **Átomo:** Flex container
* Layout:

  * Thumbnail (48×48)
  * Info (Título, Artista)
  * Actions (Play, Note, Favorite)
* Interações:

  * Hover muda background para `#2A2A2A`
  * Focus ring em “Play” (acessibilidade)

---

## 7. Tokens de Ícones

* Utilize **Lucide‑React** ou **React‑Icons**.
* **Ícone Play:** `<Play size={20} />`
* **Ícone Note:** `<Edit3 size={20} />`
* **Ícone Favorite:** `<Heart size={20} />`

---

## 8. Acessibilidade & WCAG 2.1

* **Contraste:** mínimo de 4.5:1 (texto normal) e 3:1 (texto grande).
* **Focus States:** bordas ou outlines visíveis em componentes interativos.
* **ARIA:**

  * `<button aria-label="Play track">`
  * `<input aria-label="Search tracks" />`

---

## 9. Tematização & Dark Mode

* **Dark Mode** padrão.
* Para future Light Mode, duplique tokens:

```css
[data-theme="light"] {
  --color-bg: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-on-surface: #121212;
}
```

* Toggle em React: usar Context + `data-theme` no `<html>`.