import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import apiRequest from '../../utils/apiRequest';

export const useGoogleRating = ({ companyName, brandName, setFormData }) => {
  const hasFetchedRef = useRef(false);
  const lastUsedRef = useRef({ companyName: '', brandName: '' });

  useEffect(() => {
    const fetchGoogleRatingUrl = async (query, label) => {
      if (!query || query.trim().length < 3) return null;

      try {
        const response = await apiRequest({
          url: '/mic-login/googleRating',
          method: 'GET',
          params: { query },
        });

        const result = response?.data;
        const rating = result?.google_rating;
        const url = result?.google_rating_url;

        const isValidRating =
          typeof rating === 'number' || (!isNaN(rating) && rating !== 'N/A');

        if (isValidRating && url) {
          return { rating, url, source: label };
        }
      } catch (error) {
        console.error(`Google Rating API error for ${label}:`, error);
      }

      return null;
    };

    const attemptFetch = async () => {
      const currentCompany = companyName?.trim();
      const currentBrand = brandName?.trim();

      const validCompany = currentCompany?.length >= 3;
      const validBrand = currentBrand?.length >= 3;

      if (!validCompany && !validBrand) return;

      const hasChanged =
        lastUsedRef.current.companyName !== currentCompany ||
        lastUsedRef.current.brandName !== currentBrand;

      if (hasChanged) {
        hasFetchedRef.current = false;
        lastUsedRef.current = {
          companyName: currentCompany,
          brandName: currentBrand,
        };
      }

      if (hasFetchedRef.current) return;

      let final = null;

      //  Step 1: Try company name
      if (validCompany) {
        final = await fetchGoogleRatingUrl(currentCompany, 'company_name');
        if (final) {
          hasFetchedRef.current = true;
          setFormData((prev) => ({
            ...prev,
            google_rating: final.rating,
            google_rating_url: final.url,
          }));
          toast.success(`Fetched Google rating & URL using ${final.source}`);
          return;
        }
      }

      //  Step 2: Company failed → try brand name
      let triedBrand = false;
      if (!final && validCompany && validBrand) {
        toast.info('Failed to fetch via company name, trying brand name...');
      }
      if (!final && validBrand) {
        triedBrand = true;
        final = await fetchGoogleRatingUrl(currentBrand, 'brand_name');
        if (final) {
          hasFetchedRef.current = true;
          setFormData((prev) => ({
            ...prev,
            google_rating: final.rating,
            google_rating_url: final.url,
          }));
          toast.success(`Fetched Google rating & URL using ${final.source}`);
          return;
        }
      }

      //  Step 3: Both failed → Only show error if both were attempted and failed
      if (!final && validCompany && (validBrand || !triedBrand)) {
        toast.error('Failed to fetch Google rating & URL, enter manually.');
      }
    };

    const debounceTimer = setTimeout(attemptFetch, 1500);
    return () => clearTimeout(debounceTimer);
  }, [companyName, brandName, setFormData]);
};
