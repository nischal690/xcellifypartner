// src/hooks/useGoogleRating.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import apiRequest from '../../utils/apiRequest';

export const useGoogleRating = ({ companyName, setFormData }) => {
  useEffect(() => {
    const fetchGoogleRatingUrl = async () => {
      const query = companyName?.trim();
      if (!query || query.length < 3) return;

      try {
        const response = await apiRequest({
          url: '/mic-login/googleRating',
          method: 'GET',
          params: { query },
        });

        const result = response?.data;
        console.log('Google Rating API Response:', result);

        if (result?.google_rating_url) {
          setFormData((prev) => ({
            ...prev,
            google_rating_url: result.google_rating_url,
            google_rating: result.google_rating || '',
          }));

          toast.success('Fetched Google rating & URL');
        }
      } catch (error) {
        console.error('Google Rating API error:', error);
        toast.error('Failed to fetch Google rating & URL enter manually');
      }
    };

    const debounceTimer = setTimeout(fetchGoogleRatingUrl, 1500);
    return () => clearTimeout(debounceTimer);
  }, [companyName]);
};
