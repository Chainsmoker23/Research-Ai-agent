
/**
 * Table Service
 * Responsible for formatting, resizing, and orienting LaTeX tables correctly.
 */

export const processLatexTables = (latexContent: string): string => {
  // Regex to find table environments
  // We look for \begin{table} ... \end{table} blocks
  const tableRegex = /\\begin\{table\}([\s\S]*?)\\end\{table\}/g;

  return latexContent.replace(tableRegex, (match, body) => {
    // 1. Analyze complexity
    const colCount = (body.match(/&/g) || []).length / (body.match(/\\\\/g) || []).length;
    const charCount = body.length;
    
    // 2. Heuristics for Sideways vs Normal
    // If > 5 columns or very dense content, use sidewaystable
    const isWide = colCount > 5 || charCount > 1000;

    // 3. Clean up existing resizeboxes or tabular definitions to standard booktabs
    let cleanBody = body
      .replace(/\\resizebox\{.*?\}\{!\}/g, '') // Remove existing resize
      .replace(/\\begin\{tabular\}\{.*?\}/, (m: string) => {
         // Replace standard l|c|r with booktabs friendly spacing if needed, 
         // but usually keeping the agent's alignment preference is safer.
         // We just ensure we wrap it later.
         return m;
      });

    // Ensure booktabs rules are used for professional look if not present
    if (!cleanBody.includes('\\toprule')) {
        cleanBody = cleanBody
            .replace(/\\hline/g, '') // Remove old hlines
            .replace(/\\begin\{tabular\}\{(.*?)\}/, '\\begin{tabular}{$1} \\toprule')
            .replace(/\\\\/, '\\\\ \\midrule') // First row gets midrule
            .replace(/\\end\{tabular\}/, '\\bottomrule \\end{tabular}');
    }

    // 4. Wrap
    if (isWide) {
        return `
\\begin{sidewaystable*}
    \\centering
    \\caption{Detailed Analysis Results}
    \\resizebox{\\textwidth}{!}{
        ${cleanBody.trim()}
    }
\\end{sidewaystable*}
        `;
    } else {
        return `
\\begin{table}[htbp]
    \\centering
    \\caption{Experimental Results}
    \\resizebox{\\columnwidth}{!}{
        ${cleanBody.trim()}
    }
\\end{table}
        `;
    }
  });
};
