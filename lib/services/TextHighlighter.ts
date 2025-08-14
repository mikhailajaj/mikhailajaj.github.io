/**
 * Text Highlighting Service
 * Phase 2: Visual feedback during text-to-speech
 */

export interface HighlightConfig {
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
  animation?: boolean;
  animationDuration?: string;
}

export interface TextSegment {
  text: string;
  startIndex: number;
  endIndex: number;
  element?: HTMLElement;
}

export class TextHighlighter {
  private currentElement: HTMLElement | null = null;
  private originalContent: string = "";
  private highlightedElements: HTMLElement[] = [];
  private config: HighlightConfig;
  private observer: MutationObserver | null = null;

  constructor(config: Partial<HighlightConfig> = {}) {
    this.config = {
      className: "accessibility-speaking",
      backgroundColor: "#ffff00",
      textColor: "#000000",
      borderRadius: "2px",
      padding: "2px 4px",
      animation: true,
      animationDuration: "0.3s",
      ...config,
    };

    this.setupStyles();
    this.setupMutationObserver();
  }

  /**
   * Set up CSS styles for highlighting
   */
  private setupStyles(): void {
    const styleId = "text-highlighter-styles";

    // Remove existing styles
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new styles
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .${this.config.className} {
        background-color: ${this.config.backgroundColor} !important;
        color: ${this.config.textColor} !important;
        border-radius: ${this.config.borderRadius} !important;
        padding: ${this.config.padding} !important;
        outline: 2px solid #ff0000 !important;
        outline-offset: 1px !important;
        position: relative !important;
        z-index: 1000 !important;
        ${
          this.config.animation
            ? `
          transition: all ${this.config.animationDuration} ease-in-out !important;
          animation: highlight-pulse ${this.config.animationDuration} ease-in-out !important;
        `
            : ""
        }
      }

      ${
        this.config.animation
          ? `
        @keyframes highlight-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
      `
          : ""
      }

      .${this.config.className}-word {
        background-color: ${this.config.backgroundColor} !important;
        color: ${this.config.textColor} !important;
        border-radius: ${this.config.borderRadius} !important;
        padding: 1px 2px !important;
        outline: 1px solid #ff0000 !important;
        ${
          this.config.animation
            ? `
          transition: all 0.2s ease-in-out !important;
        `
            : ""
        }
      }

      .${this.config.className}-sentence {
        background-color: rgba(255, 255, 0, 0.3) !important;
        border-left: 4px solid #ff0000 !important;
        padding-left: 8px !important;
        ${
          this.config.animation
            ? `
          transition: all 0.5s ease-in-out !important;
        `
            : ""
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Set up mutation observer to handle dynamic content
   */
  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          // Content changed, may need to update highlighting
          this.handleContentChange();
        }
      });
    });
  }

  /**
   * Handle content changes
   */
  private handleContentChange(): void {
    // If we're currently highlighting something, we may need to re-highlight
    if (this.currentElement && this.originalContent) {
      const currentContent = this.currentElement.textContent || "";
      if (currentContent !== this.originalContent) {
        // Content changed, remove highlighting
        this.removeHighlight();
      }
    }
  }

  /**
   * Highlight text within an element
   */
  highlightText(
    element: HTMLElement,
    startIndex: number,
    length: number,
  ): void {
    if (!element) return;

    this.removeHighlight();
    this.currentElement = element;
    this.originalContent = element.textContent || "";

    const text = this.originalContent;
    if (startIndex < 0 || startIndex >= text.length || length <= 0) {
      return;
    }

    const endIndex = Math.min(startIndex + length, text.length);
    const beforeText = text.substring(0, startIndex);
    const highlightText = text.substring(startIndex, endIndex);
    const afterText = text.substring(endIndex);

    // Create highlighted content
    const highlightSpan = document.createElement("span");
    highlightSpan.className = this.config.className!;
    highlightSpan.textContent = highlightText;
    highlightSpan.setAttribute(
      "aria-label",
      `Currently reading: ${highlightText}`,
    );

    // Replace element content
    element.innerHTML = "";

    if (beforeText) {
      element.appendChild(document.createTextNode(beforeText));
    }

    element.appendChild(highlightSpan);
    this.highlightedElements.push(highlightSpan);

    if (afterText) {
      element.appendChild(document.createTextNode(afterText));
    }

    // Scroll into view if needed
    this.scrollIntoView(highlightSpan);

    // Start observing for changes
    if (this.observer) {
      this.observer.observe(element, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
  }

  /**
   * Highlight a specific word in text
   */
  highlightWord(element: HTMLElement, wordIndex: number): void {
    if (!element) return;

    const text = element.textContent || "";
    const words = this.splitIntoWords(text);

    if (wordIndex < 0 || wordIndex >= words.length) {
      return;
    }

    const word = words[wordIndex];
    const startIndex = this.getWordStartIndex(text, words, wordIndex);

    this.highlightText(element, startIndex, word.length);
  }

  /**
   * Highlight a specific sentence in text
   */
  highlightSentence(element: HTMLElement, sentenceIndex: number): void {
    if (!element) return;

    const text = element.textContent || "";
    const sentences = this.splitIntoSentences(text);

    if (sentenceIndex < 0 || sentenceIndex >= sentences.length) {
      return;
    }

    const sentence = sentences[sentenceIndex];
    const startIndex = this.getSentenceStartIndex(
      text,
      sentences,
      sentenceIndex,
    );

    this.highlightText(element, startIndex, sentence.length);
  }

  /**
   * Highlight text by searching for it
   */
  highlightByText(
    element: HTMLElement,
    searchText: string,
    occurrence: number = 0,
  ): void {
    if (!element || !searchText) return;

    const text = element.textContent || "";
    const regex = new RegExp(this.escapeRegExp(searchText), "gi");
    const matches = Array.from(text.matchAll(regex));

    if (occurrence < 0 || occurrence >= matches.length) {
      return;
    }

    const match = matches[occurrence];
    if (match.index !== undefined) {
      this.highlightText(element, match.index, searchText.length);
    }
  }

  /**
   * Highlight multiple text segments
   */
  highlightSegments(element: HTMLElement, segments: TextSegment[]): void {
    if (!element || !segments.length) return;

    this.removeHighlight();
    this.currentElement = element;
    this.originalContent = element.textContent || "";

    // Sort segments by start index
    const sortedSegments = [...segments].sort(
      (a, b) => a.startIndex - b.startIndex,
    );

    // Build new content with highlights
    let newContent = "";
    let lastIndex = 0;

    sortedSegments.forEach((segment, index) => {
      // Add text before this segment
      if (segment.startIndex > lastIndex) {
        const beforeText = this.originalContent.substring(
          lastIndex,
          segment.startIndex,
        );
        newContent += this.escapeHtml(beforeText);
      }

      // Add highlighted segment
      const highlightClass = `${this.config.className} ${this.config.className}-segment-${index}`;
      newContent += `<span class="${highlightClass}" aria-label="Reading: ${this.escapeHtml(segment.text)}">${this.escapeHtml(segment.text)}</span>`;

      lastIndex = segment.endIndex;
    });

    // Add remaining text
    if (lastIndex < this.originalContent.length) {
      const remainingText = this.originalContent.substring(lastIndex);
      newContent += this.escapeHtml(remainingText);
    }

    // Update element content
    element.innerHTML = newContent;

    // Store highlighted elements
    this.highlightedElements = Array.from(
      element.querySelectorAll(`.${this.config.className}`),
    );

    // Scroll to first highlight
    if (this.highlightedElements.length > 0) {
      this.scrollIntoView(this.highlightedElements[0]);
    }
  }

  /**
   * Remove all highlighting
   */
  removeHighlight(): void {
    if (this.currentElement && this.originalContent) {
      this.currentElement.textContent = this.originalContent;
    }

    // Clean up highlighted elements
    this.highlightedElements.forEach((element) => {
      if (element.parentNode) {
        element.parentNode.replaceChild(
          document.createTextNode(element.textContent || ""),
          element,
        );
      }
    });

    this.highlightedElements = [];
    this.currentElement = null;
    this.originalContent = "";

    // Stop observing
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * Check if currently highlighting
   */
  isHighlighting(): boolean {
    return this.highlightedElements.length > 0;
  }

  /**
   * Get currently highlighted text
   */
  getHighlightedText(): string {
    return this.highlightedElements
      .map((element) => element.textContent || "")
      .join(" ");
  }

  /**
   * Scroll highlighted element into view
   */
  private scrollIntoView(element: HTMLElement): void {
    if (!element) return;

    // Use smooth scrolling if supported
    if ("scrollIntoView" in element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  /**
   * Split text into words
   */
  private splitIntoWords(text: string): string[] {
    return text.split(/\s+/).filter((word) => word.length > 0);
  }

  /**
   * Split text into sentences
   */
  private splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0);
  }

  /**
   * Get start index of a word in text
   */
  private getWordStartIndex(
    text: string,
    words: string[],
    wordIndex: number,
  ): number {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      const wordStart = text.indexOf(words[i], index);
      if (wordStart === -1) return -1;
      index = wordStart + words[i].length;
    }
    return text.indexOf(words[wordIndex], index);
  }

  /**
   * Get start index of a sentence in text
   */
  private getSentenceStartIndex(
    text: string,
    sentences: string[],
    sentenceIndex: number,
  ): number {
    let index = 0;
    for (let i = 0; i < sentenceIndex; i++) {
      const sentenceStart = text.indexOf(sentences[i].trim(), index);
      if (sentenceStart === -1) return -1;
      index = sentenceStart + sentences[i].length;
    }
    return text.indexOf(sentences[sentenceIndex].trim(), index);
  }

  /**
   * Escape regular expression special characters
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Update highlight configuration
   */
  updateConfig(newConfig: Partial<HighlightConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupStyles();
  }

  /**
   * Destroy the highlighter and clean up
   */
  destroy(): void {
    this.removeHighlight();

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove styles
    const styleElement = document.getElementById("text-highlighter-styles");
    if (styleElement) {
      styleElement.remove();
    }
  }
}
