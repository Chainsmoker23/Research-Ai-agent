import { Reference } from '../types';

const OPENALEX_API = "https://api.openalex.org/works";
const SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1/paper";
const CROSSREF_API = "https://api.crossref.org/works";

// Helper to reconstruct abstract from OpenAlex inverted index
const reconstructAbstract = (invertedIndex: any): string => {
  if (!invertedIndex) return "";
  const words: { word: string; index: number }[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    (positions as number[]).forEach(pos => words.push({ word, index: pos }));
  }
  return words.sort((a, b) => a.index - b.index).map(w => w.word).join(" ");
};

// Helper to clean DOI
const cleanDOI = (doi: string | undefined): string | null => {
  if (!doi) return null;
  // Remove prefixes like "doi:", "https://doi.org/", "http://dx.doi.org/"
  const match = doi.match(/(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)/i);
  return match ? match[1] : null;
};

// --- DATA FETCHERS ---

// 1. OpenAlex Fetcher (Primary Source)
const fetchOpenAlex = async (doi: string): Promise<Partial<Reference> | null> => {
  try {
    const response = await fetch(`${OPENALEX_API}/https://doi.org/${doi}`);
    if (!response.ok) return null;
    const data = await response.json();
    
    return {
      title: data.title,
      year: data.publication_year?.toString(),
      venue: data.primary_location?.source?.display_name,
      citationCount: data.cited_by_count,
      abstract: reconstructAbstract(data.abstract_inverted_index),
      doi: data.doi ? cleanDOI(data.doi) || doi : doi,
      url: data.doi,
      fieldsOfStudy: data.concepts ? data.concepts.slice(0, 3).map((c: any) => c.display_name) : [],
      isVerified: true
    };
  } catch (e) {
    console.warn("OpenAlex lookup failed", e);
    return null;
  }
};

// 2. Semantic Scholar Fetcher (Great for Citation Counts, Influential Papers, Preprints)
const fetchSemanticScholar = async (doi: string): Promise<Partial<Reference> | null> => {
  try {
    const fields = "title,authors,year,abstract,venue,citationCount,fieldsOfStudy,url";
    const response = await fetch(`${SEMANTIC_SCHOLAR_API}/DOI:${doi}?fields=${fields}`);
    if (!response.ok) return null;
    const data = await response.json();

    return {
      title: data.title,
      year: data.year?.toString(),
      venue: data.venue,
      citationCount: data.citationCount,
      abstract: data.abstract,
      authors: data.authors?.map((a: any) => a.name) || [],
      fieldsOfStudy: data.fieldsOfStudy || [],
      url: data.url,
      isVerified: true
    };
  } catch (e) {
    // Semantic Scholar often 404s on very new or obscure DOIs, or rate limits.
    return null;
  }
};

// 3. CrossRef Fetcher (Source of Truth for DOIs, Venue Names)
const fetchCrossRef = async (doi: string): Promise<Partial<Reference> | null> => {
  try {
    const response = await fetch(`${CROSSREF_API}/${doi}`);
    if (!response.ok) return null;
    const json = await response.json();
    const data = json.message;

    return {
      title: data.title?.[0],
      year: data.created?.['date-parts']?.[0]?.[0]?.toString(),
      venue: data['container-title']?.[0],
      authors: data.author?.map((a: any) => `${a.given} ${a.family}`) || [],
      url: data.URL,
      isVerified: true
    };
  } catch (e) {
    return null;
  }
};

// Search OpenAlex by Title to resolve DOI
const resolveDoiFromTitle = async (title: string): Promise<string | null> => {
   try {
        const query = encodeURIComponent(title.replace(/[^\w\s]/gi, ''));
        const response = await fetch(`${OPENALEX_API}?filter=title.search:${query}&per-page=1`);
        if (response.ok) {
            const result = await response.json();
            if (result.results && result.results.length > 0) {
                // Return DOI if available
                const hit = result.results[0];
                return cleanDOI(hit.doi);
            }
        }
        return null;
   } catch (e) {
       return null;
   }
};

// Generate BibTeX string
const generateBibTeX = (ref: Reference): string => {
    const id = ref.citationKey || `ref${Math.floor(Math.random() * 1000)}`;
    const authorStr = ref.authors.join(" and ");
    return `@article{${id},
  title={${ref.title}},
  author={${authorStr}},
  journal={${ref.venue || "Preprint"}},
  year={${ref.year}},
  doi={${ref.doi || ""}}
}`;
};

// --- MAIN VALIDATION ENGINE ---

export const validateReference = async (ref: Reference): Promise<Reference> => {
    // 1. Identify DOI
    let doi = cleanDOI(ref.doi || '');
    
    // If no DOI, attempt resolution via title
    if (!doi) {
        doi = await resolveDoiFromTitle(ref.title);
    }

    if (!doi) {
        // Validation Failed: No DOI found/resolved
        return { ...ref, isVerified: false };
    }

    // 2. Parallel Fetch from Verified Sources
    const [oaResult, ssResult, crResult] = await Promise.allSettled([
        fetchOpenAlex(doi),
        fetchSemanticScholar(doi),
        fetchCrossRef(doi)
    ]);

    const oaData = oaResult.status === 'fulfilled' ? oaResult.value : null;
    const ssData = ssResult.status === 'fulfilled' ? ssResult.value : null;
    const crData = crResult.status === 'fulfilled' ? crResult.value : null;

    // 3. Merge Strategy (Priority: OpenAlex > Semantic Scholar > CrossRef)
    // We start with the input ref, then overlay authoritative data.
    
    // Base: if any service verified it, it's valid.
    const isVerified = !!(oaData || ssData || crData);
    
    if (!isVerified) {
        return { ...ref, isVerified: false };
    }

    let merged: Reference = { ...ref, doi: doi, isVerified: true };

    // Helper to merge fields if they exist in source
    const mergeSource = (source: Partial<Reference> | null) => {
        if (!source) return;
        if (source.title) merged.title = source.title; // Update title to official
        if (source.year) merged.year = source.year;
        if (source.venue) merged.venue = source.venue;
        if (source.authors && source.authors.length > 0) merged.authors = source.authors;
        if (source.abstract && source.abstract.length > 50) merged.abstract = source.abstract; // Only overwrite if substantial
        if (source.citationCount !== undefined && (source.citationCount > (merged.citationCount || 0))) {
             merged.citationCount = source.citationCount;
        }
        if (source.fieldsOfStudy) merged.fieldsOfStudy = source.fieldsOfStudy;
        if (source.url) merged.url = source.url;
    };

    // Apply merges (Least trusted to most trusted or specific overrides)
    
    // CrossRef is great for Venue/Year/DOI precision
    mergeSource(crData);
    
    // Semantic Scholar is best for Abstracts and Citations
    mergeSource(ssData);
    
    // OpenAlex is best overall balance and Fields
    mergeSource(oaData);

    // 4. Generate BibTeX
    merged.bibtex = generateBibTeX(merged);

    return merged;
};

export const validateBatch = async (
  refs: Reference[], 
  onProgress?: (completed: number, total: number, lastTitle: string) => void
): Promise<Reference[]> => {
    let completed = 0;
    
    // Concurrency limit could be applied here if needed, but for <20 refs Promise.all is fine
    const promises = refs.map(async (ref) => {
        const validatedRef = await validateReference(ref);
        completed++;
        if (onProgress) {
            onProgress(completed, refs.length, validatedRef.title);
        }
        return validatedRef;
    });

    return Promise.all(promises);
};