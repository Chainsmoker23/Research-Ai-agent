
export const IEEE_TEMPLATE = `
\\documentclass[conference]{IEEEtran}
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{url}

\\def\\BibTeX{{\\rm B\\kern-.05em{\\sc i\\kern-.025em b}\\kern-.08em
    T\\kern-.1667em\\lower.7ex\\hbox{E}\\kern-.125emX}}

\\begin{document}

\\title{{{TITLE}}}

\\author{\\IEEEauthorblockN{{{AUTHOR_FNM}} {{AUTHOR_SUR}}}
\\IEEEauthorblockA{\\textit{{{AUTHOR_DEPT}}} \\\\
\\textit{{{AUTHOR_AFFIL}}}\\\\
{{AUTHOR_EMAIL}}}}

\\maketitle

\\begin{abstract}
{{ABSTRACT}}
\\end{abstract}

\\begin{IEEEkeywords}
{{KEYWORDS}}
\\end{IEEEkeywords}

{{BODY}}

\\section*{Acknowledgment}
{{FUNDING}}

{{BIBLIOGRAPHY}}

\\end{document}
`;
