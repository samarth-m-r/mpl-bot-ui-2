import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options globally
marked.use({
  breaks: true,  // Enable line breaks
  gfm: true,     // Enable GitHub Flavored Markdown
 
});

export function formatMarkdown(text: string): string {
  if (!text) return '';
  
  try {
    // Use marked.parse() with proper type handling
    const htmlContent = marked.parse(text) as string;
    
    return DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'em', 'strong', 'a', 
        'ul', 'ol', 'li', 'code', 'pre'
      ]
    });
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return text; // Return original text if parsing fails
  }
}
