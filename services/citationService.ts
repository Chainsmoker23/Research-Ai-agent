import { Reference } from '../types';

const OPENALEX_API = "https://api.openalex.org/works";

// Helper to reconstruct abstract from inverted index provided by OpenAlex
const reconstructAbstract = (invertedIndex: any): string => {
  if (!invertedIndex) return "";
  const words: { word: string; index: number }[] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    (positions as number[]).forEach(pos => words.push({ word, index: pos }));
  }
  return words.sort((a, b) => a.index - b.index).map(w => w.word).join(" ");
};

export const validateReference = async (ref: Reference): Promise<Reference> => {
  try {
    let data;
    
    // Strategy 1: DOI Lookup (High precision)
    if (ref.doi) {
        const cleanDoi = ref.doi.replace(/^doi:/i, '').trim();
        // Remove https://doi.org/ prefix if present in the stored DOI to avoid double prefixing
        const doiPath = cleanDoi.replace(/^(https?:\/\/)?(dx\.)?doi\.org\//, '');
        
        const response = await fetch(`${OPENALEX_API}/https://doi.org/${doiPath}`);
        if (response.ok) {
            data = await response.json();
        }
    }

    // Strategy 2: Title Search (Fuzzy fallback if DOI fails or doesn't exist)
    if (!data) {
        // Clean title for search
        const query = encodeURIComponent(ref.title.replace(/[^\w\s]/gi, ''));
        const response = await fetch(`${OPENALEX_API}?filter=title.search:${query}&per-page=1`);
        if (response.ok) {
            const result = await response.json();
            if (result.results && result.results.length > 0) {
                // We could add Levenshtein distance check here for strictness
                data = result.results[0];
            }
        }
    }

    if (data) {
        // Map OpenAlex data to our schema
        return {
            ...ref,
            isVerified: true,
            // Prefer official metadata
            title: data.title || ref.title, 
            year: data.publication_year ? data.publication_year.toString() : ref.year,
            doi: data.doi ? data.doi.replace('https://doi.org/', '') : ref.doi,
            venue: data.primary_location?.source?.display_name || ref.source,
            citationCount: data.cited_by_count,
            abstract: reconstructAbstract(data.abstract_inverted_index),
            url: data.doi || data.primary_location?.landing_page_url || ref.url
        };
    }

    // If API returns nothing, it remains unverified but we keep the Gemini data
    return { ...ref, isVerified: false };
  } catch (error) {
    console.warn("Validation failed for ref:", ref.title, error);
    return { ...ref, isVerified: false };
  }
};

export const validateBatch = async (
  refs: Reference[], 
  onProgress?: (completed: number, total: number, lastTitle: string) => void
): Promise<Reference[]> => {
    let completed = 0;
    
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