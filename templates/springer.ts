
export const SPRINGER_TEMPLATE = `
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{left=2.5cm,right=2.5cm,top=2.5cm,bottom=2.5cm}
\\usepackage{authblk}
\\usepackage{graphicx}
\\usepackage{amsmath,amssymb}
\\usepackage{cite}
\\usepackage{hyperref}
\\usepackage{mathptmx} 
\\usepackage{url}
\\usepackage{booktabs}
\\usepackage{rotating}
\\usepackage{array}

\\title{\\textbf{{{TITLE}}}}
\\author[1]{{{AUTHOR_FNM}} {{AUTHOR_SUR}}}
\\affil[1]{{{AUTHOR_DEPT}}, {{AUTHOR_AFFIL}} \\\\ \\texttt{{{AUTHOR_EMAIL}}}}
\\date{}

\\begin{document}

\\maketitle

\\begin{abstract}
\\noindent
{{ABSTRACT}}
\\end{abstract}

\\vspace{1em}
\\noindent\\textbf{Keywords:} {{KEYWORDS}}
\\vspace{1em}

{{BODY}}

\\section*{Declarations}
\\textbf{Funding:} {{FUNDING}}

{{BIBLIOGRAPHY}}

\\end{document}
`;
